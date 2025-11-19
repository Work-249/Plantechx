const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { docClient, TABLES, QueryCommand, PutCommand, UpdateCommand } = require('../config/dynamodb');
const { auth } = require('../middleware/auth-dynamodb');
const { body, validationResult } = require('express-validator');
const logger = require('../middleware/logger');

const router = express.Router();

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Login validation failed', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    logger.info('Login attempt', { email });

    const queryParams = {
      TableName: TABLES.USERS,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await docClient.send(new QueryCommand(queryParams));
    const user = result.Items && result.Items.length > 0 ? result.Items[0] : null;

    if (!user || !user.isActive) {
      logger.warn('Login failed - user not found', { email });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn('Login failed - invalid password', { email, userId: user.id });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update login tracking
    const updateParams = {
      TableName: TABLES.USERS,
      Key: { id: user.id },
      UpdateExpression: 'SET lastLogin = :now, hasLoggedIn = :true, loginCount = :count',
      ExpressionAttributeValues: {
        ':now': new Date().toISOString(),
        ':true': true,
        ':count': (user.loginCount || 0) + 1
      }
    };

    await docClient.send(new UpdateCommand(updateParams));

    logger.authLog('LOGIN_SUCCESS', user, { ip: req.ip });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Get college info if collegeId exists
    let collegeName = null;
    if (user.collegeId) {
      const collegeParams = {
        TableName: TABLES.COLLEGES,
        Key: { id: user.collegeId }
      };
      const collegeResult = await docClient.send(new QueryCommand(collegeParams));
      if (collegeResult.Item) {
        collegeName = collegeResult.Item.name;
      }
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      collegeName: collegeName,
      hasLoggedIn: user.hasLoggedIn,
      lastLogin: user.lastLogin
    };

    logger.info('Login successful', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({ token, user: userResponse });
  } catch (error) {
    logger.errorLog(error, { context: 'User Login', email: req.body.email });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const getParams = {
      TableName: TABLES.USERS,
      Key: { id: req.user.id }
    };

    const result = await docClient.send(new QueryCommand(getParams));
    const user = result.Item;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get college info if collegeId exists
    let collegeName = null;
    if (user.collegeId) {
      const collegeParams = {
        TableName: TABLES.COLLEGES,
        Key: { id: user.collegeId }
      };
      const collegeResult = await docClient.send(new QueryCommand(collegeParams));
      if (collegeResult.Item) {
        collegeName = collegeResult.Item.name;
      }
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      collegeName: collegeName,
      hasLoggedIn: user.hasLoggedIn,
      lastLogin: user.lastLogin,
      branch: user.branch,
      batch: user.batch,
      section: user.section,
      phoneNumber: user.phoneNumber,
      companyName: user.companyName,
      companyAddress: user.companyAddress
    };

    res.json(userResponse);
  } catch (error) {
    logger.errorLog(error, { context: 'Get Current User', userId: req.user.id });
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const getParams = {
      TableName: TABLES.USERS,
      Key: { id: req.user.id }
    };

    const result = await docClient.send(new QueryCommand(getParams));
    const user = result.Item;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updateParams = {
      TableName: TABLES.USERS,
      Key: { id: req.user.id },
      UpdateExpression: 'SET password = :password',
      ExpressionAttributeValues: {
        ':password': hashedPassword
      }
    };

    await docClient.send(new UpdateCommand(updateParams));

    logger.info('Password changed', { userId: req.user.id });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.errorLog(error, { context: 'Change Password', userId: req.user.id });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
