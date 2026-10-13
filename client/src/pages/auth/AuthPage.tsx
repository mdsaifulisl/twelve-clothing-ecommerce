import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  CheckCircle 
} from 'lucide-react';

type AuthStep = 'login' | 'forgot-password' | 'verify-otp' | 'reset-password';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('login');
  
  // Form States
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP 6-digit State & Refs
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Handlers
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Submit Handlers for each step
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in:', { emailOrPhone, password });
    navigate('/');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Requesting OTP for:', emailOrPhone);
    setStep('verify-otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp.join(''));
    setStep('reset-password');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }
    console.log('Password changed successfully');
    alert('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! অনুগ্রহ করে নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
    setStep('login');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-surface px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-borderLight w-full max-w-md">

        {/* ================= STEP 1: LOGIN ================= */}
        {step === 'login' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-heading text-primary">স্বাগতম!</h2>
              <p className="text-xs text-gray-500 mt-1">আপনার অ্যাকাউন্টে লগইন করুন</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  ইমেইল বা ফোন নম্বর
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="example@mail.com বা 017xxxxxxxx"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-primary">পাসওয়ার্ড</label>
                  <button
                    type="button"
                    onClick={() => setStep('forgot-password')}
                    className="text-xs font-medium text-cardHeader hover:underline"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md mt-2"
              >
                লগইন করুন <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              নতুন অ্যাকাউন্ট তৈরি করতে চান?{' '}
              <Link to="/register" className="font-semibold text-cardHeader hover:underline">
                রেজিস্টার করুন
              </Link>
            </p>
          </div>
        )}

        {/* ================= STEP 2: FORGOT PASSWORD ================= */}
        {step === 'forgot-password' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-cardAccent/10 text-cardHeader rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail size={24} />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary">পাসওয়ার্ড পুনরুদ্ধার</h2>
              <p className="text-xs text-gray-500 mt-1">
                আপনার নিবন্ধিত ইমেইল বা ফোন নম্বর দিন। আমরা একটি ওটিপি পাঠাব।
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  ইমেইল বা ফোন নম্বর
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="example@mail.com বা 017xxxxxxxx"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
              >
                ওটিপি পাঠান <Send size={16} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} /> লগইন পেজে ফিরে যান
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: VERIFY OTP ================= */}
        {step === 'verify-otp' && (
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck size={26} />
            </div>

            <h2 className="text-2xl font-bold font-heading text-primary">ওটিপি ভেরিফিকেশন</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              <span className="font-semibold text-primary">{emailOrPhone || 'আপনার দেওয়া ঠিকানায়'}</span> -এ ৬ ডিজিটের কোড পাঠানো হয়েছে।
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
                disabled={otp.some((val) => val === '')}
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl hover:bg-opacity-90 disabled:opacity-50 transition-all shadow-md"
              >
                ভেরিফাই করুন
              </button>
            </form>

            <div className="mt-6 flex justify-between items-center text-xs text-gray-500">
              <button
                type="button"
                onClick={() => setStep('forgot-password')}
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft size={14} /> আবার চেষ্টা করুন
              </button>
              
              <button className="text-cardHeader font-semibold hover:underline">
                কোড পাননি? রিসেন্ড করুন
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: RESET PASSWORD ================= */}
        {step === 'reset-password' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={24} />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary">নতুন পাসওয়ার্ড দিন</h2>
              <p className="text-xs text-gray-500 mt-1">আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী পাসওয়ার্ড সেট করুন</p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="নতুন পাসওয়ার্ড দিন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="আবার পাসওয়ার্ডটি লিখুন"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-borderLight bg-surface text-sm focus:outline-none focus:border-cardHeader transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cardHeader text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
              >
                পাসওয়ার্ড পরিবর্তন করুন <CheckCircle size={18} />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};