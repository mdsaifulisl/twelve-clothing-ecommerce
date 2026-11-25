import { EventEmitter } from 'events';
import { sendEmail } from '../utils/sendEmail.js'; 

export const userEvents = new EventEmitter();

// ১. ইউজার ক্রিয়েট হওয়ার পর ক্রেডেনশিয়াল পাঠানোর ইভেন্ট লিসেনার
userEvents.on('userCreated', async ({ email, name, rawPassword }) => {
  // .env থেকে ফ্রন্টএন্ড বেস URL নিন, না থাকলে ফলব্যাক হিসেবে লোকালহোস্ট ব্যবহার হবে
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const loginUrl = `${clientUrl}/login`;

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #F26522; text-align: center;">Welcome to ABC Fashions!</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account has been successfully created by the administrator. Below are your login credentials:</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background: #eee; padding: 2px 6px; border-radius: 4px;">${rawPassword}</span></p>
      </div>

      <p>Please log in to your account using the button below and change your password as soon as possible for security reasons:</p>
      
      <div style="text-align: center; margin: 25px 0;">
        <a href="${loginUrl}" style="background-color: #F26522; color: #white; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">Login to Your Account</a>
      </div>

      <p>Best regards,<br/><strong>ABC Fashions Team</strong></p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Your Account Access Credentials',
      html: emailTemplate,
    });
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
});

// ২. পাসওয়ার্ড রিসেট বা ওটিপি পাঠানোর ইভেন্ট লিসেনার
userEvents.on('otpRequested', async ({ email, otp }) => {
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #F26522; text-align: center;">Password Reset Verification</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <div style="background: #f4f4f4; padding: 12px 24px; font-size: 26px; font-weight: bold; letter-spacing: 4px; display: inline-block; color: #111; border-radius: 6px;">
          ${otp}
        </div>
      </div>

      <p style="text-align: center; color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
      
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/><strong>ABC Fashions Team</strong></p>
    </div>
  `;

  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset OTP Verification',
      html: emailTemplate,
    });
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP email to ${email}:`, error);
  }
});