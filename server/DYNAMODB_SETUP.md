# DynamoDB Setup Guide

This guide explains how to set up AWS DynamoDB for the Academic Management System.

## Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Node.js installed

## AWS Configuration

### 1. Configure AWS CLI

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `ap-south-1`
- Default output format: `json`

### 2. Create IAM Policy (if needed)

Create an IAM policy with DynamoDB permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:CreateTable",
        "dynamodb:DescribeTable",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:*:table/AcademicManagement-*"
    }
  ]
}
```

## Database Initialization

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
AWS_REGION=ap-south-1
DYNAMODB_USERS_TABLE=AcademicManagement-Users
DYNAMODB_COLLEGES_TABLE=AcademicManagement-Colleges
JWT_SECRET=your-secret-key
```

3. Initialize DynamoDB tables and create master admin:
```bash
npm run init-db
```

This will:
- Create the Users table with EmailIndex
- Create the Colleges table
- Create a master admin user with credentials:
  - Email: `admin@example.com`
  - Password: `Admin@123`

### AWS Lambda Deployment

1. Set environment variables in `serverless.yml` or AWS Lambda console:
```
AWS_REGION=ap-south-1
JWT_SECRET=your-production-secret-key
DYNAMODB_USERS_TABLE=AcademicManagement-Users
DYNAMODB_COLLEGES_TABLE=AcademicManagement-Colleges
```

2. Ensure Lambda execution role has DynamoDB permissions

3. Deploy:
```bash
serverless deploy
```

## DynamoDB Tables

### Users Table
- **Primary Key**: `id` (String)
- **GSI**: `EmailIndex` on `email`
- **Attributes**:
  - id, name, email, password (bcrypt hashed)
  - role: master_admin | college_admin | faculty | student
  - collegeId, isActive, hasLoggedIn, loginCount
  - lastLogin, createdAt, updatedAt

### Colleges Table
- **Primary Key**: `id` (String)
- **Attributes**:
  - id, name, code, email, address
  - adminId, isActive
  - totalFaculty, totalStudents
  - createdAt, updatedAt

## Testing

Test the setup by logging in with master admin credentials:
- Email: `admin@example.com`
- Password: `Admin@123`

## Troubleshooting

### Table Already Exists
If tables already exist, the init script will skip creation.

### Access Denied
Ensure your AWS credentials have the necessary DynamoDB permissions.

### Region Mismatch
Verify `AWS_REGION` is set correctly in your environment variables.

## Cost Considerations

The tables are configured with:
- **Provisioned throughput**: 5 read/5 write capacity units
- **Estimated cost**: ~$2.50/month per table (varies by usage)

For production, consider:
- Auto-scaling
- On-demand billing mode
- Reserved capacity

## Security Best Practices

1. Never commit AWS credentials to version control
2. Use IAM roles for Lambda functions
3. Enable encryption at rest
4. Use VPC endpoints for private access
5. Implement least privilege access policies
6. Rotate JWT secrets regularly
