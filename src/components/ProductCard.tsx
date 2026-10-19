'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, GitCompare, Star, Shield, Eye, Check, Heart } from 'lucide-react';
import { useCartStore, useCompareStore, useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
  compact?: boolean;
}

export function getDiscountedPrice(price: number, discount: number) {
  if (!discount || discount <= 0) return price;
  return Math.round(price * (1 - discount / 100));
}

export function formatPrice(p: number) {
  return '₹' + p.toLocaleString('en-IN');
}

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            className={`w-3 h-3 ${
              s <= Math.round(rating)
                ? 'text-[#F59E0B] fill-[#F59E0B]'
                : 'text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-[#64748B] text-[11px] font-semibold">
        {rating.toFixed(1)}
        {count !== undefined && <span className="text-[#94A3B8]"> ({count})</span>}
      </span>
    </div>
  );
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const router = useRouter();
  const { items: cartItems, addItem } = useCartStore();
  const { addItem: addCompare, items: compareItems } = useCompareStore();
  const user = useAuthStore(s => s.user);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const images = (() => {
    try {
      return typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
    } catch {
      return [];
    }
  })();
  const firstImage = images[0];
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const savings = product.price - discountedPrice;
  const emiPerMonth = Math.round(discountedPrice / 12);
  const inCart = cartItems.some(i => i.product_id === product.product_id);
  const inCompare = compareItems.some((i: any) => i.product_id === product.product_id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast(isWishlisted ? 'Removed from saved items' : 'Saved to Wishlist ❤️', {
      icon: isWishlisted ? '🗑️' : '❤️',
    });
  };

  const handleAddCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    if (inCart) {
      toast('Item is already in your cart', { icon: '🛒' });
      return;
    }
    addItem({
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      price: discountedPrice,
      discount: product.discount,
      images: product.images,
      quantity: 1,
      stock: product.stock,
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.product_id, quantity: 1 }),
      });
    } catch {
      // offline/client store fallback
    }
    toast.success('Added to cart!');
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      toast('Item already in comparison', { icon: '⚖️' });
      return;
    }
    const ok = addCompare(product);
    if (!ok) toast.error('You can compare up to 4 devices');
    else toast.success('Added to comparison bar');
  };

  return (
    <Link
      href={`/products/${product.product_id}`}
      className="group block bg-white rounded-xl border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:border-[#2563EB]/50 transition-all duration-200 overflow-hidden flex flex-col h-full relative"
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-rose-600 text-white text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={handleWishlist}
          className={`p-1.5 rounded-full backdrop-blur-xs transition-transform duration-200 cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 scale-110'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-600 shadow-2xs'
          }`}
          title={isWishlisted ? 'Saved' : 'Save to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="relative h-36 sm:h-48 bg-[#F8FAFC] border-b border-[#F1F5F9] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
            onError={e => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80`;
            }}
          />
        ) : (
          <div className="text-center text-slate-400">
            <span className="text-2xl sm:text-3xl">⚡</span>
            <p className="text-[10px] font-medium text-slate-500 mt-1">{product.brand}</p>
          </div>
        )}

        {/* Hover Quick Actions Bar (Desktop) */}
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center gap-2">
          <button
            onClick={handleCompare}
            title={inCompare ? 'In Comparison' : 'Add to Compare'}
            className={`p-2 rounded-lg text-xs font-medium shadow-md transition-all cursor-pointer ${
              inCompare
                ? 'bg-teal-600 text-white'
                : 'bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-4 h-4" />
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/products/${product.product_id}`);
            }}
            title="Quick View Specs"
            className="p-2 bg-white text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
              {product.brand}
            </span>
            {product.category_name && (
              <span className="text-[10px] text-[#94A3B8] font-normal truncate max-w-[80px]">
                {product.category_name}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-semibold text-[#1E293B] line-clamp-2 leading-snug group-hover:text-[#2563EB] transition-colors mb-1.5">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="mb-2">
            <StarRating rating={product.rating || 4.5} count={product.review_count || 120} />
          </div>

          {/* Price & Savings */}
          <div className="flex flex-wrap items-baseline gap-1.5 mb-1">
            <span className="text-sm sm:text-base font-extrabold text-[#1E293B]">
              {formatPrice(discountedPrice)}
            </span>
            {product.discount > 0 && (
              <span className="text-[11px] text-[#94A3B8] line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {savings > 0 && (
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1 rounded">
                Save {formatPrice(savings)}
              </span>
            )}
          </div>

          {/* EMI Estimate */}
          {discountedPrice >= 3000 && (
            <p className="text-[10px] text-[#64748B] mb-2 font-medium">
              EMI from <strong className="text-[#1E293B]">{formatPrice(emiPerMonth)}/mo</strong>
            </p>
          )}

          {/* Badges: Warranty (Teal) & Low Stock (Amber) */}
          <div className="flex flex-wrap items-center gap-1 mb-3">
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#0EA5A0] bg-teal-50 border border-teal-200/70 px-1.5 py-0.5 rounded">
              <Shield className="w-2.5 h-2.5" />
              {product.warranty_period_months || 12}M SmartShield
            </span>

            {product.stock <= 5 && product.stock > 0 && (
              <span className="inline-flex items-center text-[10px] font-semibold text-[#D97706] bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Only {product.stock} left!
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Primary CTA (Electric Blue) */}
        <div className="pt-2 border-t border-[#F1F5F9] mt-auto">
          <button
            onClick={handleAddCart}
            disabled={product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              inCart
                ? 'bg-teal-600 text-white'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xs hover:shadow-md'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
