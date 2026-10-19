import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Home - Automation, Speakers, Lighting & Security | TechVolt',
  description: 'Make your home smarter with Alexa, Google Nest, smart lighting, security cameras, smart plugs, and home automation.',
};

export default function SmartHomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="smart-home" />
      <CategoryHubRenderer config={CATEGORY_HUBS['smart-home']} />
      <Footer />
    </div>
  );
}
