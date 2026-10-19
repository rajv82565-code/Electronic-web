import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wearables - Smartwatches, Fitness Bands & Smart Rings | TechVolt',
  description: 'Track your health and stay connected with top wearable smartwatches, fitness trackers, and smart rings.',
};

export default function WearablesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="smart-watches" />
      <CategoryHubRenderer config={CATEGORY_HUBS.wearables} />
      <Footer />
    </div>
  );
}
