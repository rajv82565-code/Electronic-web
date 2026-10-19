'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore, useAuthStore } from '@/lib/store';
import { formatPrice } from '@/components/ProductCard';
import toast from 'react-hot-toast';
import {
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  ChevronRight,
  Shield,
  ArrowRight,
  Lock,
  Building,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';

const STEPS = [
  { id: 0, label: 'Delivery Address' },
  { id: 1, label: 'Payment Options' },
  { id: 2, label: 'Review & Confirm' },
];

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI Instant Pay', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'credit_card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, MasterCard, RuPay, Amex' },
  { id: 'debit_card', label: 'Debit Card', icon: CreditCard, desc: 'All Indian bank debit cards' },
  { id: 'net_banking', label: 'Net Banking', icon: Building, desc: 'HDFC, ICICI, SBI, Axis and 40+ banks' },
  { id: 'emi', label: 'No-Cost EMI', icon: Calendar, desc: '3, 6, 9 or 12 months EMI plans' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay with cash upon doorstep delivery' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const { items, clear } = useCartStore();
  const user = useAuthStore(s => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user) {
      setAddress(a => ({
        ...a,
        name: a.name || user.name || '',
        phone: a.phone || user.phone || '',
      }));
    }
  }, [user, router]);

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const deliveryFee = subtotal > 999 ? 0 : 99;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price })),
          shippingAddress: address,
          paymentMethod,
          totalAmount: subtotal,
          discountAmount: 0,
          deliveryFee,
          finalAmount: total,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        clear();
        toast.success('Order placed successfully! 🎉');
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const isAddressValid = Boolean(
    address.name.trim() &&
    address.phone.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.pincode.trim()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Secure Checkout</h1>

        {/* Stepper Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-2xs">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((s, idx) => {
              const isCompleted = idx < step;
              const isCurrent = idx === step;
              return (
                <div key={s.id} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-teal-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden sm:inline ${
                      isCurrent ? 'text-slate-900' : isCompleted ? 'text-teal-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-12 sm:w-20 transition-all ${
                        idx < step ? 'bg-teal-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Step Form Area (8 cols) */}
          <div className="lg:col-span-8">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" /> 1. Shipping & Contact Address
                  </h2>
                  <span className="text-xs text-slate-400">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={e => setAddress(a => ({ ...a, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Mobile Number *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))}
                      placeholder="e.g. +91 9876543210"
                      className="input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Street Address / House No. / Building *</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={e => setAddress(a => ({ ...a, street: e.target.value }))}
                      placeholder="Flat 4B, Silver Heights, MG Road"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={e => setAddress(a => ({ ...a, city: e.target.value }))}
                      placeholder="e.g. Bengaluru"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                      placeholder="e.g. Karnataka"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Pincode *</label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))}
                      placeholder="e.g. 560001"
                      className="input"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      if (!isAddressValid) {
                        toast.error('Please fill in all address fields');
                        return;
                      }
                      setStep(1);
                    }}
                    disabled={!isAddressValid}
                    className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1: Payment Method */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" /> 2. Choose Payment Method
                  </h2>
                  <span className="text-xs text-slate-400">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-600 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={m.id}
                          checked={isSelected}
                          onChange={() => setPaymentMethod(m.id)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{m.label}</h4>
                          <p className="text-slate-500 text-xs mt-0.5">{m.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setStep(0)}
                    className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2"
                  >
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review & Place Order */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Check className="w-5 h-5 text-teal-600" /> 3. Review Order & Confirmation
                  </h2>
                  <span className="text-xs text-slate-400">Step 3 of 3</span>
                </div>

                {/* Shipping & Payment Summary Box */}
                <div className="grid sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Delivering To:
                    </span>
                    <p className="font-semibold text-slate-900 mt-1">{address.name} ({address.phone})</p>
                    <p className="text-slate-600">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                    <button
                      onClick={() => setStep(0)}
                      className="text-blue-600 font-semibold hover:underline mt-1 text-[11px]"
                    >
                      Edit Address
                    </button>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      Payment Selection:
                    </span>
                    <p className="font-semibold text-slate-900 mt-1 uppercase">
                      {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}
                    </p>
                    <p className="text-slate-500">Secure gateway transaction</p>
                    <button
                      onClick={() => setStep(1)}
                      className="text-blue-600 font-semibold hover:underline mt-1 text-[11px]"
                    >
                      Change Method
                    </button>
                  </div>
                </div>

                {/* Items Review */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                    Purchased Devices ({items.length})
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl p-3 bg-white">
                    {items.map(item => (
                      <div key={item.product_id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">{item.brand} • Qty: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-900 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary text-xs font-semibold py-2 px-4 rounded-lg"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || items.length === 0}
                    className="btn-primary text-xs font-semibold px-8 py-3 rounded-lg flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? 'Processing Order...' : `Pay & Place Order (${formatPrice(total)})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                Order Total
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? <strong className="text-teal-600">FREE</strong> : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SmartShield Warranty</span>
                  <span className="text-teal-600 font-semibold">Auto-Included</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">Payable Amount</span>
                  <span className="font-extrabold text-slate-900 text-xl font-sans">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Warranty Assurance Badge */}
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-[11px] text-teal-800 flex items-start gap-2">
                <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Digital Warranty Included:</strong> Your unique serial numbers and invoice certificate will be attached automatically to your account upon payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
