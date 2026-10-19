'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/components/ProductCard';
import { Package, Check, Truck, MapPin, Clock, Shield, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const ORDER_STATUSES = [
  { key: 'placed', label: 'Order Placed', desc: 'Order received and logged in system' },
  { key: 'confirmed', label: 'Order Confirmed', desc: 'Payment verified and verified with warehouse' },
  { key: 'packed', label: 'Packed & Invoiced', desc: 'Item tested, boxed with serial numbers attached' },
  { key: 'shipped', label: 'Shipped (In Transit)', desc: 'Package in transit with logistics courier partner' },
  { key: 'out_for_delivery', label: 'Out for Doorstep Delivery', desc: 'Courier agent out for doorstep delivery' },
  { key: 'delivered', label: 'Delivered Successfully', desc: 'Package delivered to recipient' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        setOrder(d.order);
        setItems(d.items || []);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-md mx-auto py-20 text-center">
          <p className="text-slate-600 mb-4">Order record not found.</p>
          <Link href="/dashboard" className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const address = (() => {
    try {
      return typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address || {};
    } catch {
      return {};
    }
  })();
  const currentStatusIdx = ORDER_STATUSES.findIndex(s => s.key === order.order_status);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          href="/dashboard?tab=orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders Dashboard
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Order #{order.order_id}
              </h1>
              <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold px-2.5 py-0.5 rounded capitalize">
                {order.order_status?.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Total Invoice Amount</span>
            <p className="text-xl font-bold text-slate-900 font-sans">
              {formatPrice(order.final_amount)}
            </p>
          </div>
        </div>

        {/* Tracking Timeline Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-4 h-4 text-blue-600" /> Milestone Tracking Timeline
          </h2>

          <div className="space-y-4 pt-2">
            {ORDER_STATUSES.map((status, idx) => {
              const isDone = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              return (
                <div key={status.key} className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-teal-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {status.label}
                    </h4>
                    <p className="text-[11px] text-slate-500">{status.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items & Digital Warranty Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Package className="w-4 h-4 text-blue-600" /> Purchased Hardware ({items.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {items.map(item => (
              <div key={item.order_item_id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                  <p className="text-slate-400 text-[11px]">{item.brand} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-sans text-sm">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <div className="mt-1">
                    <Link
                      href="/dashboard?tab=warranties"
                      className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3 text-teal-600" /> Digital Warranty Active
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address & Payment Summary */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Delivery Address
            </span>
            <p className="font-semibold text-slate-900 mt-2">{address.name} ({address.phone})</p>
            <p className="text-slate-600">{address.street}</p>
            <p className="text-slate-600">{address.city}, {address.state} - {address.pincode}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs text-xs space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Payment Summary
            </span>
            <p className="font-semibold text-slate-900 uppercase mt-2">
              {order.payment_method?.replace(/_/g, ' ')}
            </p>
            <p className="text-teal-700 font-medium capitalize">
              Status: {order.payment_status}
            </p>
            <p className="text-slate-400 text-[11px] pt-1">
              SmartShield Warranty automatically registered with this invoice.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
