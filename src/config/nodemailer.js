import nodemailer from 'nodemailer';

// Use Port 465 for the most reliable SMTPS connection with Gmail
const SMTP_PORT = 465;

export const mailer = nodemailer.createTransport({
    // Uses SMTP_HOST (smtp.gmail.com) from environment variables
    host: process.env.SMTP_HOST, 
    port: SMTP_PORT,
    // Must be TRUE for Port 465 (SMTPS)
    secure: true, 
    // requireTLS is not needed when secure is true
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
    },
});