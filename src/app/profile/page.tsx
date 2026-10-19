'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Package,
  Shield,
  Wrench,
  Save,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Address states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Activity stats
  const [stats, setStats] = useState({
    ordersCount: 0,
    warrantiesCount: 0,
    repairsCount: 0,
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (!data.user) {
          toast.error('Please log in to view your profile');
          router.push('/login');
          return;
        }
        setUser(data.user);
        setName(data.user.name || '');
        setPhone(data.user.phone || '');

        try {
          if (data.user.address) {
            const parsed = JSON.parse(data.user.address);
            setStreet(parsed.street || '');
            setCity(parsed.city || '');
            setState(parsed.state || '');
            setPincode(parsed.pincode || '');
          }
        } catch {
          setStreet(data.user.address || '');
        }

        Promise.all([
          fetch('/api/orders').then(r => (r.ok ? r.json() : { orders: [] })),
          fetch('/api/warranties').then(r => (r.ok ? r.json() : { warranties: [] })),
          fetch('/api/repairs').then(r => (r.ok ? r.json() : { repairs: [] })),
        ]).then(([orderData, warrantyData, repairData]) => {
          setStats({
            ordersCount: orderData.orders?.length || 0,
            warrantiesCount: warrantyData.warranties?.length || 0,
            repairsCount: repairData.repairs?.length || 0,
          });
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router, setUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const addressJson = JSON.stringify({
        street,
        city,
        state,
        pincode,
        country: 'India',
      });

      const payload: any = {
        name,
        phone,
        address: addressJson,
      };

      if (newPassword) {
        if (!currentPassword) {
          toast.error('Current password required to update password');
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error('New passwords do not match');
          setSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error('New password must be at least 6 characters');
          setSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-[#1E293B]">
      <Header />

      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* User Hero Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 bg-[#2563EB] text-white rounded-2xl flex items-center justify-center font-extrabold text-3xl shadow-xs shrink-0">
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                <h1 className="text-2xl font-bold text-[#1E293B]">{name || 'Customer Account'}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                  user?.role === 'admin'
                    ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                    : 'bg-blue-50 text-[#2563EB] border border-blue-200'
                }`}>
                  {user?.role || 'Verified Customer'}
                </span>
              </div>
              <p className="text-[#64748B] text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#94A3B8]" /> {user?.email}
              </p>
              {phone && (
                <p className="text-[#64748B] text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-4 h-4 text-[#94A3B8]" /> {phone}
                </p>
              )}
            </div>

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors"
              >
                <Shield className="w-4 h-4 text-[#2563EB]" /> Admin Control Panel
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/dashboard?tab=orders"
            className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563EB] group-hover:scale-105 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-[#1E293B]">{stats.ordersCount}</h3>
            </div>
          </Link>

          <Link
            href="/dashboard?tab=warranties"
            className="bg-white border border-[#E2E8F0] hover:border-[#0EA5A0] rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-[#0EA5A0] group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">Active Warranties</p>
              <h3 className="text-2xl font-extrabold text-[#1E293B]">{stats.warrantiesCount}</h3>
            </div>
          </Link>

          <Link
            href="/dashboard?tab=repairs"
            className="bg-white border border-[#E2E8F0] hover:border-[#F59E0B] rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-[#F59E0B] group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">Doorstep Repairs</p>
              <h3 className="text-2xl font-extrabold text-[#1E293B]">{stats.repairsCount}</h3>
            </div>
          </Link>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-[#2563EB]" /> Personal Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Email Address (Read-only)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#64748B] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Address Management */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0EA5A0]" /> Default Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Street Address & House No.
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    placeholder="42, Tech Park Avenue, Silicon Road"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                      placeholder="Bengaluru"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                      placeholder="Karnataka"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                    Postal / PIN Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                    placeholder="560001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-[#1E293B] mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2563EB]" /> Change Password
            </h2>
            <p className="text-[#64748B] text-xs mb-4">
              Leave these fields blank if you do not wish to update your current password.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3.5 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:bg-white"
                  placeholder="Repeat new password"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 px-6 rounded-lg text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
