const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1'
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'AcademicManagement-Users',
  COLLEGES: process.env.DYNAMODB_COLLEGES_TABLE || 'AcademicManagement-Colleges'
};

async function tableExists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createUsersTable() {
  const exists = await tableExists(TABLES.USERS);
  if (exists) {
    console.log(`✓ Table ${TABLES.USERS} already exists`);
    return;
  }

  console.log(`Creating table ${TABLES.USERS}...`);

  const params = {
    TableName: TABLES.USERS,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  await client.send(new CreateTableCommand(params));
  console.log(`✓ Table ${TABLES.USERS} created successfully`);
}

async function createCollegesTable() {
  const exists = await tableExists(TABLES.COLLEGES);
  if (exists) {
    console.log(`✓ Table ${TABLES.COLLEGES} already exists`);
    return;
  }

  console.log(`Creating table ${TABLES.COLLEGES}...`);

  const params = {
    TableName: TABLES.COLLEGES,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  await client.send(new CreateTableCommand(params));
  console.log(`✓ Table ${TABLES.COLLEGES} created successfully`);
}

async function createMasterAdmin() {
  console.log('Creating master admin user...');

  const password = await bcrypt.hash('Admin@123', 12);
  const adminId = uuidv4();

  const params = {
    TableName: TABLES.USERS,
    Item: {
      id: adminId,
      name: 'Master Administrator',
      email: 'admin@example.com',
      password: password,
      role: 'master_admin',
      isActive: true,
      hasLoggedIn: false,
      loginCount: 0,
      companyName: 'Academic Management System',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    ConditionExpression: 'attribute_not_exists(id)'
  };

  try {
    await docClient.send(new PutCommand(params));
    console.log('✓ Master admin created successfully');
    console.log('  Email: admin@example.com');
    console.log('  Password: Admin@123');
  } catch (error) {
    if (error.name === 'ConditionalCheckFailedException') {
      console.log('✓ Master admin already exists');
    } else {
      throw error;
    }
  }
}

async function init() {
  try {
    console.log('Initializing DynamoDB tables...\n');

    await createUsersTable();
    await createCollegesTable();

    console.log('\nWaiting for tables to be active...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    await createMasterAdmin();

    console.log('\n✅ DynamoDB initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing DynamoDB:', error);
    process.exit(1);
  }
}

init();
