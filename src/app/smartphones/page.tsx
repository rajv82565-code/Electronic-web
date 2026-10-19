import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smartphones - Flagship 5G Mobiles & Deals | TechVolt',
  description: 'Explore the latest 5G smartphones from Apple, Samsung, OnePlus, Xiaomi and Google with official brand warranty.',
};

export default function SmartphonesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="smartphones" />
      <CategoryHubRenderer config={CATEGORY_HUBS.smartphones} />
      <Footer />
    </div>
  );
}
