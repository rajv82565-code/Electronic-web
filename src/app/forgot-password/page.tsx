'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { KeyRound, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request reset');

      setGeneratedCode(data.demoCode || '123456');
      setCode(data.demoCode || '123456');
      setStep(2);
      toast.success('Reset code generated!');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast.error('Please enter the verification code');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      toast.success('Password reset successfully! Please log in.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-[#1E293B]">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-50 border border-blue-200 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B] mb-1">Reset Password</h1>
            <p className="text-[#64748B] text-xs sm:text-sm">
              {step === 1
                ? 'Enter your registered email address to receive a verification code'
                : 'Enter your verification code and choose a new password'}
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs">
            {step === 1 ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
                >
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {generatedCode && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <div className="text-xs text-[#1E293B]">
                      <span className="font-semibold text-[#2563EB]">Demo Code: </span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-[#1E293B] font-bold tracking-widest">
                        {generatedCode}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="6-digit code"
                    required
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-4 py-2.5 text-center font-mono tracking-widest text-lg font-bold text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
                >
                  {loading ? 'Resetting Password...' : 'Confirm New Password'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs text-[#64748B] hover:text-[#1E293B] mt-2 cursor-pointer"
                >
                  Back to Email
                </button>
              </form>
            )}

            <div className="border-t border-[#F1F5F9] mt-6 pt-4 text-center">
              <p className="text-xs text-[#64748B]">
                Remembered your password?{' '}
                <Link href="/login" className="text-[#2563EB] font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
