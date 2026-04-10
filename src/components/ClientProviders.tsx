'use client';
import { Providers } from '@/components/Providers';
import { Analytics } from '@vercel/analytics/react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>{children}</Providers>
      <Analytics />
    </>
  );
}
