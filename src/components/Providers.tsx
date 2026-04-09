'use client';

import { useEffect, useState } from 'react';
import { seedDatabase } from '@/lib/seed';

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    seedDatabase().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <div className="loading-state">Initializing Sofort...</div>;
  }

  return <>{children}</>;
}
