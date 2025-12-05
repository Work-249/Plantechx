// send-test-email.js
// Quick script to verify SMTP settings from your running environment.
// Usage (PowerShell):
// $env:EMAIL_HOST='smtp.zoho.com'
// $env:EMAIL_PORT='587'
// $env:EMAIL_USER='no.reply@plantechx.in'
// $env:EMAIL_PASS='YOUR_APP_PASSWORD'
// $env:EMAIL_FROM='no.reply@plantechx.in'
// $env:TEST_TO='yourpersonal@example.com'
// node .\send-test-email.js

const nodemailer = require('nodemailer');

async function run() {
  const host = process.env.EMAIL_HOST || 'smtp.zoho.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log('Testing SMTP connection with:', { host, port, user: user ? 'configured' : 'not configured' });

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    requireTLS: port !== 465,
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter.verify();
    console.log('SMTP verify: OK');
  } catch (err) {
    console.error('SMTP verify failed:', err && err.message ? err.message : err);
    process.exitCode = 2;
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || user,
      to: process.env.TEST_TO || user,
      subject: 'SMTP test from Plantechx',
      text: 'This is a test email from local nodemailer check.'
    });
    console.log('Send ok:', info && info.messageId ? `messageId=${info.messageId}` : info);
  } catch (err) {
    console.error('Send failed:', err && err.message ? err.message : err);
    process.exitCode = 3;
  }
}

run();
