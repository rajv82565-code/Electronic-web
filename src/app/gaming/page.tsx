import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gaming - Laptops, Consoles, Monitors & Peripherals | TechVolt',
  description: 'Level up your battle station with high refresh rate gaming monitors, RGB mechanical keyboards, headsets and consoles.',
};

export default function GamingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="gaming-devices" />
      <CategoryHubRenderer config={CATEGORY_HUBS.gaming} />
      <Footer />
    </div>
  );
}
