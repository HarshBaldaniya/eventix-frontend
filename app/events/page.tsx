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
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Events
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse and book your next experience
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-xl" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <LazyEventCard key={event.id} event={event} index={index} compact />
            ))}
          </div>

          {pagination && (pagination.has_next || pagination.has_prev) && (
            <div className="mt-14 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.has_prev}
                className="gap-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.has_next}
                className="gap-1"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <p className="text-lg font-medium text-foreground">No events found</p>
          <p className="mt-2 text-muted-foreground">Check back soon for upcoming events.</p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium hover:bg-muted/50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64 mt-2" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[280px] rounded-lg" />
          ))}
        </div>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  );
}
