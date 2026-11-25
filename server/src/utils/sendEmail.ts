import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  // ১. ট্রান্সপোর্টার তৈরি করা .env এর তথ্য দিয়ে
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // 465 পোর্ট হলে true, অন্যথায় false
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // ২. ইমেলের কনফিগারেশন
  const mailOptions = {
    from: `"ABC Fashions" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  // ৩. ইমেল সেন্ড করা
  await transporter.sendMail(mailOptions);
};