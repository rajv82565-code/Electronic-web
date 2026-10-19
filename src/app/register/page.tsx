'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Registration failed');
        return;
      }
      setUser(data.user);
      toast.success('Account created successfully! Welcome to TechVolt 🎉');
      router.push('/');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
              Tech<span className="text-[#2563EB]">Volt</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1E293B]">Create Your Account</h1>
          <p className="text-[#64748B] text-sm mt-1">Unlock warranty tracking, doorstep repairs & member deals</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  required
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="pw"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  required
                  minLength={6}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-10 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="confirm"
                  type="password"
                  value={form.confirm}
                  onChange={update('confirm')}
                  required
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="Repeat password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg py-2.5 text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#64748B] text-xs mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2563EB] hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
