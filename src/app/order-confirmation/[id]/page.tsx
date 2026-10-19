'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/components/ProductCard';
import { CheckCircle2, Package, Shield, ArrowRight, Printer, Sparkles } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => {
        setOrder(d.order);
        setItems(d.items || []);
      });
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const address = (() => {
    try {
      return JSON.parse(order.shipping_address);
    } catch {
      return {};
    }
  })();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-[#1E293B]">
      <Header />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0EA5A0] shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#0EA5A0] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed & Confirmed
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E293B] tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-[#64748B] text-sm mt-1">
            An order confirmation and official invoice copy has been linked to your account.
          </p>
        </div>

        {/* Invoice card */}
        <div id="invoice" className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 shadow-xs mb-8">
          {/* Invoice header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-xs">
                  ⚡
                </div>
                <span className="text-xl font-extrabold text-[#1E293B] tracking-tight">
                  Tech<span className="text-[#2563EB]">Volt</span> Retail
                </span>
              </div>
              <p className="text-[#64748B] text-xs">Official Consumer Electronics & Certified Repair Hub</p>
              <p className="text-[#94A3B8] text-[11px] mt-0.5">GSTIN: 29AABCE1234F1Z7</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 mb-1">
                Order #{order.order_id}
              </span>
              <p className="text-[#1E293B] font-bold text-base">
                INV-{order.order_id.toString().padStart(6, '0')}
              </p>
              <p className="text-[#64748B] text-xs">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#E2E8F0]">
            <div>
              <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider mb-2">
                Billed To
              </p>
              <p className="text-[#1E293B] font-bold text-sm">{address.name || 'Customer'}</p>
              <p className="text-[#64748B] text-xs mt-0.5">{address.street || 'Address on file'}</p>
              <p className="text-[#64748B] text-xs">
                {address.city ? `${address.city}, ` : ''}{address.state || ''} {address.pincode ? `- ${address.pincode}` : ''}
              </p>
              {address.phone && <p className="text-[#64748B] text-xs mt-1">Phone: {address.phone}</p>}
            </div>

            <div>
              <p className="text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider mb-2">
                Shipping Destination
              </p>
              <p className="text-[#1E293B] font-bold text-sm">{address.name || 'Customer'}</p>
              <p className="text-[#64748B] text-xs mt-0.5">{address.street || 'Address on file'}</p>
              <p className="text-[#64748B] text-xs">
                {address.city ? `${address.city}, ` : ''}{address.state || ''} {address.pincode ? `- ${address.pincode}` : ''}
              </p>
              <p className="text-[#0EA5A0] text-xs font-semibold mt-1 flex items-center gap-1">
                <span>🛡️</span> SmartShield Verified Delivery
              </p>
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-x-auto py-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="pb-3 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider">Item Details</th>
                  <th className="pb-3 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider text-center">Qty</th>
                  <th className="pb-3 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider text-right">Unit Price</th>
                  <th className="pb-3 text-[#94A3B8] text-[11px] font-semibold uppercase tracking-wider text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {items.map((item: any) => (
                  <tr key={item.order_item_id}>
                    <td className="py-3.5 pr-4">
                      <p className="text-[#1E293B] text-sm font-semibold">{item.name}</p>
                      <p className="text-[#64748B] text-xs">{item.brand} • Genuine Sealed Unit</p>
                    </td>
                    <td className="py-3.5 text-center text-[#475569] text-sm">{item.quantity}</td>
                    <td className="py-3.5 text-right text-[#475569] text-sm">{formatPrice(item.price)}</td>
                    <td className="py-3.5 text-right text-[#1E293B] font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-[#64748B] max-w-xs space-y-1">
              <p>• All electronic devices include official brand manufacturer warranty.</p>
              <p>• 7-day replacement guarantee for damaged or defective components.</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#64748B]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1E293B]">{formatPrice(order.total_amount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-[#0EA5A0] font-medium">
                  <span>Coupon Savings</span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#64748B]">
                <span>Estimated GST (18%)</span>
                <span>{formatPrice(Math.round(order.final_amount * 0.18 / 1.18))}</span>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Express Shipping</span>
                <span className="text-[#0EA5A0] font-bold">
                  {order.delivery_fee === 0 ? 'FREE' : formatPrice(order.delivery_fee)}
                </span>
              </div>
              <div className="flex justify-between text-[#1E293B] font-bold text-base border-t border-[#E2E8F0] pt-2">
                <span>Total Paid</span>
                <span className="text-[#2563EB]">{formatPrice(order.final_amount)}</span>
              </div>
              <div className="flex justify-between text-[#94A3B8] text-[11px] pt-1">
                <span>Payment Method</span>
                <span className="text-[#475569] font-medium capitalize">
                  {order.payment_method?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <Link
            href={`/dashboard?tab=orders`}
            className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl p-4 text-center shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1E293B]">Track Order</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Live shipping progress</p>
          </Link>

          <Link
            href="/warranty/register"
            className="bg-white border border-[#E2E8F0] hover:border-[#0EA5A0] rounded-xl p-4 text-center shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0EA5A0] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1E293B]">Register Warranty</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Activate SmartShield</p>
          </Link>

          <button
            onClick={() => window.print()}
            className="bg-white border border-[#E2E8F0] hover:border-slate-400 rounded-xl p-4 text-center shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 text-[#475569] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1E293B]">Print Invoice</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">PDF or paper copy</p>
          </button>

          <Link
            href="/products"
            className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-xl p-4 text-center shadow-2xs hover:shadow-xs transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1E293B]">Continue Shopping</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">Explore more tech</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
