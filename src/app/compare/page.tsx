'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GitCompare, X, Trash2, ArrowRight, Shield, ShoppingCart } from 'lucide-react';
import { useCompareStore, useCartStore, useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { formatPrice, getDiscountedPrice, StarRating } from '@/components/ProductCard';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { items, removeItem, clear } = useCompareStore();
  const { addItem } = useCartStore();
  const user = useAuthStore(s => s.user);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-md mx-auto py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <GitCompare className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">No Devices Selected for Comparison</h1>
          <p className="text-xs text-slate-500 mb-6">
            Compare processors, battery sizes, display panels, and prices across up to 4 devices.
          </p>
          <Link href="/products" className="btn-primary text-xs font-semibold px-6 py-2.5 rounded-lg">
            Browse Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const allSpecKeys = Array.from(
    new Set(
      items.flatMap((p: any) => {
        try {
          return Object.keys(typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications || {});
        } catch {
          return [];
        }
      })
    )
  );

  const handleAddToCart = (p: any) => {
    if (!user) {
      toast.error('Please sign in to add to cart');
      return;
    }
    const discountedPrice = getDiscountedPrice(p.price, p.discount);
    addItem({
      product_id: p.product_id,
      name: p.name,
      brand: p.brand,
      price: discountedPrice,
      discount: p.discount,
      images: p.images,
      quantity: 1,
      stock: p.stock,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-blue-600" /> Device Hardware Comparison ({items.length}/4)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side technical specs, warranty coverage, and price analysis.
            </p>
          </div>
          <button
            onClick={clear}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Comparison
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto p-4 sm:p-6">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-4 pr-6 w-36 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  Device Model
                </th>
                {items.map((p: any) => {
                  const imgs = (() => {
                    try {
                      return typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [];
                    } catch {
                      return [];
                    }
                  })();

                  return (
                    <th key={p.product_id} className="py-4 px-4 min-w-[220px] align-top">
                      <div className="relative bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                        <button
                          onClick={() => removeItem(p.product_id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="h-28 flex items-center justify-center">
                          {imgs[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imgs[0]}
                              alt={p.name}
                              className="h-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <span className="text-2xl">📱</span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            {p.brand}
                          </span>
                          <h4 className="font-semibold text-slate-900 line-clamp-1">{p.name}</h4>
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="btn-primary w-full py-2 text-[11px] rounded-lg font-semibold flex items-center justify-center gap-1.5"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add to Cart
                        </button>
                      </div>
                    </th>
                  );
                })}

                {items.length < 4 && (
                  <th className="py-4 px-4 min-w-[180px] align-top">
                    <Link
                      href="/products"
                      className="h-full min-h-[220px] rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 p-4 flex flex-col items-center justify-center text-center transition-colors group cursor-pointer block"
                    >
                      <GitCompare className="w-6 h-6 text-slate-300 group-hover:text-blue-600 mb-2 transition-colors" />
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                        + Add Another Device
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">Up to 4 devices</p>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Price Row */}
              <tr>
                <td className="py-3.5 pr-6 font-semibold text-slate-500">Effective Price</td>
                {items.map((p: any) => (
                  <td key={p.product_id} className="py-3.5 px-4 font-bold text-slate-900 text-sm font-sans">
                    {formatPrice(getDiscountedPrice(p.price, p.discount))}
                    {p.discount > 0 && (
                      <span className="price-original text-xs ml-2 text-slate-400">
                        {formatPrice(p.price)}
                      </span>
                    )}
                  </td>
                ))}
                {items.length < 4 && <td />}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className="py-3.5 pr-6 font-semibold text-slate-500">Rating</td>
                {items.map((p: any) => (
                  <td key={p.product_id} className="py-3.5 px-4">
                    <StarRating rating={p.rating || 4.5} count={p.review_count || 120} />
                  </td>
                ))}
                {items.length < 4 && <td />}
              </tr>

              {/* Warranty Duration */}
              <tr>
                <td className="py-3.5 pr-6 font-semibold text-slate-500">Warranty Coverage</td>
                {items.map((p: any) => (
                  <td key={p.product_id} className="py-3.5 px-4">
                    <span className="text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1">
                      <Shield className="w-3 h-3 text-teal-600" />
                      {p.warranty_period_months || 12} Months OEM
                    </span>
                  </td>
                ))}
                {items.length < 4 && <td />}
              </tr>

              {/* Specifications Keys */}
              {allSpecKeys.map(specKey => (
                <tr key={specKey}>
                  <td className="py-3 pr-6 font-medium text-slate-500">{specKey}</td>
                  {items.map((p: any) => {
                    const specs = (() => {
                      try {
                        return typeof p.specifications === 'string'
                          ? JSON.parse(p.specifications)
                          : p.specifications || {};
                      } catch {
                        return {};
                      }
                    })();
                    return (
                      <td key={p.product_id} className="py-3 px-4 font-medium text-slate-800">
                        {specs[specKey] ? String(specs[specKey]) : '—'}
                      </td>
                    );
                  })}
                  {items.length < 4 && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
