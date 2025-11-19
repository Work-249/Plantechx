const express = require('express');
const { docClient, TABLES, ScanCommand, QueryCommand } = require('../config/dynamodb');
const { auth, authorize } = require('../middleware/auth-dynamodb');
const logger = require('../middleware/logger');

const router = express.Router();

// Get colleges (Master Admin only)
router.get('/colleges', auth, authorize('master_admin'), async (req, res) => {
  try {
    const scanParams = {
      TableName: TABLES.COLLEGES,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    };

    const result = await docClient.send(new ScanCommand(scanParams));
    const colleges = result.Items || [];

    // Get admin info for each college
    const collegesWithStats = await Promise.all(colleges.map(async (college) => {
      let adminInfo = null;

      if (college.adminId) {
        try {
          const adminParams = {
            TableName: TABLES.USERS,
            Key: { id: college.adminId }
          };
          const adminResult = await docClient.send(new QueryCommand(adminParams));
          if (adminResult.Item) {
            adminInfo = {
              name: adminResult.Item.name,
              email: adminResult.Item.email,
              hasLoggedIn: adminResult.Item.hasLoggedIn,
              lastLogin: adminResult.Item.lastLogin
            };
          }
        } catch (err) {
          logger.warn('Failed to fetch admin info', { collegeId: college.id, adminId: college.adminId });
        }
      }

      return {
        id: college.id,
        name: college.name,
        code: college.code,
        email: college.email,
        address: college.address,
        totalFaculty: college.totalFaculty || 0,
        totalStudents: college.totalStudents || 0,
        adminInfo: adminInfo,
        createdAt: college.createdAt,
        isActive: college.isActive
      };
    }));

    // Sort by creation date (newest first)
    collegesWithStats.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(collegesWithStats);
  } catch (error) {
    logger.errorLog(error, { context: 'Get colleges error' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get admin statistics (Master Admin only)
router.get('/stats', auth, authorize('master_admin'), async (req, res) => {
  try {
    // Get all colleges
    const collegesParams = {
      TableName: TABLES.COLLEGES,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    };

    // Get all users
    const usersParams = {
      TableName: TABLES.USERS,
      FilterExpression: 'isActive = :active',
      ExpressionAttributeValues: {
        ':active': true
      }
    };

    const [collegesResult, usersResult] = await Promise.all([
      docClient.send(new ScanCommand(collegesParams)),
      docClient.send(new ScanCommand(usersParams))
    ]);

    const colleges = collegesResult.Items || [];
    const users = usersResult.Items || [];

    // Count users by role
    const totalFaculty = users.filter(u => u.role === 'faculty').length;
    const totalStudents = users.filter(u => u.role === 'student').length;

    // Get recent logins
    const usersWithLogins = users
      .filter(u => ['college_admin', 'faculty', 'student'].includes(u.role) && u.lastLogin)
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .slice(0, 10);

    // Get college names for recent logins
    const recentLogins = await Promise.all(usersWithLogins.map(async (user) => {
      let collegeName = null;
      if (user.collegeId) {
        try {
          const collegeParams = {
            TableName: TABLES.COLLEGES,
            Key: { id: user.collegeId }
          };
          const collegeResult = await docClient.send(new QueryCommand(collegeParams));
          if (collegeResult.Item) {
            collegeName = collegeResult.Item.name;
          }
        } catch (err) {
          logger.warn('Failed to fetch college name', { userId: user.id, collegeId: user.collegeId });
        }
      }

      return {
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        collegeId: user.collegeId,
        collegeName: collegeName
      };
    }));

    res.json({
      totalColleges: colleges.length,
      totalFaculty: totalFaculty,
      totalStudents: totalStudents,
      totalTests: 0,
      activeTests: 0,
      completedTests: 0,
      recentLogins: recentLogins
    });
  } catch (error) {
    logger.errorLog(error, { context: 'Get admin stats error' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
