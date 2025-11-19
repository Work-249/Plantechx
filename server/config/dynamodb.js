const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('../middleware/logger');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  } : {})
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false
  },
  unmarshallOptions: {
    wrapNumbers: false
  }
});

const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'AcademicManagement-Users',
  COLLEGES: process.env.DYNAMODB_COLLEGES_TABLE || 'AcademicManagement-Colleges',
  TESTS: process.env.DYNAMODB_TESTS_TABLE || 'AcademicManagement-Tests',
  TEST_ASSIGNMENTS: process.env.DYNAMODB_TEST_ASSIGNMENTS_TABLE || 'AcademicManagement-TestAssignments',
  TEST_ATTEMPTS: process.env.DYNAMODB_TEST_ATTEMPTS_TABLE || 'AcademicManagement-TestAttempts',
  CODING_QUESTIONS: process.env.DYNAMODB_CODING_QUESTIONS_TABLE || 'AcademicManagement-CodingQuestions',
  SUBJECTS: process.env.DYNAMODB_SUBJECTS_TABLE || 'AcademicManagement-Subjects'
};

logger.info('DynamoDB client initialized', {
  region: process.env.AWS_REGION || 'ap-south-1',
  tables: TABLES
});

module.exports = {
  docClient,
  TABLES,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
};
