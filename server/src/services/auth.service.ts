import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userEvents } from '../events/user.events.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const JWT_EXPIRES_IN = "7d";

export const authService = {
  // 🟢 Login Service
  async login(credentials: { emailOrPhone: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: credentials.emailOrPhone },
          { phone: credentials.emailOrPhone },
        ],
      },
    });

    if (!user) {
      throw new Error("Invalid email/phone or password.");
    }

    if (user.status !== "active") {
      throw new Error("Your account is inactive or blocked.");
    }

    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email/phone or password.");
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  // 🟢 Generate & Send OTP Service
  async generateOtp(emailOrPhone: string) {
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });

    if (!user) {
      throw new Error("User not found with this email or phone.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiresAt },
    });

    // Emit event to send email via Nodemailer
    userEvents.emit('otpRequested', { 
      email: user.email,        
      name: user.name,          
      emailOrPhone, 
      otp 
    });

    return { message: "Successfully OTP sent to your email" };
  },

  // 🟢 Verify OTP Only Service (For Step 3)
  async verifyOtpOnly(data: { emailOrPhone: string; otp: string }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.emailOrPhone }, { phone: data.emailOrPhone }],
      },
    });

    const dbOtp = user?.otp?.toString().trim();
    const sentOtp = data.otp?.toString().trim();

    if (!user || dbOtp !== sentOtp) {
      throw new Error("Invalid OTP.");
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new Error("OTP has expired.");
    }

    return { message: "OTP verified successfully." };
  },

  // 🟢 Verify OTP & Reset Password Service (For Step 4)
  async resetPassword(data: {
    emailOrPhone: string;
    otp: string;
    newPassword: string;
  }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.emailOrPhone }, { phone: data.emailOrPhone }],
      },
    });

    const dbOtp = user?.otp?.toString().trim();
    const sentOtp = data.otp?.toString().trim();

    if (!user || dbOtp !== sentOtp) {
      throw new Error("Invalid OTP.");
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new Error("OTP has expired.");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return { message: "Password reset successfully." };
  },


  async changePassword(
    userId: string,
    data: { currentPassword: string; newPassword: string }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // ১. বর্তমান পাসওয়ার্ড যাচাই করা (এখানে OTP-এর বদলে এটিই সিকিউরিটি চেক)
    const isPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    // ২. নতুন পাসওয়ার্ড হ্যাশ করে আপডেট করা
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully." };
  },
};