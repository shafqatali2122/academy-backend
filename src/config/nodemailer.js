import nodemailer from 'nodemailer';

// This function creates the 'transport' object
// We will use the settings from our .env file
export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587), // 587 is a common port
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your email password or App Password
  },
});