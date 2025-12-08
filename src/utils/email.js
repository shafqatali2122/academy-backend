// server/utils/email.js (FINALIZED EMAIL TEMPLATES)

import { mailer } from '../config/nodemailer.js';

// --- BANK DETAILS ---
// Stored here for easy updating, as this is used only for the acceptance email.
const BANK_DETAILS = {
    title: 'Shafqat Ali',
    accountNumber: '0297278395358',
    iban: 'PK21UNIL0109000278395358',
    fee: 'PKR 15,000/-'
};

// --- TEMPLATE 1: INITIAL CONFIRMATION (STATUS: Pending) ---
function getPendingConfirmationHtml(studentName, courseOfInterest) {
    return `
        <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
            <p>Assalam-o-Alaikum ${studentName},</p>
            
            <p style="margin-bottom: 20px;">
                A very warm welcome from the Al-Khalil Institute team! We are pleased to confirm that we have successfully received your enrollment request for the <b>${courseOfInterest}</b>.
            </p>

            <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
                <p style="margin: 0;"><b>Request Status: Pending Review</b></p>
            </div>
            
            <p style="margin-top: 20px;">
                An admissions manager will now review your submission and contact you with an update on your acceptance and payment details shortly, InshaAllah, usually within one to two business days.
            </p>
            
            <p style="margin-top: 30px;">
                JazakAllah Khair,<br>
                <strong>The Al-Khalil Institute Team</strong>
            </p>
        </div>
    `;
}

// --- TEMPLATE 2: ACCEPTANCE & PAYMENT (STATUS: Accepted/Rejected) ---
function getAcceptanceOrRejectionHtml(payload) {
    const { studentName, courseOfInterest, status } = payload;
    const isAccepted = status === 'Accepted';
    
    // Acceptance details
    if (isAccepted) {
        return `
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
                <p>Assalam-o-Alaikum ${studentName},</p>
                
                <h3 style="color: #008000; margin-top: 0;">🎉 Congratulations! Your Enrollment Request Has Been Confirmed.</h3>

                <p>We are delighted to inform you that your enrollment request for the <b>${courseOfInterest}</b> has been **confirmed** and approved by our admissions team.</p>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <h4 style="color: #007bff; margin-top: 0;">📚 Course Details & Commitment</h4>
                <ul style="list-style: none; padding: 0; margin: 10px 0;">
                    <li>— <b>Duration:</b> 6 Weeks</li>
                    <li>— <b>Schedule:</b> Classes twice a week on Google Meet.</li>
                    <li>— <b>Resources:</b> Class recordings and all resources will be provided free of cost.</li>
                </ul>
                
                <h4 style="color: #007bff; margin-top: 20px;">Key Learning & Features:</h4>
                <ul style="list-style: disc; margin-left: 20px;">
                    <li>Complete Syllabus Overview, Past Papers, Marking Scheme, and Scheme of Work Usage.</li>
                    <li>Deep Assessment Training and Copy Checking Techniques.</li>
                    <li>Detailed Teaching Methods and Tools (Cambridge Islamiyat Focus).</li>
                    <li>Professional communication training (How to Send Professional Emails).</li>
                    <li>Comprehensive Lesson Planning.</li>
                    <li><b>Certification</b> will be provided upon successful course completion.</li>
                    <li>Opportunity to participate in <b>Mock Demos in a Cambridge School</b> setting.</li>
                    <li>Job details and career guidance will be provided.</li>
                </ul>

                <p style="font-weight: bold; color: #ff0000;">
                    Commitment Requirement: An assignment will be given with every class. No Assignment Submitted = No Next Class Access.
                </p>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <h4 style="color: #007bff; margin-top: 0;">💳 Payment & Access Instructions</h4>
                <p>To finalize your enrollment and gain immediate access to your dashboard, classes, and study material, please complete the initial payment:</p>
                
                <h3 style="color: #008000;">Required Payment: ${BANK_DETAILS.fee}</h3>
                
                <p style="font-weight: bold; margin-top: 15px;">Payment Details:</p>
                <div style="border: 1px solid #ccc; padding: 10px; background-color: #f0f8ff;">
                    <p style="margin: 5px 0;"><b>Account Title:</b> ${BANK_DETAILS.title}</p>
                    <p style="margin: 5px 0;"><b>Account Number:</b> ${BANK_DETAILS.accountNumber}</p>
                    <p style="margin: 5px 0;"><b>IBAN Number:</b> ${BANK_DETAILS.iban}</p>
                </div>
                
                <p style="font-weight: bold; margin-top: 15px;">Action Required:</p>
                <p>Please <b>reply to this email</b> with the deposit slip or screenshot of the transaction confirmation.</p>
                <p>Once payment is verified, your access to classes, materials, and the student dashboard will be granted.</p>

                <p style="margin-top: 30px;">
                    JazakAllah Khair,<br>
                    <strong>The Al-Khalil Institute Team</strong>
                </p>
            </div>
        `;
    } 
    // Rejection details (simplified, can be expanded later)
    else if (status === 'Rejected') {
        return `
            <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
                <p>Assalam-o-Alaikum ${studentName},</p>
                <h3 style="color: #cc0000; margin-top: 0;">Enrollment Update</h3>
                <p>Thank you for your interest in the <b>${courseOfInterest}</b> program. At this time, your enrollment request has been **rejected**.</p>
                <p>This may be due to capacity constraints or entry requirements. An admissions manager will be in touch if there are alternative options available to you.</p>
                <p style="margin-top: 30px;">
                    JazakAllah Khair,<br>
                    <strong>The Al-Khalil Institute Team</strong>
                </p>
            </div>
        `;
    }
}


