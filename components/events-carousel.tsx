'use client';

import { useRef, useState, useEffect } from 'react';
import type { Event } from '@/types/api';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventsCarouselProps {
  events: Event[];
  baseIndex?: number;
}

export function EventsCarousel({ events, baseIndex = 0 }: EventsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const t = setTimeout(checkScroll, 100);
    return () => clearTimeout(t);
  }, [events]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    el.scrollBy({ left: dir === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="relative group/carousel">
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-2 px-6 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className="flex-shrink-0 w-[300px] sm:w-[320px] h-[360px] snap-center p-[1px]"
          >
            <EventCard event={event} compact index={baseIndex + index} className="h-full" variant="comingSoon" />
          </div>
        ))}
      </div>
      {events.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 h-10 w-10 rounded-full shadow-lg border-border/60',
              'opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200',
              'hover:scale-110 cursor-pointer active:scale-95',
              !canScrollLeft && 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 h-10 w-10 rounded-full shadow-lg border-border/60',
              'opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 transition-opacity duration-200',
              'hover:scale-110 cursor-pointer active:scale-95',
              !canScrollRight && 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
}
