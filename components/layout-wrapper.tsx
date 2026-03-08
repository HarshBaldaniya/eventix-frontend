'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { GoToTop } from '@/components/go-to-top';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <GoToTop />
    </div>
  );
}
