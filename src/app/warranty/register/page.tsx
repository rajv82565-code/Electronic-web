'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterWarrantyPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({
    productId: '',
    serialNumber: '',
    invoiceNumber: '',
    purchaseDate: '',
    warrantyMonths: '12',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetch('/api/products?limit=50')
      .then(r => r.json())
      .then(d => setProducts(d.products || []));
  }, [user, router]);

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/warranties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: parseInt(form.productId),
        serialNumber: form.serialNumber.trim(),
        invoiceNumber: form.invoiceNumber.trim(),
        purchaseDate: form.purchaseDate,
        warrantyMonths: parseInt(form.warrantyMonths),
      }),
    });
    if (res.ok) {
      setSuccess(true);
      toast.success('Warranty registered successfully!');
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to register warranty');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs space-y-4">
            <div className="w-16 h-16 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center mx-auto text-teal-600">
              <CheckCircle className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Warranty Certificate Activated!</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your device serial number has been registered to your account. You can track remaining coverage days and file repair requests anytime from your dashboard.
            </p>
            <button
              onClick={() => router.push('/dashboard?tab=warranties')}
              className="btn-primary w-full text-xs font-semibold py-2.5 rounded-lg"
            >
              View Warranties Vault
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          href="/dashboard?tab=warranties"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Warranties
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" /> Register Hardware Warranty
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manually link an existing or retail store purchase to your digital SmartShield account.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="label">Select Hardware Model *</label>
              <select
                value={form.productId}
                onChange={update('productId')}
                required
                className="input cursor-pointer"
              >
                <option value="">Choose a product model</option>
                {products.map((p: any) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.brand} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Device Serial Number (IMEI / S/N) *</label>
              <input
                type="text"
                value={form.serialNumber}
                onChange={update('serialNumber')}
                required
                className="input font-mono"
                placeholder="e.g. SN-SGS25-2026-001"
              />
              <p className="text-[11px] text-slate-400 mt-1">Found on the product retail packaging or in device About settings.</p>
            </div>

            <div>
              <label className="label">Original Invoice / Bill Number</label>
              <input
                type="text"
                value={form.invoiceNumber}
                onChange={update('invoiceNumber')}
                className="input"
                placeholder="e.g. INV-2026-9482"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Purchase Date *</label>
                <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={update('purchaseDate')}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="input cursor-pointer"
                />
              </div>

              <div>
                <label className="label">Warranty Duration *</label>
                <select
                  value={form.warrantyMonths}
                  onChange={update('warrantyMonths')}
                  className="input cursor-pointer"
                >
                  <option value="6">6 Months</option>
                  <option value="12">1 Year (12 Months)</option>
                  <option value="24">2 Years (24 Months)</option>
                  <option value="36">3 Years (36 Months)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-white" />
                {loading ? 'Registering...' : 'Register Warranty'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
