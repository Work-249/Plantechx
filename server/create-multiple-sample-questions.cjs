const mongoose = require('mongoose');
require('dotenv').config();

const CodingQuestion = require('./models/CodingQuestion');
const CodingTestCase = require('./models/CodingTestCase');

const sampleQuestions = [
  {
    title: "Sum of Two Numbers",
    description: `Write a program that takes two numbers as input and returns their sum.

This is a simple problem to test the coding interface.

Example:
Input: 5 and 10
Output: 15`,
    difficulty: "easy",
    points: 50,
    time_limit: 5000,
    memory_limit: 256,
    constraints: "1 <= a, b <= 1000",
    input_format: "Two integers on separate lines",
    output_format: "Single integer (sum of the two numbers)",
    sample_input: "5\n10",
    sample_output: "15",
    explanation: "5 + 10 = 15",
    supported_languages: ["javascript", "python"],
    tags: ["easy", "math", "basics"],
    testCases: [
      { input: "5\n10", expected_output: "15", is_sample: true, weight: 20 },
      { input: "100\n200", expected_output: "300", is_sample: false, weight: 20 },
      { input: "0\n0", expected_output: "0", is_sample: false, weight: 20 },
      { input: "999\n1", expected_output: "1000", is_sample: false, weight: 20 },
      { input: "50\n50", expected_output: "100", is_sample: false, weight: 20 }
    ]
  },
  {
    title: "Reverse a String",
    description: `Write a program that takes a string as input and returns the string reversed.

For example:
Input: "hello"
Output: "olleh"`,
    difficulty: "easy",
    points: 75,
    time_limit: 5000,
    memory_limit: 256,
    constraints: "1 <= string length <= 1000",
    input_format: "A single line containing a string",
    output_format: "The reversed string",
    sample_input: "hello",
    sample_output: "olleh",
    explanation: "The string 'hello' reversed is 'olleh'",
    supported_languages: ["javascript", "python"],
    tags: ["easy", "string", "basics"],
    testCases: [
      { input: "hello", expected_output: "olleh", is_sample: true, weight: 20 },
      { input: "world", expected_output: "dlrow", is_sample: false, weight: 20 },
      { input: "a", expected_output: "a", is_sample: false, weight: 20 },
      { input: "racecar", expected_output: "racecar", is_sample: false, weight: 20 },
      { input: "JavaScript", expected_output: "tpircSavaJ", is_sample: false, weight: 20 }
    ]
  },
  {
    title: "Find Maximum in Array",
    description: `Write a program that finds the maximum number in an array.

Input:
- First line: n (number of elements)
- Second line: n space-separated integers

Output:
- The maximum number in the array

Example:
Input:
5
3 7 2 9 1

Output:
9`,
    difficulty: "easy",
    points: 100,
    time_limit: 5000,
    memory_limit: 256,
    constraints: "1 <= n <= 1000, -1000 <= array[i] <= 1000",
    input_format: "First line: integer n\nSecond line: n space-separated integers",
    output_format: "Single integer (the maximum number)",
    sample_input: "5\n3 7 2 9 1",
    sample_output: "9",
    explanation: "The maximum number in [3, 7, 2, 9, 1] is 9",
    supported_languages: ["javascript", "python"],
    tags: ["easy", "array", "basics"],
    testCases: [
      { input: "5\n3 7 2 9 1", expected_output: "9", is_sample: true, weight: 20 },
      { input: "3\n-5 -2 -10", expected_output: "-2", is_sample: false, weight: 20 },
      { input: "1\n42", expected_output: "42", is_sample: false, weight: 20 },
      { input: "6\n100 200 50 300 150 250", expected_output: "300", is_sample: false, weight: 20 },
      { input: "4\n0 0 0 1", expected_output: "1", is_sample: false, weight: 20 }
    ]
  },
  {
    title: "Palindrome Check",
    description: `Write a program to check if a given string is a palindrome (reads the same forwards and backwards).

A palindrome is a word, phrase, or sequence that reads the same backward as forward.

Input: A single string (no spaces)
Output: "YES" if palindrome, "NO" otherwise

Example:
Input: racecar
Output: YES

Input: hello
Output: NO`,
    difficulty: "medium",
    points: 150,
    time_limit: 5000,
    memory_limit: 256,
    constraints: "1 <= string length <= 1000",
    input_format: "A single line containing a string (no spaces)",
    output_format: "YES or NO",
    sample_input: "racecar",
    sample_output: "YES",
    explanation: "'racecar' is the same when read forwards and backwards",
    supported_languages: ["javascript", "python"],
    tags: ["medium", "string", "palindrome"],
    testCases: [
      { input: "racecar", expected_output: "YES", is_sample: true, weight: 20 },
      { input: "hello", expected_output: "NO", is_sample: false, weight: 20 },
      { input: "a", expected_output: "YES", is_sample: false, weight: 20 },
      { input: "noon", expected_output: "YES", is_sample: false, weight: 20 },
      { input: "palindrome", expected_output: "NO", is_sample: false, weight: 20 }
    ]
  },
  {
    title: "Fibonacci Number",
    description: `Write a program to find the nth Fibonacci number.

The Fibonacci sequence is defined as:
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2) for n > 1

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...

Input: An integer n (0-indexed)
Output: The nth Fibonacci number

Example:
Input: 6
Output: 8

Explanation: F(6) = 8 (the sequence is 0,1,1,2,3,5,8)`,
    difficulty: "medium",
    points: 200,
    time_limit: 5000,
    memory_limit: 256,
    constraints: "0 <= n <= 30",
    input_format: "A single integer n",
    output_format: "The nth Fibonacci number",
    sample_input: "6",
    sample_output: "8",
    explanation: "F(6) = F(5) + F(4) = 5 + 3 = 8",
    supported_languages: ["javascript", "python"],
    tags: ["medium", "recursion", "dynamic-programming"],
    testCases: [
      { input: "6", expected_output: "8", is_sample: true, weight: 20 },
      { input: "0", expected_output: "0", is_sample: false, weight: 20 },
      { input: "1", expected_output: "1", is_sample: false, weight: 20 },
      { input: "10", expected_output: "55", is_sample: false, weight: 20 },
      { input: "15", expected_output: "610", is_sample: false, weight: 20 }
    ]
  }
];

