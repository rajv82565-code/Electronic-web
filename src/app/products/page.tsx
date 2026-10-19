'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Truck,
  ShieldCheck,
  Award,
  RotateCcw,
  Star,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Smartphone,
  Laptop,
  Check,
  CreditCard,
} from 'lucide-react';

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Dell', 'Lenovo', 'Sony', 'Bose', 'Microsoft', 'Logitech', 'Anker', 'Xiaomi', 'Amazon'];

const CATEGORIES = [
  { name: 'Smartphones', slug: 'smartphones' },
  { name: 'Laptops', slug: 'laptops' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Smart Watches', slug: 'smart-watches' },
  { name: 'Headphones', slug: 'headphones' },
  { name: 'Earbuds', slug: 'earbuds' },
  { name: 'Cameras', slug: 'cameras' },
  { name: 'Gaming Devices', slug: 'gaming-devices' },
  { name: 'Computer Accessories', slug: 'computer-accessories' },
  { name: 'Chargers & Power', slug: 'chargers' },
  { name: 'Smart Home', slug: 'smart-home' },
];

/* =========================================================================
   SMARTPHONE DATA (MATCHING SCREENSHOT 1)
   ========================================================================= */
const SMARTPHONE_BRANDS = [
  { name: 'Apple', logo: ' Apple' },
  { name: 'Samsung', logo: 'SAMSUNG' },
  { name: 'OnePlus', logo: '1+ OnePlus' },
  { name: 'Xiaomi', logo: 'mi Xiaomi' },
  { name: 'Vivo', logo: 'vivo' },
  { name: 'OPPO', logo: 'oppo' },
  { name: 'Realme', logo: 'realme' },
  { name: 'Google', logo: 'G Google' },
  { name: 'Motorola', logo: 'M motorola' },
  { name: 'Nothing', logo: 'NOTHING' },
];

const TRENDING_SMARTPHONES = [
  {
    id: 101,
    name: 'iPhone 17 Pro',
    brand: 'Apple',
    price: 134900,
    originalPrice: 149900,
    discount: 10,
    rating: 4.8,
    reviews: '1.2K',
    emi: '₹6,399',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    type: 'flagship',
    ram: '8 GB',
    storage: '256 GB',
  },
  {
    id: 102,
    name: 'Galaxy S25 Ultra',
    brand: 'Samsung',
    price: 119999,
    originalPrice: 129999,
    discount: 8,
    rating: 4.7,
    reviews: '856',
    emi: '₹5,699',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
    type: 'flagship',
    ram: '12 GB',
    storage: '256 GB',
  },
  {
    id: 103,
    name: 'OnePlus 13',
    brand: 'OnePlus',
    price: 69999,
    originalPrice: 79999,
    discount: 12,
    rating: 4.6,
    reviews: '642',
    emi: '₹3,299',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80',
    type: 'flagship',
    ram: '16 GB',
    storage: '512 GB',
  },
  {
    id: 104,
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    price: 49999,
    originalPrice: 59999,
    discount: 17,
    rating: 4.5,
    reviews: '420',
    emi: '₹2,399',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    type: 'mid-range',
    ram: '12 GB',
    storage: '256 GB',
  },
  {
    id: 105,
    name: 'X200',
    brand: 'vivo',
    price: 59999,
    originalPrice: 69999,
    discount: 14,
    rating: 4.5,
    reviews: '312',
    emi: '₹2,899',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
    type: 'mid-range',
    ram: '12 GB',
    storage: '256 GB',
  },
  {
    id: 106,
    name: 'Pixel 9',
    brand: 'Google',
    price: 79999,
    originalPrice: 89999,
    discount: 11,
    rating: 4.4,
    reviews: '288',
    emi: '₹3,799',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&q=80',
    type: 'flagship',
    ram: '12 GB',
    storage: '256 GB',
  },
];

const PHONE_ACCESSORIES = [
  {
    id: 201,
    name: 'AirPods Pro (2nd Gen)',
    category: 'Earbuds',
    price: 24900,
    rating: 4.8,
    reviews: '2.4K',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
  },
  {
    id: 202,
    name: '65W GaN Fast Charger Adapter',
    category: 'Charger',
    price: 2499,
    rating: 4.7,
    reviews: '920',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
  },
  {
    id: 203,
    name: 'Magnetic Armor Case with Stand',
    category: 'Cases',
    price: 999,
    rating: 4.5,
    reviews: '410',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80',
  },
  {
    id: 204,
    name: '10,000mAh MagSafe Power Bank',
    category: 'Power Bank',
    price: 2999,
    rating: 4.6,
    reviews: '530',
    image: 'https://images.unsplash.com/photo-1609081219090-a6d8173087ec?w=400&q=80',
  },
  {
    id: 205,
    name: 'Smart Watch Ultra Companion',
    category: 'Wearables',
    price: 4999,
    rating: 4.6,
    reviews: '610',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
  },
  {
    id: 206,
    name: '9H Sapphire Camera Lens Guard',
    category: 'Protection',
    price: 499,
    rating: 4.4,
    reviews: '890',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
  },
];

/* =========================================================================
   LAPTOP DATA (MATCHING LAPTOPS SCREENSHOT)
   ========================================================================= */
const LAPTOP_SEGMENTS = [
  {
    name: 'Gaming Laptops',
    subtitle: 'High FPS Gaming →',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&q=80',
    type: 'gaming',
  },
  {
    name: 'Business Laptops',
    subtitle: 'Productivity & Performance →',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80',
    type: 'business',
  },
  {
    name: 'Student Laptops',
    subtitle: 'Best for Learning →',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&q=80',
    type: 'student',
  },
  {
    name: 'Creator Laptops',
    subtitle: 'Design. Edit. Create. →',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80',
    type: 'creator',
  },
  {
    name: 'Workstations',
    subtitle: 'For Professionals →',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&q=80',
    type: 'workstation',
  },
];

const LAPTOP_BRANDS = [
  { name: 'Apple', logo: ' Apple' },
  { name: 'Dell', logo: 'DELL' },
  { name: 'HP', logo: 'hp' },
  { name: 'Lenovo', logo: 'Lenovo' },
  { name: 'ASUS', logo: 'ASUS' },
  { name: 'Acer', logo: 'acer' },
  { name: 'MSI', logo: 'msi' },
  { name: 'Microsoft', logo: 'Microsoft' },
];

const BEST_SELLING_LAPTOPS = [
  {
    id: 301,
    name: 'MacBook Air M3',
    brand: 'Apple',
    price: 114900,
    originalPrice: 134900,
    discount: 15,
    rating: 4.8,
    reviews: '1.2K',
    emi: '₹5,499',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    type: 'creator',
    processor: 'Apple M1/M2/M3',
    ram: '16 GB',
  },
  {
    id: 302,
    name: 'TUF Gaming A15',
    brand: 'ASUS',
    price: 79990,
    originalPrice: 94990,
    discount: 16,
    rating: 4.6,
    reviews: '856',
    emi: '₹3,799',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    type: 'gaming',
    processor: 'AMD Ryzen 7',
    ram: '16 GB',
  },
  {
    id: 303,
    name: 'Inspiron 14',
    brand: 'Dell',
    price: 54990,
    originalPrice: 62990,
    discount: 12,
    rating: 4.4,
    reviews: '642',
    emi: '₹2,599',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80',
    type: 'student',
    processor: 'Intel Core i5',
    ram: '8 GB',
  },
  {
    id: 304,
    name: 'Victus 15',
    brand: 'HP',
    price: 67990,
    originalPrice: 79990,
    discount: 15,
    rating: 4.5,
    reviews: '420',
    emi: '₹3,299',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    type: 'gaming',
    processor: 'Intel Core i7',
    ram: '16 GB',
  },
  {
    id: 305,
    name: 'IdeaPad Slim 5',
    brand: 'Lenovo',
    price: 59990,
    originalPrice: 69990,
    discount: 14,
    rating: 4.4,
    reviews: '312',
    emi: '₹2,899',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    type: 'student',
    processor: 'AMD Ryzen 5',
    ram: '16 GB',
  },
  {
    id: 306,
    name: 'Katana 15',
    brand: 'MSI',
    price: 89990,
    originalPrice: 104990,
    discount: 14,
    rating: 4.5,
    reviews: '288',
    emi: '₹4,299',
    warranty: '1 Year Warranty',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80',
    type: 'gaming',
    processor: 'Intel Core i7',
    ram: '16 GB',
  },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('category') || '';

  const isTabletsHub = rawCat === 'tablets';
  const isWearablesHub = rawCat === 'smart-watches' || rawCat === 'wearables';
  const isAudioHub = rawCat === 'headphones' || rawCat === 'audio-anc' || rawCat === 'audio' || rawCat === 'earbuds';
  const isGamingHub = rawCat === 'gaming-devices' || rawCat === 'gaming';
  const isAccessoriesHub = rawCat === 'computer-accessories' || rawCat === 'accessories' || rawCat === 'chargers';
  const isSmartHomeHub = rawCat === 'smart-home';
  const isLaptopsHub = rawCat === 'laptops';
  const isSmartphoneHub = rawCat === 'smartphones' || (!rawCat && !searchParams.get('search') && !isLaptopsHub && !isTabletsHub && !isWearablesHub && !isAudioHub && !isGamingHub && !isAccessoriesHub && !isSmartHomeHub);

  if (isSmartHomeHub && CATEGORY_HUBS['smart-home']) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="smart-home" />
        <CategoryHubRenderer config={CATEGORY_HUBS['smart-home']} />
        <Footer />
      </div>
    );
  }

  if (isTabletsHub && CATEGORY_HUBS.tablets) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="tablets" />
        <CategoryHubRenderer config={CATEGORY_HUBS.tablets} />
        <Footer />
      </div>
    );
  }

  if (isWearablesHub && CATEGORY_HUBS.wearables) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="smart-watches" />
        <CategoryHubRenderer config={CATEGORY_HUBS.wearables} />
        <Footer />
      </div>
    );
  }

  if (isAudioHub && CATEGORY_HUBS.audio) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="headphones" />
        <CategoryHubRenderer config={CATEGORY_HUBS.audio} />
        <Footer />
      </div>
    );
  }

  if (isGamingHub && CATEGORY_HUBS.gaming) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="gaming-devices" />
        <CategoryHubRenderer config={CATEGORY_HUBS.gaming} />
        <Footer />
      </div>
    );
  }

  if (isAccessoriesHub && CATEGORY_HUBS.accessories) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="computer-accessories" />
        <CategoryHubRenderer config={CATEGORY_HUBS.accessories} />
        <Footer />
      </div>
    );
  }

  if (isLaptopsHub && CATEGORY_HUBS.laptops) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="laptops" />
        <CategoryHubRenderer config={CATEGORY_HUBS.laptops} />
        <Footer />
      </div>
    );
  }

  if (isSmartphoneHub && CATEGORY_HUBS.smartphones) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header activeCategory="smartphones" />
        <CategoryHubRenderer config={CATEGORY_HUBS.smartphones} />
        <Footer />
      </div>
    );
  }

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(300000);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);

  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    price: true,
    processor: true,
    ram: true,
    storage: false,
    display: false,
    graphics: false,
    battery: false,
    warranty: false,
    rating: false,
  });

  // Modal dialog states
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [emiModalOpen, setEmiModalOpen] = useState(false);

  const addItem = useCartStore(s => s.addItem);

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const next = !prev[id];
      if (next) toast.success('Added to Wishlist! ❤️');
      else toast('Removed from Wishlist', { icon: '💔' });
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (item: any) => {
    addItem({
      product_id: item.id || item.product_id,
      name: item.name,
      brand: item.brand || 'TechVolt',
      price: item.price,
      discount: item.discount || 0,
      images: JSON.stringify([item.image]),
      quantity: 1,
      stock: 10,
    });
    toast.success(`${item.brand} ${item.name} added to cart! 🛒`);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setMaxPriceFilter(300000);
    setSelectedProcessors([]);
    setSelectedRam([]);
    setSelectedStorage([]);
    toast.success('Filters cleared');
  };

  const toggleAccordion = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered lists
  const filteredLaptops = BEST_SELLING_LAPTOPS.filter(laptop => {
    if (selectedBrands.length > 0 && !selectedBrands.some(b => b.toLowerCase() === laptop.brand.toLowerCase())) {
      return false;
    }
    if (laptop.price > maxPriceFilter) {
      return false;
    }
    if (selectedProcessors.length > 0 && !selectedProcessors.includes(laptop.processor)) {
      return false;
    }
    if (selectedRam.length > 0 && !selectedRam.includes(laptop.ram)) {
      return false;
    }
    return true;
  });

  const filteredPhones = TRENDING_SMARTPHONES.filter(phone => {
    if (selectedBrands.length > 0 && !selectedBrands.some(b => b.toLowerCase() === phone.brand.toLowerCase())) {
      return false;
    }
    if (phone.price > maxPriceFilter) {
      return false;
    }
    if (selectedRam.length > 0 && !selectedRam.includes(phone.ram)) {
      return false;
    }
    if (selectedStorage.length > 0 && !selectedStorage.includes(phone.storage)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Clean Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">
            {isLaptopsHub ? 'Laptops' : isSmartphoneHub ? 'Smartphones' : 'Products'}
          </span>
        </div>

        {/* 2-Column Grid Layout: Sidebar on Left, Rich Hub on Right */}
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

            <div className="space-y-5 text-xs text-slate-700">
              {/* Category Checkboxes */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('category')}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                >
                  <span>Category</span>
                  {openSections.category ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.category && (
                  <div className="mt-2.5 space-y-2 pl-0.5">
                    {(isLaptopsHub
                      ? ['Gaming Laptops', 'Business Laptops', 'Student Laptops', 'Creator Laptops', 'Workstations', '2-in-1 Convertibles', 'Chromebooks']
                      : ['5G Smartphones', 'Flagship Phones', 'Mid-Range Phones', 'Budget Phones', 'Gaming Phones']
                    ).map(type => (
                      <label key={type} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={e => {
                            if (e.target.checked) setSelectedTypes([...selectedTypes, type]);
                            else setSelectedTypes(selectedTypes.filter(t => t !== type));
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-[13px]">{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Brand Checkboxes */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('brand')}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                >
                  <span>Brand</span>
                  {openSections.brand ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.brand && (
                  <div className="mt-2.5 space-y-2 pl-0.5">
                    {(isLaptopsHub
                      ? ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Microsoft']
                      : ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO']
                    ).map(brand => (
                      <label key={brand} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={e => {
                            if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                            else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-[13px]">{brand}</span>
                      </label>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBrands(
                          isLaptopsHub
                            ? ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Microsoft']
                            : ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'OPPO', 'Realme', 'Google']
                        )
                      }
                      className="text-blue-600 font-semibold text-[11px] pt-1 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      View More <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Price Range Slider */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('price')}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                >
                  <span>Price Range</span>
                  {openSections.price ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.price && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="range"
                      min="20000"
                      max="300000"
                      step="5000"
                      value={maxPriceFilter}
                      onChange={e => setMaxPriceFilter(Number(e.target.value))}
                      className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>₹20,000</span>
                      <span className="text-blue-600 font-extrabold">₹{maxPriceFilter.toLocaleString('en-IN')}+</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Processor (For Laptops) */}
              {isLaptopsHub && (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('processor')}
                      className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                    >
                      <span>Processor</span>
                      {openSections.processor ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {openSections.processor && (
                      <div className="mt-2.5 space-y-2 pl-0.5">
                        {['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 3', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M1/M2/M3'].map(proc => (
                          <label key={proc} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none">
                            <input
                              type="checkbox"
                              checked={selectedProcessors.includes(proc)}
                              onChange={e => {
                                if (e.target.checked) setSelectedProcessors([...selectedProcessors, proc]);
                                else setSelectedProcessors(selectedProcessors.filter(p => p !== proc));
                              }}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                            />
                            <span className="text-[13px]">{proc}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-slate-100" />
                </>
              )}

              {/* RAM */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('ram')}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                >
                  <span>RAM</span>
                  {openSections.ram ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.ram && (
                  <div className="mt-2.5 space-y-2 pl-0.5">
                    {(isLaptopsHub ? ['8 GB', '16 GB', '32 GB', '64 GB'] : ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB']).map(ram => (
                      <label key={ram} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none">
                        <input
                          type="checkbox"
                          checked={selectedRam.includes(ram)}
                          onChange={e => {
                            if (e.target.checked) setSelectedRam([...selectedRam, ram]);
                            else setSelectedRam(selectedRam.filter(r => r !== ram));
                          }}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-[13px]">{ram}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Storage */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('storage')}
                  className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                >
                  <span>Storage</span>
                  {openSections.storage ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openSections.storage && (
                  <div className="mt-2.5 space-y-2 pl-0.5">
                    {['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'].map(st => (
                      <label key={st} className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 select-none">
                        <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300" />
                        <span className="text-[13px]">{st}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Other Accordions */}
              {isLaptopsHub ? (
                <>
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('display')}
                      className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                    >
                      <span>Display Size</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleAccordion('graphics')}
                      className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer"
                    >
                      <span>Graphics Card</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </>
              ) : (
                ['Display Size', 'Battery Capacity', 'Processor', '5G Support', 'Warranty', 'Customer Rating'].map(label => (
                  <div key={label}>
                    <button type="button" className="w-full flex items-center justify-between font-bold text-slate-900 py-1 cursor-pointer">
                      <span>{label}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* ==================================================
              RIGHT CONTENT AREA: THE CATEGORY HUB
              ================================================== */}
          <div className="lg:col-span-9 space-y-8">
            {isLaptopsHub ? (
              /* ==================================================
                 LAPTOPS CATEGORY HUB
                 ================================================== */
              <>
                {/* 1. HERO SHOWCASE BANNER FOR LAPTOPS */}
                <div className="relative rounded-3xl overflow-hidden bg-[#0A1128] text-white shadow-xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/laptop-hero-banner.jpg"
                      alt="High Performance Laptops Banner"
                      fill
                      className="object-cover object-right opacity-80"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/85 to-transparent w-full md:w-3/5" />
                  </div>

                  <div className="relative z-10 p-6 sm:p-10 max-w-xl">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-400 mb-2">
                      LAPTOPS
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.12]">
                      POWER YOUR WORK.
                      <span className="block text-white mt-1">CREATE WITHOUT LIMITS.</span>
                    </h1>
                    <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                      High-performance laptops for work, study, gaming and creative professionals.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <a
                        href="#bestselling"
                        className="bg-white text-slate-950 font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 shadow-md cursor-pointer"
                      >
                        Shop Laptops <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Right Floating Info Card */}
                  <div className="hidden md:block absolute right-8 top-12 z-10 text-right">
                    <div className="bg-black/35 backdrop-blur-md border border-white/20 p-4 rounded-2xl inline-block text-left text-white max-w-[220px]">
                      <p className="text-sm font-bold text-slate-300">Latest Laptops</p>
                      <p className="text-base font-extrabold mt-0.5">Top Brands</p>
                      <p className="text-xs text-blue-400 font-semibold mt-1">Best Performance</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Banner Bottom Trust Features */}
                  <div className="relative z-10 border-t border-white/10 bg-black/35 backdrop-blur-md px-6 sm:px-10 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span>Genuine Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <span>Brand Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Easy EMI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-400" />
                      <span>Free Delivery</span>
                    </div>
                  </div>
                </div>

                {/* 2. LAPTOP SEGMENTS / USE-CASES */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  {LAPTOP_SEGMENTS.map(seg => (
                    <div
                      key={seg.name}
                      onClick={() => {
                        setSelectedTypes([seg.name]);
                        toast(`Filtered by ${seg.name}`);
                      }}
                      className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="relative w-28 h-20 mb-2 overflow-hidden flex items-center justify-center">
                        <Image
                          src={seg.image}
                          alt={seg.name}
                          width={140}
                          height={100}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {seg.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{seg.subtitle}</p>
                    </div>
                  ))}
                </div>

                {/* 3. SHOP BY BRAND */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Shop by Brand</h3>
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View All Brands <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {LAPTOP_BRANDS.map(brand => {
                      const isSelected = selectedBrands.includes(brand.name);
                      return (
                        <button
                          key={brand.name}
                          onClick={() => {
                            if (isSelected) setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                            else setSelectedBrands([brand.name]);
                          }}
                          className={`h-14 rounded-xl border flex items-center justify-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {brand.logo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. BEST SELLING LAPTOPS */}
                <div id="bestselling" className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Best Selling Laptops</h3>
                    <button
                      onClick={() => clearAllFilters()}
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {filteredLaptops.map(laptop => (
                      <div
                        key={laptop.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-4 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Image & Wishlist Button */}
                          <div className="relative w-full h-48 bg-slate-50 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3">
                            <Image
                              src={laptop.image}
                              alt={laptop.name}
                              width={300}
                              height={300}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => toggleWishlist(laptop.id)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-xs cursor-pointer transition-colors"
                            >
                              <Heart
                                className={`w-4 h-4 ${wishlist[laptop.id] ? 'fill-red-500 text-red-500' : ''}`}
                              />
                            </button>
                          </div>

                          {/* Brand & Name */}
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{laptop.brand}</p>
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {laptop.name}
                          </h4>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{laptop.rating}</span>
                            </div>
                            <span className="text-slate-400">({laptop.reviews})</span>
                          </div>

                          {/* Pricing */}
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-lg font-black text-slate-950">
                              ₹{laptop.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{laptop.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {laptop.discount}% OFF
                            </span>
                          </div>

                          {/* EMI tag */}
                          <p className="text-[11px] text-slate-500 mt-1">
                            EMI from <span className="font-semibold text-slate-700">{laptop.emi}/month</span>
                          </p>

                          {/* Warranty Badge */}
                          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-700 border border-blue-200/60 rounded-md px-2 py-1 text-[11px] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{laptop.warranty}</span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          type="button"
                          onClick={() => handleAddToCart(laptop)}
                          className="mt-4 w-full bg-[#1D63ED] hover:bg-[#1655D1] active:scale-[0.98] text-white font-bold rounded-xl py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. DUAL PROMOTIONAL CARDS FOR LAPTOPS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  {/* Card A: No Cost EMI */}
                  <div className="bg-[#EFF6FF] border border-blue-200/70 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden relative group">
                    <div className="relative z-10 max-w-[280px]">
                      <h4 className="text-lg font-black text-slate-950">No Cost EMI</h4>
                      <p className="text-xs text-slate-600 mt-1">On leading bank credit & debit cards</p>
                      <button
                        onClick={() => setEmiModalOpen(true)}
                        className="mt-4 bg-[#1D63ED] hover:bg-[#1655D1] text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        Know More <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative w-36 h-32 shrink-0">
                      <Image
                        src="/images/promo-emi-laptops.jpg"
                        alt="Laptop EMI"
                        fill
                        className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Card B: Exchange Your Old Laptop */}
                  <div className="bg-[#FFF7ED] border border-amber-200/70 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden relative group">
                    <div className="relative z-10 max-w-[280px]">
                      <h4 className="text-lg font-black text-slate-950">Exchange Your Old Laptop</h4>
                      <p className="text-xs text-slate-600 mt-1">Get up to ₹25,000 off</p>
                      <button
                        onClick={() => setExchangeModalOpen(true)}
                        className="mt-4 bg-[#1D63ED] hover:bg-[#1655D1] text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        Check Value <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative w-36 h-32 shrink-0">
                      <Image
                        src="/images/promo-exchange-laptops.jpg"
                        alt="Exchange Laptop"
                        fill
                        className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : isSmartphoneHub ? (
              /* ==================================================
                 SMARTPHONES CATEGORY HUB (MATCHING SCREENSHOT 1)
                 ================================================== */
              <>
                {/* 1. HERO SHOWCASE BANNER */}
                <div className="relative rounded-3xl overflow-hidden bg-[#070D1E] text-white shadow-xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/images/smartphone-hero-banner.jpg"
                      alt="Flagship Smartphone Banner"
                      fill
                      className="object-cover object-right opacity-85"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#070D1E] via-[#070D1E]/80 to-transparent w-full md:w-3/5" />
                  </div>

                  <div className="relative z-10 p-6 sm:p-10 max-w-xl">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-400 mb-2">
                      SMARTPHONES
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
                      Power Up
                      <span className="block text-white">Your Everyday</span>
                    </h1>
                    <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                      Latest flagship smartphones with advanced cameras, higher performance and genuine warranty.
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                      <a
                        href="#trending"
                        className="bg-white text-slate-950 font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 hover:bg-slate-100 transition-transform active:scale-95 shadow-md cursor-pointer"
                      >
                        Shop Now <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  <div className="hidden md:block absolute right-8 top-12 z-10 text-right">
                    <div className="bg-black/30 backdrop-blur-md border border-white/20 p-4 rounded-2xl inline-block text-left text-white max-w-[220px]">
                      <p className="text-base font-extrabold">iPhone 17 Pro</p>
                      <p className="text-xs text-slate-300 mt-1">A new era of intelligence.</p>
                      <a
                        href="#trending"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                      >
                        Explore Series <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-xs">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-md px-6 sm:px-10 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Genuine Products</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Brand Warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-purple-400" />
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>

                {/* 2. SHOP BY BRAND */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Shop by Brand</h3>
                    <button
                      onClick={() => setSelectedBrands([])}
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View All Brands <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
                    {SMARTPHONE_BRANDS.map(brand => {
                      const isSelected = selectedBrands.includes(brand.name);
                      return (
                        <button
                          key={brand.name}
                          onClick={() => {
                            if (isSelected) setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                            else setSelectedBrands([brand.name]);
                          }}
                          className={`h-14 rounded-xl border flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {brand.logo}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. TRENDING SMARTPHONES */}
                <div id="trending" className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Trending Smartphones</h3>
                    <button
                      onClick={() => clearAllFilters()}
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                    {filteredPhones.map(phone => (
                      <div
                        key={phone.id}
                        className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-4 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative w-full h-52 bg-slate-50 rounded-xl overflow-hidden mb-3.5 flex items-center justify-center p-3">
                            <Image
                              src={phone.image}
                              alt={phone.name}
                              width={300}
                              height={300}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => toggleWishlist(phone.id)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-xs cursor-pointer transition-colors"
                            >
                              <Heart
                                className={`w-4 h-4 ${wishlist[phone.id] ? 'fill-red-500 text-red-500' : ''}`}
                              />
                            </button>
                          </div>

                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{phone.brand}</p>
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {phone.name}
                          </h4>

                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{phone.rating}</span>
                            </div>
                            <span className="text-slate-400">({phone.reviews})</span>
                          </div>

                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-lg font-black text-slate-950">
                              ₹{phone.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{phone.originalPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {phone.discount}% OFF
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 mt-1">
                            EMI from <span className="font-semibold text-slate-700">{phone.emi}/month</span>
                          </p>

                          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-blue-50/80 text-blue-700 border border-blue-200/60 rounded-md px-2 py-1 text-[11px] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                            <span>{phone.warranty}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(phone)}
                          className="mt-4 w-full bg-[#1D63ED] hover:bg-[#1655D1] active:scale-[0.98] text-white font-bold rounded-xl py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. DUAL PROMOTIONAL CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="bg-[#F0F6FF] border border-blue-200/70 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden relative group">
                    <div className="relative z-10 max-w-[280px]">
                      <h4 className="text-lg font-black text-slate-950">Exchange Your Old Phone</h4>
                      <p className="text-xs text-slate-600 mt-1">Get up to ₹20,000 off on your new smartphone</p>
                      <button
                        onClick={() => setExchangeModalOpen(true)}
                        className="mt-4 bg-[#1D63ED] hover:bg-[#1655D1] text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        Exchange Now <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative w-32 h-32 shrink-0">
                      <Image
                        src="/images/promo-exchange.jpg"
                        alt="Exchange Phone"
                        fill
                        className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>

                  <div className="bg-[#FFF7ED] border border-amber-200/70 rounded-2xl p-6 flex items-center justify-between gap-4 overflow-hidden relative group">
                    <div className="relative z-10 max-w-[280px]">
                      <h4 className="text-lg font-black text-slate-950">No Cost EMI</h4>
                      <p className="text-xs text-slate-600 mt-1">On leading credit & debit cards</p>
                      <button
                        onClick={() => setEmiModalOpen(true)}
                        className="mt-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        Know More <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="relative w-32 h-32 shrink-0">
                      <Image
                        src="/images/promo-emi.jpg"
                        alt="No Cost EMI"
                        fill
                        className="object-contain rounded-xl group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. ACCESSORIES FOR YOUR PHONE */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900">Accessories for Your Phone</h3>
                    <Link
                      href="/products?category=computer-accessories"
                      className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                    {PHONE_ACCESSORIES.map(acc => (
                      <div
                        key={acc.id}
                        className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative w-full h-32 bg-slate-50 rounded-lg overflow-hidden mb-2.5 p-2 flex items-center justify-center">
                            <Image
                              src={acc.image}
                              alt={acc.name}
                              width={200}
                              height={200}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <button
                              type="button"
                              onClick={() => toggleWishlist(acc.id)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 shadow-2xs cursor-pointer"
                            >
                              <Heart
                                className={`w-3 h-3 ${wishlist[acc.id] ? 'fill-red-500 text-red-500' : ''}`}
                              />
                            </button>
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {acc.name}
                          </h5>

                          <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            <span>{acc.rating} ({acc.reviews})</span>
                          </div>

                          <p className="mt-1.5 text-xs font-black text-slate-950">
                            ₹{acc.price.toLocaleString('en-IN')}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(acc)}
                          className="mt-3 w-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 font-bold rounded-lg py-1.5 text-[11px] transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Fallback Generic Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <ProductCard key={p.product_id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Exchange Valuation Modal */}
      {exchangeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setExchangeModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                {isLaptopsHub ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {isLaptopsHub ? 'Exchange Your Old Laptop' : 'Exchange Your Old Phone'}
                </h4>
                <p className="text-xs text-slate-500">Instant evaluation & doorstep pickup</p>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Your Current Brand</label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 bg-slate-50">
                  {isLaptopsHub ? (
                    <>
                      <option>Apple MacBook</option>
                      <option>Dell</option>
                      <option>HP</option>
                      <option>Lenovo</option>
                      <option>ASUS</option>
                    </>
                  ) : (
                    <>
                      <option>Apple iPhone</option>
                      <option>Samsung Galaxy</option>
                      <option>OnePlus</option>
                      <option>Xiaomi / Redmi</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Device Condition</label>
                <select className="w-full border border-slate-200 rounded-xl p-2.5 text-slate-800 bg-slate-50">
                  <option>Flawless (No scratches, all working)</option>
                  <option>Good (Minor micro-scratches)</option>
                  <option>Fair (Body scuffs, screen intact)</option>
                </select>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-blue-900">
                <p className="text-xs font-bold">Estimated Exchange Value:</p>
                <p className="text-xl font-black text-blue-700 mt-0.5">
                  {isLaptopsHub ? '₹18,500 – ₹25,000' : '₹14,500 – ₹19,800'}
                </p>
                <p className="text-[11px] text-blue-600 mt-1">Applied instantly at checkout on your new device.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setExchangeModalOpen(false);
                toast.success('Exchange discount coupon APPLIED25K applied to cart!');
              }}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
            >
              Apply Exchange Discount
            </button>
          </div>
        </div>
      )}

      {/* EMI Calculator Modal */}
      {emiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setEmiModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                %
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">No Cost EMI Plans</h4>
                <p className="text-xs text-slate-500">0% Interest on HDFC, ICICI, SBI & Axis</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { duration: '3 Months', monthly: '₹26,663/mo', total: '₹79,990', interest: '₹0 No Cost' },
                { duration: '6 Months', monthly: '₹13,331/mo', total: '₹79,990', interest: '₹0 No Cost' },
                { duration: '9 Months', monthly: '₹8,887/mo', total: '₹79,990', interest: '₹0 No Cost' },
                { duration: '12 Months', monthly: '₹6,665/mo', total: '₹79,990', interest: 'Standard' },
              ].map(plan => (
                <div key={plan.duration} className="border border-slate-200 rounded-xl p-3 flex items-center justify-between hover:border-blue-500 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900">{plan.duration} No Cost EMI</p>
                    <p className="text-[11px] text-slate-500">{plan.monthly}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                    {plan.interest}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEmiModalOpen(false)}
              className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
