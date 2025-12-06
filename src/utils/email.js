import { mailer } from '../config/nodemailer.js';

// This function sends the confirmation email after an enrollment
export async function sendEnrollmentConfirmation(toEmail, payload) {
  const { studentName, courseOfInterest, status } = payload;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Assalam-o-Alaikum ${studentName},</p>
      <p>Thank you for contacting Shafqat Ali Academy.</p>
      <p>Your enrollment request for the course <b>${courseOfInterest}</b> has been received. Its current status is: <b>${status}</b>.</p>
      <p>An admissions manager will contact you shortly, InshaAllah.</p>
      <br>
      <p>JazakAllah Khair,</p>
      <p><b>The Shafqat Ali Academy Team</b></p>
    </div>
  `;

  try {
    await mailer.sendMail({
      to: toEmail,
      from: process.env.EMAIL_FROM, // This comes from your .env file
      subject: `Enrollment Update: ${courseOfInterest}`,
      html: html,
    });
    console.log(`Enrollment email sent to ${toEmail}`);
  } catch (error) {
    // We log the error, but we don't stop the application
    console.error(`Error sending email to ${toEmail}:`, error.message);
  }
}

// --- THIS IS THE NEW FUNCTION ---
export async function sendPasswordResetEmail(toEmail, resetToken) {
  // We build the reset URL using our frontend's address
  const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Assalam-o-Alaikum,</p>
      <p>You requested a password reset for your Shafqat Ali Academy account.</p>
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
      <p><b>The Shafqat Ali Academy Team</b></p>
    </div>
  `;

  try {
    await mailer.sendMail({
      to: toEmail,
      from: process.env.EMAIL_FROM,
      subject: 'Your Password Reset Link',
      html: html,
    });
    console.log(`Password reset email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending password reset email to ${toEmail}:`, error.message);
  }
}
