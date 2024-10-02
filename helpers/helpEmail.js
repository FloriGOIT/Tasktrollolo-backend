const nodemailer = require('nodemailer');
require("dotenv").config();

const { OUTLOOK_HOST, OUTLOOK_EMAIL, OUTLOOK_PASS } = process.env;

const emailConfig = {
  host: OUTLOOK_HOST,
  port: 465,
  secure: true,
  auth: {
    user: OUTLOOK_EMAIL,
    pass: OUTLOOK_PASS,
  },
};

const transport = nodemailer.createTransport(emailConfig);

const helpEmail = async (data) => {
  const { email, text } = data;
  const emailConfiguration = {
    to: "taskpro.project@gmail.com",
    from: OUTLOOK_EMAIL,
    subject: `New Message from ${email}`,
    text,
  };

  try {
    await transport.sendEmail(emailConfiguration);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = helpEmail;