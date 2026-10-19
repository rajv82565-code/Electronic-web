import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tablets - Apple iPad, Samsung Galaxy Tab & Android Tablets | TechVolt',
  description: 'Explore the latest tablets with big screens, stylus pens, and high performance for productivity, study and digital art.',
};

export default function TabletsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="tablets" />
      <CategoryHubRenderer config={CATEGORY_HUBS.tablets} />
      <Footer />
    </div>
  );
}
