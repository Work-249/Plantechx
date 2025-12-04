# Coding Practice Setup Guide

## What I Fixed

1. **TestCodingSection Component** - Added proper error handling for when coding questions are missing or not loaded
2. **User-Friendly Messages** - The UI now shows clear messages when:
   - No coding questions are configured
   - Questions fail to load
   - Provides options to go back or refresh

## The Coding Interface

The coding practice UI has been designed with these features:

### Layout
- **Split View**: Problem description on the left (40%), code editor on the right (60%)
- **Collapsible Sections**: Problem description and output can be collapsed for more space
- **Full-Screen Mode**: CodeEditor supports fullscreen for focused coding

### Features
- **Multi-Language Support**: JavaScript, Python, Java, C++ support
- **Live Code Editor**: Syntax-aware editor with line numbers
- **Auto-Save**: Code is automatically saved to localStorage every 10 seconds
- **Run Code**: Test against sample test cases before submission
- **Submit Code**: Run against all test cases and get scored
- **Test Results**: Visual feedback showing which test cases passed/failed
- **Timer**: Practice sessions include a timer
- **Progress Tracking**: Track solved, attempted, and not-attempted questions

## How to See the Coding UI

### Option 1: Add MongoDB Connection (Recommended)

1. Get a MongoDB connection string from:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
   - Local MongoDB installation

2. Add to your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   MASTER_ADMIN_EMAIL=admin@example.com
   MASTER_ADMIN_PASSWORD=securepassword123
   ```

3. Install dependencies and create sample questions:
   ```bash
   cd server
   npm install
   node create-multiple-sample-questions.cjs
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Option 2: Use Existing Questions

If your database already has coding questions:

1. Go to Faculty Dashboard
2. Create a new test or edit existing test
3. Add a "Coding Section"
4. Select questions from the available coding questions list
5. Assign the test to students

### Option 3: Directly Access Practice Mode

1. Make sure you're logged in as a student
2. Navigate to the Practice Coding section from the student dashboard
3. Select any available coding question
4. The full coding interface will load with:
   - Problem statement
   - Code editor
   - Test cases
   - Run and Submit buttons

## Coding Interface Features Breakdown

### Problem View (Left Panel)
- Problem title and difficulty badge
- Detailed description
- Input/Output format
- Sample test cases with explanations
- Constraints and limits
- Tags for categorization

### Code Editor (Right Panel)
- Language selector dropdown
- Monaco-style code editor with:
  - Syntax highlighting
  - Line numbers
  - Auto-indentation
  - Tab support
- Auto-save indicator
- Fullscreen toggle

### Output Panel (Bottom)
- Console output from code execution
- Test case results with:
  - Pass/Fail status
  - Input used
  - Expected vs Actual output
  - Execution time
  - Error messages if any

### Navigation
- Previous/Next buttons to move between questions
- Question number indicators
- Submission status badges
- Completion percentage

## Sample Questions Included

The `create-multiple-sample-questions.cjs` script creates 5 sample problems:

1. **Sum of Two Numbers** (Easy) - Basic I/O and arithmetic
2. **Reverse a String** (Easy) - String manipulation
3. **Find Maximum in Array** (Easy) - Array processing
4. **Palindrome Check** (Medium) - String algorithms
5. **Fibonacci Number** (Medium) - Recursion/Dynamic programming

Each question includes:
- Multiple test cases (sample + hidden)
- Proper scoring weights
- Support for JavaScript and Python
- Detailed explanations

## Testing the Interface

Once questions are loaded:

1. **As a Student**:
   - Go to Dashboard → Practice Coding
   - Click on any question
   - You'll see the full coding interface
   - Write code, run tests, submit solution

2. **In a Test**:
   - Take an assigned test with a coding section
   - The same interface loads but submissions are tracked
   - Timer is enforced
   - Can't go back after submitting

## Troubleshooting

### "Question 1 of 0" Error
- This means no coding questions are configured for this test/practice session
- Solution: Add questions via Faculty Dashboard or run the sample questions script

### "Question not available" Error
- The question ID exists but can't be loaded from database
- Solution: Check database connection and ensure question exists

### Code Won't Run
- Check that the selected language is supported
- Verify the code has no syntax errors
- Check browser console for errors

### No Questions Appear in Practice Mode
- Ensure sample questions script has been run
- Check database connection
- Verify coding questions exist in the database

## Next Steps

1. Set up MongoDB connection
2. Run the sample questions script
3. Log in as a student
4. Navigate to Practice Coding
5. Enjoy the fully functional coding interface!

## UI Preview

When properly set up, the coding interface displays:

```
┌─────────────────────────────────────────────────────────┐
│  [Code Icon] Sum of Two Numbers  [EASY]  [Python ▾]    │
│  Tags: easy, math, basics                               │
├──────────────────────┬──────────────────────────────────┤
│ Problem Description  │  Code Editor                     │
│                      │  1  # Sum of Two Numbers        │
│ Write a program that │  2  # Write your solution here  │
│ takes two numbers... │  3                               │
│                      │  4  a = int(input())            │
│ Input Format:        │  5  b = int(input())            │
│ Two integers on...   │  6  print(a + b)                │
│                      │  7                               │
│ Sample Input:        │                                  │
│ 5                    │  [Run Code]  [Submit]           │
│ 10                   │                                  │
│                      ├──────────────────────────────────┤
│ Sample Output:       │  Output & Test Results          │
│ 15                   │                                  │
│                      │  ✅ Test Case 1: Passed         │
│                      │  Execution time: 45ms           │
└──────────────────────┴──────────────────────────────────┘
```

The interface is fully responsive and provides an excellent coding practice experience!
