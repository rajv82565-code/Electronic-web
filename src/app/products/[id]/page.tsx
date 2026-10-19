'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard, { StarRating, formatPrice, getDiscountedPrice } from '@/components/ProductCard';
import { useCartStore, useCompareStore, useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import {
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  GitCompare,
  Star,
  Check,
  MessageSquare,
  Wrench,
  RotateCcw,
  CreditCard,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQty] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem, items: cartItems } = useCartStore();
  const { addItem: addCompare, items: compareItems } = useCompareStore();
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-slate-500 mb-6 text-sm">The hardware item you are looking for does not exist or has been discontinued.</p>
          <Link href="/products" className="btn-primary text-xs font-semibold px-5 py-2.5 rounded-lg">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { product, reviews = [], related = [] } = data;
  const images = (() => {
    try {
      return typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
    } catch {
      return [];
    }
  })();
  const specs = (() => {
    try {
      return typeof product.specifications === 'string'
        ? JSON.parse(product.specifications)
        : product.specifications || {};
    } catch {
      return {};
    }
  })();

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const inCart = cartItems.some(i => i.product_id === product.product_id);
  const inCompare = compareItems.some((i: any) => i.product_id === product.product_id);
  const emiPerMonth = Math.round(discountedPrice / 12);

  const handleAddCart = async () => {
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }
    addItem({
      product_id: product.product_id,
      name: product.name,
      brand: product.brand,
      price: discountedPrice,
      discount: product.discount,
      images: product.images,
      quantity,
      stock: product.stock,
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.product_id, quantity }),
      });
    } catch {
      // offline fallback
    }
    toast.success('Added to cart!');
  };

  const handleBuyNow = async () => {
    await handleAddCart();
    router.push('/cart');
  };

  const handleCompare = () => {
    if (inCompare) {
      toast('Device is already in comparison', { icon: '⚖️' });
      return;
    }
    const ok = addCompare(product);
    if (!ok) toast.error('Can compare up to 4 devices');
    else toast.success('Added to device comparison');
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('Please sign in to write a review');
      return;
    }
    setSubmittingReview(true);
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.product_id,
        rating: reviewRating,
        review: reviewText,
      }),
    });
    if (res.ok) {
      toast.success('Review posted successfully!');
      setReviewText('');
      const updated = await fetch(`/api/products/${id}`).then(r => r.json());
      setData(updated);
    } else {
      toast.error('Could not submit review');
    }
    setSubmittingReview(false);
  };

  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: reviews.filter((rv: any) => rv.rating === r).length,
    pct: reviews.length
      ? Math.round((reviews.filter((rv: any) => rv.rating === r).length / reviews.length) * 100)
      : 0,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      {/* Breadcrumb Strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          {product.category_name && (
            <>
              <Link href={`/products?category=${product.category_slug || ''}`} className="hover:text-blue-600">
                {product.category_name}
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </>
          )}
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <main className="w-[min(94%,1440px)] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Product Top Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left: Image Gallery (5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center justify-center relative overflow-hidden h-[380px] sm:h-[440px] shadow-2xs">
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-2xs">
                  {product.discount}% OFF
                </div>
              )}
              {images[activeImg] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[activeImg]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80';
                  }}
                />
              ) : (
                <div className="text-center text-slate-400">
                  <span className="text-6xl">⚡</span>
                  <p className="text-xs font-semibold text-slate-600 mt-2">{product.brand}</p>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`w-18 h-18 rounded-lg bg-white border-2 p-1.5 transition-all overflow-hidden flex-shrink-0 cursor-pointer ${
                      idx === activeImg
                        ? 'border-blue-600 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Buying Actions (7 cols) */}
          <div className="md:col-span-6 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-5">
              {/* Brand & Category header */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                  {product.brand}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {product.category_name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Stock row */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <StarRating rating={product.rating || 4.5} count={product.review_count || 120} />
                <span className="text-slate-300">|</span>
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded">
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    In Stock ({product.stock} units available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded">
                    Temporarily Out of Stock
                  </span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    Low Stock: Order Soon!
                  </span>
                )}
              </div>

              {/* Price Row */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans">
                      {formatPrice(discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                      <>
                        <span className="price-original text-base text-slate-400">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                          Save {formatPrice(product.price - discountedPrice)}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    No-Cost EMI available starting at <strong className="text-slate-800">{formatPrice(emiPerMonth)}/month</strong>
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Inclusive of all GST taxes</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inCart
                      ? 'bg-teal-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? 'Already In Cart (View Cart)' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 py-3 px-5 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4 fill-white text-white" /> Buy Now
                </button>

                <button
                  onClick={handleCompare}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    inCompare
                      ? 'bg-teal-50 border-teal-300 text-teal-700'
                      : 'border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600'
                  }`}
                  title="Compare with other devices"
                >
                  <GitCompare className="w-4 h-4" />
                  <span className="hidden sm:inline">Compare</span>
                </button>
              </div>

              {/* Verified Warranty Assurance Card */}
              <div className="rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-semibold text-xs sm:text-sm">
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>{product.warranty_period_months || 12}-Month SmartShield Warranty Included</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Upon purchase, your unique serial number and digital warranty certificate will be auto-generated in your customer dashboard for seamless 1-click doorstep repair claims.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 font-medium border-t border-teal-100">
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-teal-600" /> Free Shipping
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-teal-600" /> Doorstep Repairs
                  </div>
                  <div className="flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-teal-600" /> 7-Day Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        {Object.keys(specs).length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Technical Specifications & Hardware Details
            </h2>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-1 text-xs">
              {Object.entries(specs).map(([label, val], idx) => (
                <div
                  key={label}
                  className={`flex items-center justify-between py-2.5 px-3 rounded ${
                    idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'
                  }`}
                >
                  <span className="font-semibold text-slate-600 w-1/3">{label}</span>
                  <span className="text-slate-900 font-medium w-2/3 text-right">{String(val)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> Verified Customer Reviews
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">Based on {reviews.length} authenticated purchase reviews</p>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Rating breakdown (4 cols) */}
            <div className="md:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200/80 flex items-center gap-6">
              <div className="text-center flex-shrink-0">
                <div className="text-5xl font-black text-slate-900">{product.rating ? product.rating.toFixed(1) : '4.5'}</div>
                <div className="mt-1">
                  <StarRating rating={product.rating || 4.5} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{reviews.length} reviews</p>
              </div>

              <div className="flex-1 space-y-1.5">
                {ratingDist.map(r => (
                  <div key={r.star} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-600 font-medium w-3">{r.star}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-400 w-6 text-right">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write a review (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-xl border border-slate-200 p-5">
              {user ? (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Share Your Hardware Experience</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500 mr-2 font-medium">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="cursor-pointer p-0.5"
                        type="button"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Describe build quality, screen display, battery life, performance..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 h-20 resize-none"
                  />
                  <button
                    onClick={submitReview}
                    disabled={submittingReview || !reviewText.trim()}
                    className="btn-primary text-xs font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-500 mb-2">Sign in to your customer account to post a verified review.</p>
                  <Link href="/login" className="btn-outline text-xs font-semibold py-1.5 px-4 rounded-lg">
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {reviews.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-6">No customer reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((r: any) => (
                <div key={r.review_id} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {r.user_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 text-xs mr-2">{r.user_name}</span>
                        {r.verified_purchase === 1 && (
                          <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="pl-9 space-y-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.review}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products Grid */}
        {related && related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Similar Devices & Accessories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((prod: any) => (
                <ProductCard key={prod.product_id} product={prod} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
