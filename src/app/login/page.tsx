'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  Wrench,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState<'customer' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(data.user.role === 'admin' ? '/admin' : '/');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'customer' | 'admin') => {
    setActiveRole(role);
    if (role === 'customer') {
      setEmail('john@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@techvolt.com');
      setPassword('admin123');
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden selection:bg-[#1D63ED] selection:text-white"
      style={{
        backgroundColor: '#F3F6FA',
        padding: '48px 24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Decorative Subtle Foliage on Far Left */}
      <div
        className="hidden xl:block pointer-events-none select-none"
        style={{
          position: 'absolute',
          left: '-40px',
          top: '10%',
          bottom: '10%',
          width: '280px',
          opacity: 0.35,
          zIndex: 0,
          mixBlendMode: 'multiply',
          filter: 'blur(1px)',
        }}
      >
        <Image
          src="/images/login-corner-leaves.jpg"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'left' }}
          priority
        />
      </div>

      {/* Soft Ambient Background Curved Glow */}
      <div
        className="pointer-events-none"
        style={{
          position: 'absolute',
          right: '5%',
          top: '15%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(243, 246, 250, 0) 70%)',
          zIndex: 0,
        }}
      />

      {/* Main Dual-Column Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          alignItems: 'center',
          gap: '56px',
        }}
        className="lg:grid-cols-[460px_1fr]"
      >
        {/* ==================================================
            LEFT COLUMN: FLOATING CLEAN LOGIN CARD
            ================================================== */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '470px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              padding: '44px 38px',
              boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.07), 0 0 1px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E9EFF6',
            }}
          >
            {/* 1. Brand Logo Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#1D63ED',
                    borderRadius: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 16px -4px rgba(29, 99, 237, 0.35)',
                  }}
                >
                  <Zap style={{ width: '22px', height: '22px', fill: '#FFFFFF' }} />
                </div>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    color: '#0F172A',
                    letterSpacing: '-0.025em',
                  }}
                >
                  TechVolt
                </span>
              </Link>

              <h1
                style={{
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#0F172A',
                  letterSpacing: '-0.02em',
                  marginTop: '16px',
                  marginBottom: '6px',
                }}
              >
                Welcome Back
              </h1>
              <p
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                Sign in to manage orders, warranties & repairs
              </p>
            </div>

            {/* 2. Quick Demo Fill Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '24px 0 18px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span
                style={{
                  padding: '0 14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                QUICK DEMO FILL
              </span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            {/* 3. Demo Role Selection Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '26px',
              }}
            >
              <button
                type="button"
                onClick={() => fillDemo('customer')}
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeRole === 'customer' ? '#EFF6FF' : '#FFFFFF',
                  border: activeRole === 'customer' ? '2px solid #1D63ED' : '1px solid #E2E8F0',
                  color: activeRole === 'customer' ? '#1D63ED' : '#475569',
                }}
              >
                <span>👤</span> Customer
              </button>

              <button
                type="button"
                onClick={() => fillDemo('admin')}
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: activeRole === 'admin' ? '#EFF6FF' : '#FFFFFF',
                  border: activeRole === 'admin' ? '2px solid #1D63ED' : '1px solid #E2E8F0',
                  color: activeRole === 'admin' ? '#1D63ED' : '#475569',
                }}
              >
                <span>🛡️</span> Admin
              </button>
            </div>

            {/* 4. Form Fields with Generous Breathing Room */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email Address */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#64748B',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <Mail
                    style={{
                      position: 'absolute',
                      left: '14px',
                      width: '18px',
                      height: '18px',
                      color: '#94A3B8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      height: '100%',
                      paddingLeft: '44px',
                      paddingRight: '16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: '#0F172A',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <label
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: '#64748B',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    PASSWORD
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1D63ED',
                      textDecoration: 'none',
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '14px',
                      width: '18px',
                      height: '18px',
                      color: '#94A3B8',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      height: '100%',
                      paddingLeft: '44px',
                      paddingRight: '44px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '14px',
                      color: '#0F172A',
                      letterSpacing: showPassword ? 'normal' : '0.15em',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '18px', height: '18px' }} />
                    ) : (
                      <Eye style={{ width: '18px', height: '18px' }} />
                    )}
                  </button>
                </div>
              </div>

              {/* 5. Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: '#1D63ED',
                  color: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 24px -4px rgba(29, 99, 237, 0.4)',
                  marginTop: '10px',
                  transition: 'background-color 0.2s ease, transform 0.1s ease',
                }}
              >
                {loading ? (
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#FFFFFF',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                ) : (
                  <>
                    Sign In <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </>
                )}
              </button>
            </form>

            {/* 6. Register Link */}
            <div
              style={{
                marginTop: '26px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#64748B',
              }}
            >
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                style={{
                  color: '#1D63ED',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginLeft: '4px',
                }}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN: SPACIOUS HERO MARKETING & 3D DISPLAY
            ================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Eyebrow Kicker */}
          <div style={{ marginBottom: '14px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.22em',
                color: '#1D63ED',
                textTransform: 'uppercase',
              }}
            >
              YOUR TECH PARTNER
            </span>
          </div>

          {/* Large Headline */}
          <h2
            style={{
              fontSize: 'clamp(34px, 4.5vw, 52px)',
              fontWeight: 900,
              color: '#0B1222',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Buy. Protect. Repair.
            <span style={{ display: 'block', color: '#1D63ED', marginTop: '4px' }}>
              All in One Place.
            </span>
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '16px',
              color: '#64748B',
              lineHeight: 1.6,
              maxWidth: '540px',
              marginTop: '16px',
              marginBottom: '32px',
            }}
          >
            Latest gadgets, genuine products, warranty management and hassle-free repair services.
          </p>

          {/* 4 Feature Badges Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(70px, 1fr))',
              gap: '20px',
              maxWidth: '480px',
              marginBottom: '36px',
            }}
          >
            {/* Feature 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D63ED',
                  marginBottom: '8px',
                }}
              >
                <ShoppingCart style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>
                Easy<br />Ordering
              </span>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D63ED',
                  marginBottom: '8px',
                }}
              >
                <ShieldCheck style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>
                Warranty<br />Management
              </span>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D63ED',
                  marginBottom: '8px',
                }}
              >
                <Wrench style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>
                Repair<br />Requests
              </span>
            </div>

            {/* Feature 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D63ED',
                  marginBottom: '8px',
                }}
              >
                <Headphones style={{ width: '22px', height: '22px' }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>
                Dedicated<br />Support
              </span>
            </div>
          </div>

          {/* 3D Devices Showcase Image */}
          <div style={{ width: '100%', maxWidth: '640px', position: 'relative' }}>
            <Image
              src="/images/login-devices-showcase.jpg"
              alt="TechVolt Premium Electronics Showcase"
              width={1280}
              height={720}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '16px',
                filter: 'drop-shadow(0 15px 25px rgba(15, 23, 42, 0.08))',
              }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
