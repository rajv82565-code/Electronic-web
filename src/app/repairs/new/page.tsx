'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { Wrench, CheckCircle, ArrowLeft, Shield, Calendar, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ISSUE_CATEGORIES = [
  'Screen & Display Damage',
  'Battery Drain & Replacement',
  'Charging Port / Power Failure',
  'Motherboard / Logic Board Issue',
  'Camera & Sensor Malfunction',
  'Audio, Speaker & Microphone',
  'Software Diagnostics & OS Recovery',
  'General Hardware Inspection',
];

export default function NewRepairPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [warranties, setWarranties] = useState<any[]>([]);
  const [form, setForm] = useState({
    productId: '',
    warrantyId: '',
    serialNumber: '',
    issueCategory: '',
    description: '',
    pickupDate: '',
    pickupAddress: '',
    contactPhone: '',
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
    Promise.all([
      fetch('/api/products?limit=50').then(r => r.json()),
      fetch('/api/warranties').then(r => r.json()),
    ]).then(([p, w]) => {
      setProducts(p.products || []);
      setWarranties(w.warranties || []);
    });
    if (user.phone) {
      setForm(f => ({ ...f, contactPhone: user.phone || '' }));
    }
  }, [user, router]);

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/repairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: parseInt(form.productId),
        warrantyId: form.warrantyId ? parseInt(form.warrantyId) : null,
        serialNumber: form.serialNumber.trim(),
        issueCategory: form.issueCategory,
        description: form.description.trim(),
        pickupDate: form.pickupDate,
        pickupAddress: form.pickupAddress.trim(),
        contactPhone: form.contactPhone.trim(),
      }),
    });
    if (res.ok) {
      setSuccess(true);
      toast.success('Doorstep repair request submitted!');
    } else {
      const d = await res.json();
      toast.error(d.error || 'Failed to submit repair ticket');
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
            <h2 className="text-xl font-bold text-slate-900">Repair Ticket Created!</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our service coordinator will contact you to verify your pickup appointment. You can track stage progression in real-time from your Customer Dashboard.
            </p>
            <button
              onClick={() => router.push('/dashboard?tab=repairs')}
              className="btn-primary w-full text-xs font-semibold py-2.5 rounded-lg"
            >
              Track on Live Repair Kanban
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minPickupDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          href="/dashboard?tab=repairs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Repairs Hub
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-amber-500" /> Book Doorstep Hardware Repair
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified technicians, authentic OEM spare parts, and full Kanban stage tracking.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="label">Device Model Requiring Repair *</label>
              <select
                value={form.productId}
                onChange={update('productId')}
                required
                className="input cursor-pointer"
              >
                <option value="">Select your hardware model</option>
                {products.map((p: any) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.brand} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Link Active Warranty (Optional)</label>
              <select
                value={form.warrantyId}
                onChange={update('warrantyId')}
                className="input cursor-pointer"
              >
                <option value="">Out of warranty / Manual claim</option>
                {warranties
                  .filter(w => w.status === 'active')
                  .map((w: any) => (
                    <option key={w.warranty_id} value={w.warranty_id}>
                      🛡️ {w.product_name} (SN: {w.serial_number})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label">Serial Number / IMEI</label>
              <input
                type="text"
                value={form.serialNumber}
                onChange={update('serialNumber')}
                placeholder="Device serial number or IMEI"
                className="input font-mono"
              />
            </div>

            <div>
              <label className="label">Issue Classification *</label>
              <select
                value={form.issueCategory}
                onChange={update('issueCategory')}
                required
                className="input cursor-pointer"
              >
                <option value="">Select issue category</option>
                {ISSUE_CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Detailed Problem Description *</label>
              <textarea
                value={form.description}
                onChange={update('description')}
                required
                rows={3}
                placeholder="Describe how the malfunction occurred (e.g. dropped on floor, line on display, battery draining in 1 hour)..."
                className="input resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Requested Doorstep Pickup Date *</label>
                <input
                  type="date"
                  value={form.pickupDate}
                  onChange={update('pickupDate')}
                  min={minPickupDate}
                  required
                  className="input cursor-pointer"
                />
              </div>

              <div>
                <label className="label">Contact Mobile Number *</label>
                <input
                  type="tel"
                  value={form.contactPhone}
                  onChange={update('contactPhone')}
                  required
                  placeholder="+91 9876543210"
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Doorstep Pickup Address *</label>
              <input
                type="text"
                value={form.pickupAddress}
                onChange={update('pickupAddress')}
                required
                placeholder="House / Flat No., Street, Landmark, City, Pincode"
                className="input"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Doorstep pickup is free for devices covered under active warranty.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-white" />
                {loading ? 'Submitting...' : 'Confirm Repair Booking'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
