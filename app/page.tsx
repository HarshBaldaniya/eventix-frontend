'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import { EventCard } from '@/components/event-card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, CheckCircle2, Clock, TicketX } from 'lucide-react';
import { EventsCarousel } from '@/components/events-carousel';
import { LazyEventCard } from '@/components/lazy-event-card';
import { useAuth } from '@/contexts/auth-context';

function groupEvents(events: Event[]) {
  const open: Event[] = [];
  const comingSoon: Event[] = [];
  const soldOut: Event[] = [];
  for (const e of events) {
    if (e.status === 'coming_soon') comingSoon.push(e);
    else if (e.status === 'published' && e.remaining_spots > 0) open.push(e);
    else if (e.status === 'published' && e.remaining_spots <= 0) soldOut.push(e);
  }
  return { open, comingSoon, soldOut };
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api<Event[]>('/api/v1/events?limit=24&sort_by=created_at&order=desc', {
        skipAuth: true,
      });
      if ('data' in res && res.success && Array.isArray(res.data)) {
        setEvents(res.data as Event[]);
      }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const { open, comingSoon, soldOut } = groupEvents(events);
  const hasAny = open.length > 0 || comingSoon.length > 0 || soldOut.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/30 py-24 px-4 md:py-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Discover & Book Events
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Find the best events near you. Browse, book, and enjoy — no login required to explore.
          </p>
          <Link
            href="/events"
            className="mt-10 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
          >
            <CalendarDays className="h-5 w-5" />
            Browse Events
          </Link>
        </div>
      </section>

      {/* Event sections by status */}
      <section className="container mx-auto max-w-6xl py-16 px-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-14">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[320px] rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        ) : hasAny ? (
          <div className="space-y-14">
            {/* Coming Soon - First */}
            {comingSoon.length > 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                      Coming Soon
                    </h2>
                    <p className="text-sm text-muted-foreground">Stay tuned for these events</p>
                  </div>
                </div>
                <EventsCarousel events={comingSoon} baseIndex={0} />
              </div>
            )}

            {/* Open for Booking - 3x3 grid */}
            {open.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                      Open for Booking
                    </h2>
                    <p className="text-sm text-muted-foreground">Book your spot now</p>
                  </div>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {open.slice(0, 9).map((event, index) => (
                    <LazyEventCard key={event.id} event={event} index={index} compact />
                  ))}
                </div>
              </div>
            )}

            {/* Sold Out */}
            {soldOut.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <TicketX className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground md:text-2xl">
                      Sold Out
                    </h2>
                    <p className="text-sm text-muted-foreground">These events are fully booked</p>
                  </div>
                </div>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {soldOut.map((event, index) => (
                    <LazyEventCard
                      key={event.id}
                      event={event}
                      index={open.length + comingSoon.length + index}
                      compact
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
            <p className="text-lg font-medium text-foreground">No events yet.</p>
            <p className="mt-2 text-muted-foreground">Check back soon for upcoming events.</p>
          </div>
        )}

      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-muted/20 py-10">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
            <Link href="/" className="font-semibold text-foreground hover:text-primary transition-colors">
              Eventix
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            <Link href="/events" className="hover:text-foreground transition-colors">
              Events
            </Link>
            <a href="https://www.linkedin.com/in/hb134/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              LinkedIn
            </a>
            <a href="https://harshbaldaniya.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Portfolio
            </a>
            {!isAuthenticated && (
              <Link href="/login" className="hover:text-foreground transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