// This function sends the enrollment email based on status
export async function sendEnrollmentConfirmation(toEmail, payload) {
    const { courseOfInterest, status } = payload;

    // 1. Determine Subject and HTML content based on status
    let subject;
    let htmlContent;

    if (status === 'Pending') {
        subject = `✅ Request Received: Your Enrollment Submission to Al-Khalil Institute`;
        htmlContent = getPendingConfirmationHtml(payload.studentName, courseOfInterest);
    } else if (status === 'Accepted') {
        subject = `🎉 Confirmed! Enrollment for ${courseOfInterest} - Action Required`;
        htmlContent = getAcceptanceOrRejectionHtml(payload);
    } else if (status === 'Rejected') {
        subject = `[Al-Khalil Institute] Enrollment Update: ${courseOfInterest}`;
        htmlContent = getAcceptanceOrRejectionHtml(payload);
    } else {
        console.error('Invalid status for enrollment email:', status);
        return;
    }

    // 2. Send the email
    try {
        await mailer.sendMail({
            to: toEmail,
            from: process.env.SMTP_USER,
            subject: subject,
            html: htmlContent,
        });
        console.log(`Enrollment email sent to ${toEmail} with status: ${status}`);
    } catch (error) {
        console.error(`Error sending email to ${toEmail}:`, error.message);
    }
}


// --- Password Reset Function (KEEP UNCHANGED) ---
export async function sendPasswordResetEmail(toEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset-password/${resetToken}`;

    const html = `
        <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
            <p>Assalam-o-Alaikum,</p>
            <p>You requested a password reset for your Al-Khalil Institute account.</p>
            <p>Please click the link below to set a new password. This link will expire in 10 minutes.</p>
            <a 
                href="${resetUrl}" 
                style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;"
            >
                Reset Your Password
            </a>
            <p>If you did not request this, please ignore this email.</p>
            <br>
            <p>JazakAllah Khair,</p>
            <p><b>The Al-Khalil Institute Team</b></p>
        </div>
    `;

    try {
        await mailer.sendMail({
            to: toEmail,
            from: process.env.SMTP_USER,
            subject: '[Al-Khalil Institute] Your Password Reset Link',
            html: html,
        });
        console.log(`Password reset email sent to ${toEmail}`);
    } catch (error) {
        console.error(`Error sending password reset email to ${toEmail}:`, error.message);
    }
}