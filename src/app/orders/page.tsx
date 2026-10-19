'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard?tab=orders');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
