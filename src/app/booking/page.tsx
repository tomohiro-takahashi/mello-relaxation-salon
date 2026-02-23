'use client';

import { useSearchParams } from 'next/navigation';
import { BookingForm } from '@/components/booking/BookingForm';

import { Suspense } from 'react';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const therapistId = searchParams.get('therapistId') || 'unknown';

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-light tracking-widest">Reserve</h1>
        <p className="text-slate-400 font-sans">
          あなただけの贅沢な時間を、ここから。
        </p>
      </div>
      
      <BookingForm therapistId={therapistId} />
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-slate-100 font-serif pt-24 pb-12 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <BookingPageContent />
      </Suspense>
    </div>
  );
}
