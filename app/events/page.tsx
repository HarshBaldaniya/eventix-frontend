'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import type { Pagination } from '@/lib/api';
import { LazyEventCard } from '@/components/lazy-event-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

function EventsPageContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '12');
    params.set('sort_by', 'created_at');
    params.set('order', 'desc');
    const res = await api<Event[]>(`/api/v1/events?${params.toString()}`, { skipAuth: true });
    if ('data' in res && res.success && Array.isArray(res.data)) {
      setEvents(res.data as Event[]);
      if ('pagination' in res && res.pagination) {
        setPagination(res.pagination);
      }
    } else {
      setEvents([]);
      setPagination(null);
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* Elite Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-slow opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] animate-pulse-slow opacity-30" style={{ animationDelay: '4s' }} />
      </div>
      <div className="absolute inset-0 z-0 bg-grid-black opacity-[0.03] dark:bg-grid-white dark:opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      <div className="container relative z-10 mx-auto max-w-6xl py-12 px-4 sm:px-6">
        <div className="mb-16 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] uppercase text-primary">
            Curated Collection
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground md:text-7xl lg:text-8xl italic">
            All <span className="text-gradient not-italic pr-4">Experiences</span>
          </h1>
          <p className="max-w-xl text-lg font-medium text-muted-foreground/80 leading-relaxed md:text-xl transform transition-all">
            Secure your spot at the most exclusive gatherings. From underground circuits to global summits.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-[40px] bg-muted/20" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <div key={event.id} className="animate-mask-reveal py-4" style={{ animationDelay: `${(index % 6) * 0.1}s` }}>
                  <div className="hover-glow p-1 rounded-[40px] bg-gradient-to-br from-transparent via-transparent to-primary/5 transition-transform duration-500">
                    <LazyEventCard event={event} index={index} compact />
                  </div>
                </div>
              ))}
            </div>

            {pagination && (pagination.has_next || pagination.has_prev) && (
              <div className="mt-20 flex items-center justify-center gap-6 animate-fade-in-up">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.has_prev}
                  className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-md px-8 font-bold hover:bg-muted transition-all active:scale-95"
                >
                  <ChevronLeftIcon className="mr-2 h-5 w-5" />
                  Previous
                </Button>
                <div className="flex h-12 items-center rounded-2xl bg-muted/30 px-6 text-sm font-black tracking-widest uppercase text-muted-foreground/60 border border-border/40">
                  {pagination.page} / {pagination.total_pages}
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.has_next}
                  className="rounded-2xl border-border/60 bg-background/50 backdrop-blur-md px-8 font-bold hover:bg-muted transition-all active:scale-95"
                >
                  Next
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[64px] border-2 border-dashed border-border/50 bg-muted/10 py-40 text-center animate-fade-in-up">
            <p className="text-2xl font-black text-foreground tracking-tighter">No Events Found</p>
            <p className="mt-4 text-muted-foreground font-semibold max-w-sm mx-auto">Check back soon for upcoming drops.</p>
            <Link
              href="/"
              className="mt-10 inline-flex h-14 items-center justify-center rounded-2xl bg-foreground text-background px-10 text-base font-black transition-all hover:scale-105 shadow-xl"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-20 px-4 max-w-6xl">
        <div className="mb-16 space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-20 w-96 rounded-2xl" />
          <Skeleton className="h-10 w-full max-w-xl rounded-xl" />
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[400px] rounded-[40px] bg-muted/20" />
          ))}
        </div>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  );
}
