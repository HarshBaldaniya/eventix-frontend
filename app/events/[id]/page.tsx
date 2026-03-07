'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import type { Event } from '@/types/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { EventStatusBadge } from '@/components/event-status-badge';
import { AvailabilitySlots } from '@/components/availability-slots';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Users, Clock, Ticket, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getEventGradient(id: number): string {
  const gradients = [
    'from-violet-500/15 via-primary/10 to-indigo-500/15',
    'from-emerald-500/15 via-primary/10 to-teal-500/15',
    'from-amber-500/15 via-primary/10 to-orange-500/15',
    'from-rose-500/15 via-primary/10 to-pink-500/15',
    'from-blue-500/15 via-primary/10 to-cyan-500/15',
  ];
  return gradients[id % gradients.length];
}

function canBook(event: Event): boolean {
  if (event.status !== 'published') return false;
  if (event.remaining_spots <= 0) return false;
  const now = new Date();
  if (event.booking_opens_at && new Date(event.booking_opens_at) > now) return false;
  if (event.booking_closes_at && new Date(event.booking_closes_at) < now) return false;
  return true;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      const res = await api<Event>(`/api/v1/events/${id}`, { skipAuth: true });
      if ('error' in res && res.error) {
        setError(res.error.message || 'Event not found');
        setEvent(null);
      } else if ('data' in res && res.success && res.data && !Array.isArray(res.data)) {
        setEvent(res.data);
      } else {
        setError('Event not found');
      }
      setIsLoading(false);
    };
    fetchEvent();
  }, [id]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/events/${id}/book`)}`);
    } else {
      router.push(`/events/${id}/book`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <Skeleton className="h-9 w-32 mb-8 animate-pulse" />
        <Skeleton className="h-[320px] w-full rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="animate-scale-in rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-medium text-destructive">{error || 'Event not found'}</p>
          <Link href="/events" className={buttonVariants({ variant: 'outline' }) + ' mt-6 inline-flex'}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const bookable = canBook(event);

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <Link
        href="/events"
        className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' mb-8 -ml-2 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="animate-fade-in-up">
        {/* Hero card */}
        <Card className="overflow-hidden rounded-2xl border border-border/60 shadow-xl">
          <div className={cn('h-2 w-full bg-gradient-to-r', getEventGradient(event.id))} />
          <CardContent className="p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <EventStatusBadge status={event.status} />
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {event.name}
                </h1>
                {event.description && (
                  <p className="max-w-2xl text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                )}
              </div>
              {bookable && (
                <Button
                  size="lg"
                  onClick={handleBookClick}
                  className="shrink-0 gap-2 cursor-pointer shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                >
                  <Ticket className="h-5 w-5" />
                  Book Now
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Button>
              )}
            </div>

            {/* Info grid */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {event.event_start_at && (
                <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/30 p-5 transition-colors hover:bg-muted/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Event Date</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatDate(event.event_start_at)}
                      {event.event_end_at && (
                        <span className="block mt-1">Until {formatDate(event.event_end_at)}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-border/60 bg-muted/30 p-5 transition-colors hover:bg-muted/50">
                <AvailabilitySlots
                  remaining={event.remaining_spots}
                  capacity={event.capacity}
                  size="lg"
                  showLabel={true}
                />
              </div>
            </div>

            {(event.booking_opens_at || event.booking_closes_at) && (
              <div className="mt-6 flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 p-5">
                <Clock className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Booking Window</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {event.booking_opens_at && <p>Opens: {formatDate(event.booking_opens_at)}</p>}
                    {event.booking_closes_at && <p>Closes: {formatDate(event.booking_closes_at)}</p>}
                  </div>
                </div>
              </div>
            )}

            {!bookable && event.status === 'published' && event.remaining_spots > 0 && (
              <p className="mt-6 text-sm text-muted-foreground">
                Booking is currently closed for this event. Check the booking window above.
              </p>
            )}

            {event.status === 'coming_soon' && (
              <p className="mt-6 text-sm text-muted-foreground">
                This event will open for booking soon. Stay tuned!
              </p>
            )}

            {!bookable && (
              <div className="mt-8">
                <Link
                  href="/events"
                  className={buttonVariants({ variant: 'outline' }) + ' inline-flex'}
                >
                  Browse Other Events
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