async function createSampleQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');
    console.log('Creating sample coding questions...\n');

    let created = 0;
    let skipped = 0;
    const questionIds = [];

    for (const questionData of sampleQuestions) {
      const { testCases, ...questionFields } = questionData;

      const existing = await CodingQuestion.findOne({ title: questionFields.title });
      if (existing) {
        console.log(`⏭️  Skipped: "${questionFields.title}" (already exists)`);
        questionIds.push(existing._id);
        skipped++;
        continue;
      }

      const question = new CodingQuestion({
        ...questionFields,
        created_by: null
      });
      await question.save();

      const testCasesData = testCases.map(tc => ({
        question_id: question._id,
        ...tc
      }));

      await CodingTestCase.insertMany(testCasesData);

      console.log(`✅ Created: "${questionFields.title}" (${questionFields.difficulty})`);
      console.log(`   ID: ${question._id}`);
      console.log(`   Test Cases: ${testCases.length}`);
      questionIds.push(question._id);
      created++;
    }

    console.log('\n=================================');
    console.log('Summary:');
    console.log('=================================');
    console.log(`✅ Created: ${created} questions`);
    console.log(`⏭️  Skipped: ${skipped} questions (already exist)`);
    console.log(`📊 Total: ${questionIds.length} coding questions available`);

    if (created > 0) {
      console.log('\n=================================');
      console.log('Next Steps:');
      console.log('=================================');
      console.log('1. Go to the Faculty Dashboard');
      console.log('2. Create a new test or edit an existing one');
      console.log('3. Add a "Coding Section" to the test');
      console.log('4. Select questions from the list');
      console.log('5. Students can now practice coding!');
    }

    console.log('\n=================================');
    console.log('Question IDs for reference:');
    console.log('=================================');
    questionIds.forEach((id, index) => {
      console.log(`${index + 1}. ${id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample questions:', error);
    process.exit(1);
  }
}

createSampleQuestions();
