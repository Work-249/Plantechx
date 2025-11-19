const jwt = require('jsonwebtoken');
const { docClient, TABLES, QueryCommand, GetCommand } = require('../config/dynamodb');
const logger = require('./logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      logger.warn('Authentication failed - no token provided', {
        ip: req.ip,
        url: req.url
      });
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const getParams = {
      TableName: TABLES.USERS,
      Key: { id: decoded.id }
    };

    const result = await docClient.send(new GetCommand(getParams));
    const user = result.Item;

    if (!user || !user.isActive) {
      logger.warn('Authentication failed - user not found or inactive', {
        userId: decoded.id,
        ip: req.ip
      });
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    req.user = {
      id: user.id,
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      isActive: user.isActive
    };

    logger.debug('Authentication successful', {
      userId: user.id,
      role: user.role,
      url: req.url
    });
    next();
  } catch (error) {
    logger.warn('Authentication failed - invalid token', {
      error: error.message,
      ip: req.ip
    });
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed - insufficient permissions', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: roles,
        url: req.url
      });
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }
    logger.debug('Authorization successful', {
      userId: req.user.id,
      role: req.user.role,
      url: req.url
    });
    next();
  };
};

const collegeAccess = async (req, res, next) => {
  try {
    if (req.user.role === 'master_admin') {
      logger.debug('College access granted - master admin', { userId: req.user.id });
      return next();
    }

    const requestedCollegeId = req.params.collegeId || req.body.collegeId;

    if (requestedCollegeId && requestedCollegeId !== req.user.collegeId) {
      logger.warn('College access denied - different college', {
        userId: req.user.id,
        userCollegeId: req.user.collegeId,
        requestedCollegeId
      });
      return res.status(403).json({
        error: 'Access denied. You can only access your college data.'
      });
    }

    logger.debug('College access granted', {
      userId: req.user.id,
      collegeId: req.user.collegeId
    });
    next();
  } catch (error) {
    logger.errorLog(error, { context: 'College Access Check', userId: req.user?.id });
    res.status(500).json({ error: 'Server error during authorization' });
  }
};

module.exports = { auth, authorize, collegeAccess };
