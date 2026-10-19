import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '@/components/AuthInitializer';
import ChatWidget from '@/components/ChatWidget';
import MobileBottomNav from '@/components/MobileBottomNav';
import LiveSalesTicker from '@/components/LiveSalesTicker';

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'ElectroVolt - Premium Electronics & Authorized Service Hub',
  description:
    'Shop smartphones, laptops, audio, and gadgets with guaranteed manufacturer warranty, fast doorstep delivery, and certified repair support.',
  keywords:
    'electronics, smartphones, laptops, audio, wearables, warranty tracking, repair hub, doorstep tech repair',
  openGraph: {
    title: 'ElectroVolt - Modern Electronics & Warranty Hub',
    description: 'Clean retail tech platform with auto-registered warranty & doorstep repair service.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#F8FAFC] text-[#1E293B] min-h-screen antialiased flex flex-col pb-16 md:pb-0">
        <AuthInitializer />
        <div className="flex-1 flex flex-col">{children}</div>
        <ChatWidget />
        <LiveSalesTicker />
        <MobileBottomNav />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#FFFFFF',
              color: '#1E293B',
              border: '1px solid #E2E8F0',
              borderRadius: '0.625rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#0EA5A0', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />
      </body>
    </html>
  );
}
