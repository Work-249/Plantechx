const mongoose = require('mongoose');
require('dotenv').config();

const CodingSubmission = require('./models/CodingSubmission');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');

  // Find all coding submissions
  const submissions = await CodingSubmission.find({}).populate('question_id student_id');

  console.log('\n=== CODING SUBMISSIONS IN DATABASE ===');
  console.log(`Total submissions found: ${submissions.length}\n`);

  submissions.forEach((sub, index) => {
    console.log(`${index + 1}. Submission ID: ${sub._id}`);
    console.log(`   Student ID: ${sub.student_id?._id || sub.student_id}`);
    console.log(`   Student Name: ${sub.student_id?.name || 'N/A'}`);
    console.log(`   Question ID: ${sub.question_id?._id || sub.question_id}`);
    console.log(`   Question Title: ${sub.question_id?.title || 'N/A'}`);
    console.log(`   Language: ${sub.language}`);
    console.log(`   Status: ${sub.status}`);
    console.log(`   Score: ${sub.score}`);
    console.log(`   Test Cases: ${sub.test_cases_passed}/${sub.total_test_cases}`);
    console.log(`   Submitted At: ${sub.submitted_at}`);
    console.log('');
  });

  mongoose.connection.close();
  console.log('Connection closed');
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
