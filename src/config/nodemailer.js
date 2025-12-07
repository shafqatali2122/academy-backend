import nodemailer from 'nodemailer';

// Port 587 is used by SendGrid
const SMTP_PORT = 587;

export const mailer = nodemailer.createTransport({
    // Uses SMTP_HOST (smtp.sendgrid.net) from environment variables
    host: process.env.SMTP_HOST, 
    port: SMTP_PORT,
    // Must be false for port 587
    secure: false, 
    // CRUCIAL: Enables the necessary STARTTLS handshake for port 587
    requireTLS: true, 
    auth: {
        // Uses SMTP_USER (apikey) from environment variables
        user: process.env.SMTP_USER, 
        // Uses SMTP_PASS (SendGrid API Key) from environment variables
        pass: process.env.SMTP_PASS, 
    },
});