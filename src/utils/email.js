import { mailer } from '../config/nodemailer.js';

// This function sends the confirmation email after an enrollment
export async function sendEnrollmentConfirmation(toEmail, payload) {
  const { studentName, courseOfInterest, status } = payload;

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
      <p>Assalam-o-Alaikum ${studentName},</p>
      
      <p style="margin-bottom: 20px;">
        Thank you for contacting **Al-Khalil Institute**. We have successfully received your request.
      </p>

      <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
        <p style="margin: 0;"><b>Request Details:</b></p>
        <p style="margin: 5px 0 0 0;">Course/Topic: <b>${courseOfInterest}</b></p>
        <p style="margin: 5px 0 0 0;">Status: <b style="color: #007bff;">${status}</b></p>
      </div>
      
      <p style="margin-top: 20px;">
        An admissions manager will contact you shortly, InshaAllah, usually within one business day.
      </p>
      
      <p style="margin-top: 30px;">
        JazakAllah Khair,<br>
        <strong>The Al-Khalil Institute Team</strong>
      </p>
    </div>
  `;

  try {
    await mailer.sendMail({
      to: toEmail,
      from: process.env.SMTP_USER, // CRUCIAL: Use the authenticated user (apikey)
      subject: `[Al-Khalil Institute] Enrollment Update: ${courseOfInterest}`,
      html: html,
    });
    console.log(`Enrollment email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error.message);
  }
}


// --- Password Reset Function ---
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