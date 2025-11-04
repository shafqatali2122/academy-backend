// backend/utils/email.js

const nodemailer = require('nodemailer');

// IMPORTANT: Replace these placeholders with YOUR credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or 'smtp', depending on your provider (e.g., Outlook, Yahoo)
    auth: {
        user: 'shafqatali2122@gmail.com', // e.g., 'academy.notifications@gmail.com'
        pass: 'akoi levs gdvy trnh', // Use an App Password if using Gmail, NOT your regular password
    },
});

// Template Function to send a confirmation email
const sendEnrollmentConfirmation = async ({ toEmail, subject, status, courseName }) => {
    let body = '';

    if (status === 'Accepted') {
        body = `
            Dear Student,

            Congratulations! We are delighted to inform you that your enrollment for the course 
            '${courseName}' has been officially ACCEPTED.

            Your next steps:
            1. Complete Payment: [Link to Payment/LMS Gateway - FUTURE STEP]
            2. Access Portal: Log into your student dashboard at [Your Website Link].

            We look forward to having you!

            Best regards,
            Shafqat Ali Academy
        `;
    } else if (status === 'Rejected') {
        body = `
            Dear Student,

            Thank you for your interest. We regret to inform you that your enrollment for the course 
            '${courseName}' has been DECLINED at this time. This may be due to full capacity or missing information.

            Please contact our admissions team for clarification.

            Best regards,
            Shafqat Ali Academy
        `;
    }

    const mailOptions = {
        from: '"Shafqat Ali Academy" <shafqatali2122@gmail.com>',
        to: toEmail,
        subject: `Enrollment Update: ${subject}`,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${toEmail} for status: ${status}`);
    } catch (error) {
        console.error(`ERROR: Failed to send email to ${toEmail}:`, error.message);
    }
};

module.exports = { sendEnrollmentConfirmation };