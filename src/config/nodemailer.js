import nodemailer from 'nodemailer';

// --- Use this configuration block ---

const SMTP_PORT = Number(process.env.SMTP_PORT || 587);

export const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: SMTP_PORT,
    // Set secure: true if the port is 465 (SMTPS)
    secure: SMTP_PORT === 465, 
    // If using port 587, require TLS explicitly (often fixes timeouts)
    requireTLS: SMTP_PORT === 587, 
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
    },
});