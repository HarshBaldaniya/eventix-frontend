'use client';

import Link from 'next/link';
import type { Event } from '@/types/api';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { EventStatusBadge } from '@/components/event-status-badge';
import { AvailabilitySlots } from '@/components/availability-slots';
import { CalendarIcon, ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const EVENT_CARD_HEIGHT = 360;

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getEventColor(id: number): string {
  const colors = [
    'from-violet-500/30 via-indigo-500/20 to-purple-500/30',
    'from-emerald-500/30 via-teal-500/20 to-cyan-500/30',
    'from-amber-500/30 via-orange-500/20 to-yellow-500/30',
    'from-rose-500/30 via-pink-500/20 to-fuchsia-500/30',
    'from-blue-500/30 via-sky-500/20 to-cyan-500/30',
  ];
  return colors[id % colors.length];
}

function getHoverGlow(id: number): string {
  const glows = [
    'hover:shadow-violet-500/8',
    'hover:shadow-emerald-500/8',
    'hover:shadow-amber-500/8',
    'hover:shadow-rose-500/8',
    'hover:shadow-blue-500/8',
  ];
  return glows[id % glows.length];
}

export function EventCard({ event, compact, index = 0, className, variant }: { event: Event; compact?: boolean; index?: number; className?: string; variant?: 'default' | 'comingSoon' }) {
  const bookable = event.status === 'published' && event.remaining_spots > 0;

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'block group cursor-pointer w-full',
        event.status === 'draft' && 'pointer-events-none opacity-75',
        className
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card
        className={cn(
          'overflow-hidden rounded-2xl border border-border/50 ring-0 bg-card/95 backdrop-blur-sm shadow-sm transition-all duration-300 ease-out h-full flex flex-col',
          variant === 'comingSoon'
            ? 'hover:shadow-lg hover:shadow-primary/5 hover:border-border/80'
            : cn(
              'hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary/25 hover:scale-[1.01]',
              getHoverGlow(event.id)
            ),
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          compact && 'h-[360px] flex flex-col',
          'animate-fade-in-up opacity-0'
        )}
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
        {/* Decorative header strip */}
        <div
          className={cn(
            'h-2 w-full shrink-0 bg-gradient-to-r transition-all duration-300 group-hover:h-2.5',
            getEventColor(event.id)
          )}
        />

        <CardHeader className="pb-3 pt-5 px-5 sm:px-6 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <EventStatusBadge status={event.status} size="sm" />
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-snug text-base group-hover:text-primary transition-colors duration-200">
            {event.name}
          </h3>
        </CardHeader>

        <CardContent className={cn('flex-1 flex flex-col gap-3 px-5 sm:px-6 min-h-0 overflow-hidden', compact && 'pb-2')}>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 truncate shrink-0">
              {event.description}
            </p>
          )}
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground flex-1 min-h-0">
            {event.event_start_at && (
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-xs font-medium">{formatDate(event.event_start_at)}</span>
              </div>
            )}
            <div className="rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5 shrink-0">
              <AvailabilitySlots
                remaining={event.remaining_spots}
                capacity={event.capacity}
                size="sm"
                showLabel={true}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto pt-4 border-t border-border/40 bg-muted/10 px-5 py-4 sm:px-6 shrink-0">
          <span
            className={cn(
              'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 border',
              bookable
                ? 'bg-primary text-primary-foreground border-primary/80 shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 group-hover:scale-[1.02]'
                : 'bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted/70'
            )}
          >
            View details
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
