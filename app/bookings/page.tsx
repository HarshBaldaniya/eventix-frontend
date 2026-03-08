'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useBookings, useEvent } from '@/lib/api-cache';
import { ProtectedRoute } from '@/components/protected-route';
import type { Booking, Event } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FullPageLoader } from '@/components/ui/full-page-loader';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  CalendarIcon,
  TicketIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function BookingRow({
  booking,
  index,
  cancellingId,
  onCancelClick,
}: {
  booking: Booking;
  index: number;
  cancellingId: number | null;
  onCancelClick: (id: number) => void;
}) {
  const { event } = useEvent(booking.event_id);
  return (
    <Card
      className="overflow-hidden rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
    >
      <div
        className={`h-2 w-full bg-gradient-to-r ${['from-violet-500/20 to-indigo-500/20', 'from-emerald-500/20 to-teal-500/20', 'from-amber-500/20 to-orange-500/20', 'from-rose-500/20 to-pink-500/20'][booking.id % 4]}`}
      />
      <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-foreground leading-snug">
              {event ? (
                <Link href={`/events/${booking.event_id}`} className="hover:text-primary transition-colors">
                  {event.name}
                </Link>
              ) : (
                `Event #${booking.event_id}`
              )}
            </h2>
            <div className="mt-2.5">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-semibold tracking-wide rounded-full px-2.5 py-1 ${
                  booking.status === 'confirmed'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {booking.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
              </span>
            </div>
          </div>
          {booking.status === 'confirmed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancelClick(booking.id)}
              disabled={cancellingId === booking.id}
              className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 shrink-0 rounded-xl"
            >
              {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-5 sm:px-6 pb-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <TicketIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">{booking.ticket_count} ticket{booking.ticket_count > 1 ? 's' : ''}</span>
          </div>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span>{formatDate(booking.created_at)}</span>
          </div>
        </div>
      </CardContent>
      {booking.status === 'confirmed' && event && (
        <CardFooter className="border-t border-border/40 bg-muted/10 px-5 sm:px-6 py-3.5">
          <Link
            href={`/events/${booking.event_id}`}
            className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            View Event
            <ArrowRight className="h-4 w-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

function BookingsPageContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const { bookings, pagination, isLoading, error: fetchError, mutate } = useBookings(page, 10);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelTargetId, setCancelTargetId] = useState<number | null>(null);

  useEffect(() => {
    if (searchParams.get('booked') === '1') {
      setShowConfirmation(true);
      window.history.replaceState({}, '', '/bookings');
      const t = setTimeout(() => setShowConfirmation(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  useEffect(() => {
    if (fetchError) toast.error(fetchError);
  }, [fetchError]);

  const handleCancelClick = (bookingId: number) => {
    setCancelTargetId(bookingId);
  };

  const handleCancelConfirm = async () => {
    if (!cancelTargetId) return;
    const bookingId = cancelTargetId;
    setCancelTargetId(null);
    setCancellingId(bookingId);
    const res = await api<Booking>(`/api/v1/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    });
    setCancellingId(null);
    if ('error' in res && res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success('Booking cancelled');
    mutate();
  };

  const content = (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          My Bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your event bookings
        </p>
      </div>

      {/* Success confirmation banner */}
      {showConfirmation && (
        <div className="mb-8 animate-fade-in-up rounded-2xl border border-primary/30 bg-primary/5 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-8 w-8 text-primary animate-success-pop" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Booking confirmed!</h2>
              <p className="mt-1 text-muted-foreground">
                Your tickets have been reserved. Check the details below.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[160px] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <>
          <div className="space-y-5">
            {bookings.map((booking, index) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                index={index}
                cancellingId={cancellingId}
                onCancelClick={handleCancelClick}
              />
            ))}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="gap-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pagination.total_pages} ({pagination.total} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.total_pages}
                className="gap-1"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="animate-scale-in rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <TicketIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-6 text-lg font-medium text-foreground">No bookings yet</p>
          <p className="mt-2 text-muted-foreground">Book an event to see your bookings here.</p>
          <Link
            href="/events"
            className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
          >
            Browse Events
          </Link>
        </div>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelTargetId !== null} onOpenChange={(open) => !open && setCancelTargetId(null)}>
        <DialogContent showCloseButton className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle>Cancel Booking</DialogTitle>
              </div>
            </div>
            <DialogDescription className="mt-2">
              Are you sure you want to cancel this booking? This action <span className="font-medium text-destructive">cannot be undone</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setCancelTargetId(null)}
              className="cursor-pointer"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={cancellingId !== null}
              className="cursor-pointer shadow-md shadow-destructive/20 hover:shadow-lg hover:shadow-destructive/30"
            >
              {cancellingId !== null ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FullPageLoader isOpen={cancellingId !== null} message="Cancelling booking..." />
    </div>
  );

  return <ProtectedRoute>{content}</ProtectedRoute>;
}

export default function BookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-4xl py-10 px-4">
          <div className="mb-10 space-y-4">
            <Skeleton className="h-10 w-48 rounded-md" />
            <Skeleton className="h-5 w-64 rounded-md" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[160px] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <BookingsPageContent />
    </Suspense>
  );
}
