import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryHubRenderer from '@/components/CategoryHubRenderer';
import { CATEGORY_HUBS } from '@/data/categoryHubData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audio & ANC - Headphones, TWS Earbuds & Speakers | TechVolt',
  description: 'Immersive sound and active noise cancellation. Browse industry-leading over-ear headphones, earbuds and portable sound systems.',
};

export default function AudioPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header activeCategory="headphones" />
      <CategoryHubRenderer config={CATEGORY_HUBS.audio} />
      <Footer />
    </div>
  );
}
