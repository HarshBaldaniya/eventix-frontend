'use client';

import { useEffect, useRef, useState } from 'react';
import type { Event } from '@/types/api';
import { EventCard } from '@/components/event-card';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyEventCardProps {
  event: Event;
  index: number;
  compact?: boolean;
}

export function LazyEventCard({ event, index, compact = true }: LazyEventCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full min-h-[360px]">
      {isVisible ? (
        <EventCard event={event} compact={compact} index={index} className="w-full" />
      ) : (
        <Skeleton className="h-[360px] w-full rounded-2xl" />
      )}
    </div>
  );
}
