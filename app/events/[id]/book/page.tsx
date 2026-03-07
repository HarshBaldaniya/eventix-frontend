'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import type { Event } from '@/types/api';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, Minus, Plus, Ticket, Calendar, Sparkles } from 'lucide-react';
import { AvailabilitySlots } from '@/components/availability-slots';
import { cn } from '@/lib/utils';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BookEventPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  const bookingLimit = event?.max_tickets_per_booking || 6;
  const maxTickets = event
    ? Math.min(event.remaining_spots, bookingLimit)
    : 1;

  useEffect(() => {
    if (event && ticketCount > maxTickets) {
      setTicketCount(maxTickets);
    }
  }, [event, maxTickets, ticketCount]);

  const doBooking = async () => {
    if (!event || !id || isSubmitting) return;
    if (ticketCount < 1 || ticketCount > maxTickets) return;

    setIsSubmitting(true);
    setBookingError(null);
    setShowConfirmDialog(false);

    const res = await api<{ id: number; ticket_count: number; status: string }>(
      `/api/v1/events/${id}/bookings`,
      {
        method: 'POST',
        body: JSON.stringify({ ticket_count: ticketCount }),
      }
    );

    setIsSubmitting(false);

    if ('error' in res && res.error) {
      setBookingError(res.error.message);
      toast.error(res.error.message);
      return;
    }

    if ('data' in res && res.success) {
      toast.success(`Successfully booked ${ticketCount} ticket${ticketCount > 1 ? 's' : ''}!`);
      router.push('/bookings?booked=1');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || isSubmitting || ticketCount < 1 || ticketCount > maxTickets) return;
    setShowConfirmDialog(true);
  };

  const content = (
    <div className="container mx-auto max-w-xl py-10 px-4">
      <Link
        href={`/events/${id}`}
        className={buttonVariants({ variant: 'ghost', size: 'sm' }) + ' mb-8 -ml-2 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Event
      </Link>

      {isLoading ? (
        <Skeleton className="h-[420px] w-full rounded-2xl animate-pulse" />
      ) : !event ? (
        <div className="animate-scale-in rounded-2xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-medium text-destructive">{error || 'Event not found'}</p>
          <Link href="/events" className={buttonVariants({ variant: 'outline' }) + ' mt-6 inline-flex'}>
            Back to Events
          </Link>
        </div>
      ) : (
        <Card className="overflow-hidden rounded-2xl border border-border/50 shadow-xl ring-1 ring-foreground/5 animate-fade-in-up">
          <div className="h-2 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          <CardHeader className="px-6 sm:px-8 pt-6 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Book Tickets</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{event.name}</p>
              </div>
            </div>
            {event.event_start_at && (
              <div className="mt-4 flex items-center gap-2.5 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="font-medium">{formatDate(event.event_start_at)}</span>
              </div>
            )}
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-6 sm:px-8 pb-6">
              {bookingError && (
                <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-scale-in">
                  {bookingError}
                </div>
              )}

              {/* Ticket selector */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-4">Number of tickets</label>
                <div className="flex items-center justify-center gap-5 rounded-xl border border-border/50 bg-muted/10 px-6 py-5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 cursor-pointer rounded-full border-border/60 transition-all hover:scale-110 hover:bg-primary/10 hover:border-primary/40 active:scale-95"
                    onClick={() => setTicketCount((c) => Math.max(1, c - 1))}
                    disabled={ticketCount <= 1 || isSubmitting}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[3.5rem] text-center text-3xl font-bold tabular-nums text-foreground">
                    {ticketCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 cursor-pointer rounded-full border-border/60 transition-all hover:scale-110 hover:bg-primary/10 hover:border-primary/40 active:scale-95"
                    onClick={() => setTicketCount((c) => Math.min(maxTickets, c + 1))}
                    disabled={ticketCount >= maxTickets || isSubmitting}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Max {bookingLimit} tickets per booking
                </p>
              </div>

              {/* Availability */}
              <div className="rounded-xl border border-border/40 bg-muted/15 px-4 py-3.5">
                <AvailabilitySlots
                  remaining={event.remaining_spots}
                  capacity={event.capacity}
                  size="default"
                  showLabel={true}
                />
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-border/40 bg-muted/15 p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5 text-primary" />
                  Summary
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-4">{event.name}</span>
                  <span className="font-bold text-foreground tabular-nums shrink-0">× {ticketCount}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 px-6 sm:px-8 py-5 border-t border-border/40 bg-muted/5">
              <Button
                type="submit"
                disabled={isSubmitting || ticketCount < 1 || ticketCount > maxTickets}
                className="flex-1 cursor-pointer gap-2 rounded-xl h-11 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse-soft" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Ticket className="h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
              <Link
                href={`/events/${id}`}
                className={buttonVariants({ variant: 'outline' }) + ' inline-flex rounded-xl h-11 px-6 font-semibold'}
                tabIndex={isSubmitting ? -1 : 0}
              >
                Cancel
              </Link>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Confirmation dialog */}
      {event && (
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent showCloseButton={true} className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>Confirm Booking</DialogTitle>
                </div>
              </div>
              <DialogDescription className="mt-2">
                Are you sure you want to book {ticketCount} ticket{ticketCount > 1 ? 's' : ''} for{' '}
                <span className="font-medium text-foreground">{event.name}</span>?
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tickets</span>
                <span className="font-semibold text-foreground">{ticketCount}</span>
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={doBooking}
                disabled={isSubmitting}
                className="cursor-pointer gap-2 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Ticket className="h-4 w-4" />
                    Confirm
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  return <ProtectedRoute>{content}</ProtectedRoute>;
}
