'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCartStore, useAuthStore } from '@/lib/store';
import { formatPrice } from '@/components/ProductCard';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Shield, Truck, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const COUPONS: Record<string, number> = { 'VOLT10': 10, 'TECH20': 20, 'WELCOME15': 15 };

export default function CartPage() {
  const { items, updateQty, removeItem, setItems } = useCartStore();
  const user = useAuthStore(s => s.user);
  const router = useRouter();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  useEffect(() => {
    if (user) {
      fetch('/api/cart')
        .then(r => r.json())
        .then(d => {
          if (d.items) {
            const mapped = d.items.map((item: any) => ({
              ...item,
              product_id: item.product_id,
              price: Math.round(item.price * (1 - (item.discount || 0) / 100)),
            }));
            setItems(mapped);
          }
        });
    }
  }, [user, setItems]);

  const subtotal = items.reduce((a, b) => a + b.price * b.quantity, 0);
  const freeDeliveryThreshold = 999;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery || items.length === 0 ? 0 : 99;
  const discountAmt = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmt + deliveryFee;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const pct = COUPONS[code];
    if (pct) {
      setDiscount(pct);
      setCouponApplied(code);
      toast.success(`Coupon applied! ${pct}% discount added`);
    } else {
      toast.error('Invalid coupon code. Try VOLT10 or TECH20');
    }
  };

  const handleQtyChange = async (productId: number, qty: number) => {
    if (qty <= 0) {
      handleRemove(productId);
      return;
    }
    updateQty(productId, qty);
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: qty }),
      });
    } catch {}
  };

  const handleRemove = async (productId: number) => {
    removeItem(productId);
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
    } catch {}
    toast.success('Item removed from cart');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Header />
        <div className="max-w-md mx-auto my-auto p-8 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Please Sign In to Access Cart</h2>
          <p className="text-slate-500 text-xs mb-6">
            Log in to view your saved hardware devices, synced accessories, and eligible warranty plans.
          </p>
          <Link href="/login" className="btn-primary w-full text-xs font-semibold py-2.5 rounded-lg">
            Sign In Now
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Your Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            Continue Shopping →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is currently empty</h3>
            <p className="text-xs text-slate-500 mb-6">
              Browse our catalog of smartphones, laptops, audio systems, and gaming gear.
            </p>
            <Link href="/products" className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Alert Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    {isFreeDelivery
                      ? 'Congratulations! You qualify for Free Express Delivery.'
                      : `Add ${formatPrice(freeDeliveryThreshold - subtotal)} more for Free Express Delivery.`}
                  </span>
                  <span className="font-bold text-blue-600">
                    {isFreeDelivery ? '100%' : `${Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
                {items.map(item => {
                  const imgs = (() => {
                    try {
                      return typeof item.images === 'string'
                        ? JSON.parse(item.images)
                        : item.images || [];
                    } catch {
                      return [];
                    }
                  })();

                  return (
                    <div key={item.product_id} className="p-4 sm:p-5 flex items-center gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center flex-shrink-0">
                        {imgs[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imgs[0]}
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80';
                            }}
                          />
                        ) : (
                          <span className="text-xl">📱</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {item.brand}
                        </span>
                        <h4 className="font-semibold text-slate-800 text-xs sm:text-sm truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-slate-900 text-sm font-sans">
                            {formatPrice(item.price)}
                          </span>
                          <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                            <Shield className="w-3 h-3 text-teal-600" /> Auto-Warranty Included
                          </span>
                        </div>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden flex-shrink-0">
                        <button
                          onClick={() => handleQtyChange(item.product_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total & Remove */}
                      <div className="text-right flex-shrink-0 space-y-1">
                        <p className="font-bold text-slate-900 text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Coupon Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-600" /> Apply Discount Coupon
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter code (VOLT10)"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs uppercase focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    onClick={applyCoupon}
                    className="btn-secondary text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">
                    ✓ Code &apos;{couponApplied}&apos; applied (-{discount}%)
                  </p>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmt > 0 && (
                    <div className="flex justify-between text-teal-700 font-medium">
                      <span>Discount ({discount}%)</span>
                      <span>-{formatPrice(discountAmt)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Express Delivery</span>
                    <span>{deliveryFee === 0 ? <strong className="text-teal-600">FREE</strong> : formatPrice(deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>SmartShield Digital Warranty</span>
                    <span className="font-semibold text-teal-600">INCLUDED (₹0)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">Total Amount</span>
                    <span className="font-extrabold text-slate-900 text-xl font-sans">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA (Electric Blue) */}
                <Link
                  href="/checkout"
                  className="btn-primary w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>256-Bit SSL Encrypted & Genuine Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
