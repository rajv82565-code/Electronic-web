import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessories - Chargers, Cables, Cases & Storage | TechVolt',
  description: 'Complete your tech setup with GaN chargers, durable braided cables, protective cases, and high-speed portable SSDs.',
};

export default function AccessoriesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="computer-accessories" />
      <CategoryHubRenderer config={CATEGORY_HUBS.accessories} />
      <Footer />
    </div>
  );
}
