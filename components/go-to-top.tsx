'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className={cn(
        'fixed bottom-6 right-6 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-background/95 shadow-lg backdrop-blur-sm transition-all duration-300',
        'hover:scale-110 hover:border-primary/30 hover:bg-primary/10 hover:shadow-xl',
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'
      )}
    >
      <ChevronUp className="h-5 w-5 text-foreground" />
    </button>
  );
}
