/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Send,
  ShieldCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../features/auth/useAuth";

type AuthStep = "login" | "forgot-password" | "verify-otp" | "reset-password";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    login,
    requestOtp,
    verifyUserOtp,
    resetUserPassword,
    isLoading,
    error,
    resetState,
    getProfile,
  } = useAuth();

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [step, setStep] = useState<AuthStep>("login");

  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // OTP 6-digit State & Refs
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 useEffect(() => {
    if (isAuthenticated || user) {
      setIsCheckingSession(false);
      return;
    }

    let isMounted = true;

    Promise.resolve(getProfile())
      .catch(() => {
        // সেশন না থাকলে বা টোকেন এক্সপায়ার্ড হলে লগইন ফর্ম দেখাবে
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);
  

  // ২. ইউজার ডেটা পাওয়া গেলে বা অথেন্টিকেটেড হলে সরাসরি /seller পেজে রিডাইরেক্ট করা
  useEffect(() => {
    if (!isCheckingSession && (isAuthenticated || user)) {
      navigate("/seller", { replace: true });
    }
  }, [isCheckingSession, isAuthenticated, user, navigate]);

  // OTP Handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 1. Login Submit Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    resetState();
    try {
      await login({ emailOrPhone, password });
      navigate("/seller", { replace: true });
    } catch (err: any) {
      setLocalError(err || "Failed to login. Please check your credentials.");
    }
  };

  // 2. Forgot Password / Request OTP Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    resetState();
    try {
      await requestOtp({ emailOrPhone });
      setStep("verify-otp");
    } catch (err: any) {
      setLocalError(err || "Failed to send OTP. Please try again.");
    }
  };

  // 3. Verify OTP Handler
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    resetState();
    const enteredOtp = otp.join("");
    try {
      await verifyUserOtp({ emailOrPhone, otp: enteredOtp });
      setStep("reset-password");
    } catch (err: any) {
      setLocalError(err || "Invalid OTP. Please try again.");
    }
  };

  // 4. Reset Password Handler
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    resetState();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match!");
      return;
    }

    try {
      await resetUserPassword({
        emailOrPhone,
        otp: otp.join(""),
        newPassword: password,
      });
      alert(
        "Password changed successfully! Please log in with your new password.",
      );
      setStep("login");
      setPassword("");
      setConfirmPassword("");
      setOtp(new Array(6).fill(""));
    } catch (err: any) {
      setLocalError(err || "Failed to reset password. Please try again.");
    }
  };

  // সেশন চেক চলাকালীন লোডিং স্পিনার দেখানো
  if (isCheckingSession) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-cardHeader" />
          <p className="text-xs text-gray-500 font-medium">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-surface px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-borderLight w-full max-w-md">
        {/* Global Error Banner */}
        {(localError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center">
            {localError || error}
          </div>
        )}

        {/* ================= STEP 1: LOGIN ================= */}
        {step === "login" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary">
                Welcome Back!
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Please log in to your account
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="example@mail.com or 017xxxxxxxx"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-primary">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("forgot-password");
                      resetState();
                      setLocalError(null);
                    }}
                    className="text-xs font-medium text-cardHeader hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Log In <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Want to create a new account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cardHeader hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        )}

        {/* ================= STEP 2: FORGOT PASSWORD ================= */}
        {step === "forgot-password" && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-cardAccent/10 text-cardHeader rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary">
                Password Recovery
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your registered email or phone number. We will send you an
                OTP.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="example@mail.com or 017xxxxxxxx"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Send OTP <Send size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep("login");
                  resetState();
                  setLocalError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Login
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: VERIFY OTP ================= */}
        {step === "verify-otp" && (
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={26} />
            </div>

            <h2 className="text-2xl font-bold font-heading text-primary">
              OTP Verification
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              A 6-digit code has been sent to{" "}
              <span className="font-semibold text-primary">
                {emailOrPhone || "your provided address"}
              </span>
              .
            </p>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-borderLight bg-surface text-primary focus:outline-none focus:border-cardHeader transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.some((val) => val === "")}
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Verify"
                )}
              </button>
            </form>

            <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
              <button
                type="button"
                onClick={() => {
                  setStep("forgot-password");
                  resetState();
                  setLocalError(null);
                }}
                className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Try Again
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await requestOtp({ emailOrPhone });
                    alert("OTP resent successfully!");
                  } catch (err: any) {
                    setLocalError(err || "Failed to resend OTP");
                  }
                }}
                className="text-cardHeader font-semibold hover:underline cursor-pointer"
              >
                Didn't get code? Resend
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: RESET PASSWORD ================= */}
        {step === "reset-password" && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary">
                Set New Password
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Set a strong password for your account
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Change Password <CheckCircle size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


