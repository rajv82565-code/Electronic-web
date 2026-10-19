import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laptops - High Performance Notebooks & Workstations | TechVolt',
  description: 'Shop top brand laptops for gaming, business, creative work and study with genuine warranty and fast delivery.',
};

export default function LaptopsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="laptops" />
      <CategoryHubRenderer config={CATEGORY_HUBS.laptops} />
      <Footer />
    </div>
  );
}
