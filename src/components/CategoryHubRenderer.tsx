'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  Award,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { CategoryHubConfig } from '@/data/categoryHubData';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface Props {
  config: CategoryHubConfig;
}

export default function CategoryHubRenderer({ config }: Props) {
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(config.maxPrice);
  const [selectedCustom, setSelectedCustom] = useState<Record<string, string[]>>({});
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    brand: true,
    price: true,
    storage: false,
    screenSize: false,
    ram: false,
    network: false,
    os: false,
    stylus: false,
    battery: false,
    rating: false,
    deviceType: false,
    features: false,
    batteryLife: false,
    waterResistance: false,
    displayType: false,
    connectivity: false,
    operatingSystem: false,
    type: false,
    anc: false,
    mic: false,
    productType: false,
    gpu: false,
    processor: false,
    displaySize: false,
    refreshRate: false,
    compat: false,
    color: false,
    fastCharging: false,
    cableType: false,
    warranty: false,
  });

  const addItem = useCartStore(s => s.addItem);

  const toggleAccordion = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const next = !prev[id];
      if (next) toast.success('Added to Wishlist! ❤️');
      else toast('Removed from Wishlist', { icon: '💔' });
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (prod: any) => {
    addItem({
      product_id: prod.id,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      discount: prod.discount,
      images: JSON.stringify([prod.image]),
      quantity: 1,
      stock: 10,
    });
    toast.success(`${prod.brand} ${prod.name} added to cart! 🛒`);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setMaxPriceFilter(config.maxPrice);
    setSelectedCustom({});
    toast.success('Filters cleared');
  };

  // Filter products by brand and price
  const filteredProducts = config.products.filter(p => {
    if (selectedBrands.length > 0 && !selectedBrands.some(b => b.toLowerCase() === p.brand.toLowerCase())) {
      return false;
    }
    if (p.price > maxPriceFilter) {
      return false;
    }
    return true;
  });

  const displayedBrands = showAllBrands ? config.filterBrands : config.filterBrands.slice(0, 7);

  return (
    <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Clean Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800">{config.breadcrumb}</span>
      </div>

      {/* 2-Column Grid Layout: Sidebar on Left, Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ==================================================
            LEFT SIDEBAR: FACETED FILTERS
            ================================================== */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Filters</h2>
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6 text-xs text-slate-700">
            {/* 1. Category Checkboxes */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('category')}
                className="w-full flex items-center justify-between font-bold text-slate-900 py-1.5 cursor-pointer"
              >
                <span className="text-[13px]">Category</span>
                {openSections.category ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openSections.category && (
                <div className="mt-3 space-y-2.5 pl-0.5">
                  {config.filterCategories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(cat)}
                        onChange={e => {
                          if (e.target.checked) setSelectedTypes([...selectedTypes, cat]);
                          else setSelectedTypes(selectedTypes.filter(t => t !== cat));
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-[13px]">{cat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* 2. Brand Checkboxes */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('brand')}
                className="w-full flex items-center justify-between font-bold text-slate-900 py-1.5 cursor-pointer"
              >
                <span className="text-[13px]">Brand</span>
                {openSections.brand ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openSections.brand && (
                <div className="mt-3 space-y-2.5 pl-0.5">
                  {displayedBrands.map(b => (
                    <label key={b} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={e => {
                          if (e.target.checked) setSelectedBrands([...selectedBrands, b]);
                          else setSelectedBrands(selectedBrands.filter(brand => brand !== b));
                        }}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="text-[13px]">{b}</span>
                    </label>
                  ))}
                  {config.filterBrands.length > 7 && (
                    <button
                      type="button"
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-blue-600 font-semibold text-[11px] pt-1.5 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      {showAllBrands ? 'View Less' : 'View More'} <ChevronDown className={`w-3 h-3 transition-transform ${showAllBrands ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100" />

            {/* 3. Price Range Slider */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion('price')}
                className="w-full flex items-center justify-between font-bold text-slate-900 py-1.5 cursor-pointer"
              >
                <span className="text-[13px]">Price Range</span>
                {openSections.price ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {openSections.price && (
                <div className="mt-3.5 space-y-2.5">
                  <input
                    type="range"
                    min={config.minPrice}
                    max={config.maxPrice}
                    step={config.priceStep}
                    value={maxPriceFilter}
                    onChange={e => setMaxPriceFilter(Number(e.target.value))}
                    className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-0.5">
                    <span>₹{config.minPrice.toLocaleString('en-IN')}</span>
                    <span className="text-blue-600 font-extrabold">₹{maxPriceFilter.toLocaleString('en-IN')}+</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Custom Filter Sections */}
            {config.customFilterSections?.map(sec => (
              <div key={sec.key}>
                <div className="h-px bg-slate-100 my-4" />
                <button
                  type="button"
                  onClick={() => toggleAccordion(sec.key)}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1.5 cursor-pointer"
                >
                  <span className="text-[13px]">{sec.title}</span>
                  {openSections[sec.key] ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {openSections[sec.key] && (
                  <div className="mt-3 space-y-2.5 pl-0.5">
                    {sec.options.map(opt => {
                      const activeList = selectedCustom[sec.key] || [];
                      const isChecked = activeList.includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-3 py-0.5 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedCustom(prev => ({
                                  ...prev,
                                  [sec.key]: [...(prev[sec.key] || []), opt],
                                }));
                              } else {
                                setSelectedCustom(prev => ({
                                  ...prev,
                                  [sec.key]: (prev[sec.key] || []).filter(item => item !== opt),
                                }));
                              }
                            }}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                          />
                          <span className="text-[13px]">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* ==================================================
            RIGHT CONTENT: HERO, SUBCARDS, BRANDS & PRODUCTS
            ================================================== */}
        <section className="lg:col-span-9 space-y-10 sm:space-y-12">
          {/* ==================================================
              HERO BANNER
              ================================================== */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#03091E] via-[#091539] to-[#0A1A4A] border border-blue-900/30 text-white p-8 sm:p-10 lg:p-12 shadow-xl">
            {/* Background Glows & Graphics */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Headings & CTA */}
              <div className="md:col-span-7 space-y-6">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3.5 py-1.5 rounded-full">
                  {config.hero.badge}
                </span>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black leading-[1.15] tracking-tight text-white whitespace-pre-line">
                  {config.hero.heading}
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
                  {config.hero.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <a
                    href={config.hero.ctaHref}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all shadow-md group cursor-pointer"
                  >
                    <span>{config.hero.ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                {/* 4 Value Badges */}
                <div className="pt-6 mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-300 border-t border-white/15">
                  {config.hero.valueBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {idx === 0 && <Truck className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {idx === 1 && <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {idx === 2 && <Award className="w-4 h-4 text-cyan-400 shrink-0" />}
                      {idx === 3 && <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />}
                      <span className="whitespace-nowrap">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Hero Graphic or Side Highlights */}
              <div className="md:col-span-5 relative flex flex-col items-center justify-center">
                {/* Hero Showcase Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src={config.hero.bannerImage}
                    alt={config.displayName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Feature highlights pill overlay */}
                  {config.hero.sideHighlights && (
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
                      {config.hero.sideHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 rounded-md"
                        >
                          {hl.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Carousel Navigation Indicators */}
                <div className="mt-4 flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-1.5 rounded-full bg-blue-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                  <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              SUBCATEGORIES ROW (Matching screenshot cards)
              ================================================== */}
          {config.subcards.length > 0 && (
            <div>
              {config.subcardsTitle && (
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{config.subcardsTitle}</h3>
                </div>
              )}
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${Math.min(config.subcards.length, 5)} gap-4 sm:gap-5`}
                style={{
                  gridTemplateColumns: `repeat(${Math.min(config.subcards.length, 6)}, minmax(0, 1fr))`,
                }}
              >
                {config.subcards.map((sub, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col items-center justify-between text-center hover:shadow-md hover:border-blue-400 transition-all cursor-pointer min-h-[155px]"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 relative rounded-xl overflow-hidden mb-3 bg-slate-50 flex items-center justify-center p-1">
                      {sub.image && (
                        <Image
                          src={sub.image}
                          alt={sub.title}
                          fill
                          className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {sub.title}
                      </h4>
                      {sub.desc && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 flex items-center justify-center gap-1">
                          <span>{sub.desc}</span>
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              SHOP BY BRAND STRIP
              ================================================== */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Shop by Brand</h3>
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer hover:underline"
              >
                View All Brands <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
              {config.brands.map(brand => {
                const isSelected = selectedBrands.includes(brand.name);
                return (
                  <button
                    key={brand.name}
                    type="button"
                    onClick={() => {
                      if (isSelected) setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                      else setSelectedBrands([...selectedBrands, brand.name]);
                    }}
                    className={`h-16 sm:h-18 rounded-xl border flex items-center justify-center p-2.5 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600 text-blue-600 font-extrabold'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs text-slate-800 font-bold'
                    }`}
                  >
                    <span className="text-xs sm:text-[13px] tracking-tight">{brand.logo}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              PRODUCTS GRID
              ================================================== */}
          <div id="products-grid">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{config.productsTitle}</h3>
              <a
                href="#products-grid"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer hover:underline"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-base font-semibold text-slate-700">No products match your selected filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7">
                {filteredProducts.map(prod => {
                  const isWishlisted = !!wishlist[prod.id];
                  return (
                    <div
                      key={prod.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group relative"
                    >
                      {/* Wishlist Button */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(prod.id)}
                        className={`absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center transition-colors z-10 cursor-pointer ${
                          isWishlisted
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-white/80 backdrop-blur-xs border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                      </button>

                      {/* Product Image */}
                      <div className="w-full aspect-[4/3] relative rounded-xl overflow-hidden bg-slate-50/70 mb-4 flex items-center justify-center p-3">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Details */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{prod.brand}</p>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                            {prod.name}
                          </h4>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-1.5 text-xs pt-1">
                            <div className="flex items-center text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                              <span>{prod.rating}</span>
                            </div>
                            <span className="text-slate-400">({prod.reviews})</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="pt-3">
                          <div className="flex items-baseline gap-2.5">
                            <span className="text-base sm:text-lg font-black text-slate-900">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{prod.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            {prod.discount > 0 && (
                              <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {prod.discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* EMI Tag */}
                          {prod.emi && (
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              EMI from <span className="font-bold text-slate-700">{prod.emi}</span>/month
                            </p>
                          )}

                          {/* Warranty Badge */}
                          <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50/70 border border-blue-100 px-2.5 py-0.5 rounded-md">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{prod.warranty}</span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod)}
                          className="mt-4 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs hover:shadow-md cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ==================================================
              BOTTOM PROMO CARDS (3 Cards Row)
              ================================================== */}
          {config.promoCards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-3">
              {config.promoCards.map((promo, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 sm:p-7 border border-slate-200/80 bg-gradient-to-br ${promo.bgGradient} flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md transition-all group min-h-[190px]`}
                >
                  <div className="relative z-10 space-y-2 max-w-[65%]">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {promo.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed">
                      {promo.desc}
                    </p>
                    <div className="pt-3">
                      <a
                        href={promo.href || '#products-grid'}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        <span>{promo.buttonText}</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Thumbnail / Showcase Graphic on right */}
                  <div className="absolute right-3 bottom-3 w-32 h-32 relative rounded-xl overflow-hidden pointer-events-none">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
