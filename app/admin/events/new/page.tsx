'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import type { EventStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FullPageLoader } from '@/components/ui/full-page-loader';

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'coming_soon', label: 'Coming Soon' },
  { value: 'published', label: 'Published' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export default function AdminCreateEventPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<EventStatus>('draft');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cap = parseInt(capacity, 10);
    if (!name.trim()) {
      setError('Event name is required');
      return;
    }
    if (!Number.isInteger(cap) || cap < 1) {
      setError('Capacity must be at least 1');
      return;
    }
    setIsSubmitting(true);
    const res = await api<Event>('/api/v1/events', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || null,
        capacity: cap,
        status,
      }),
    });
    setIsSubmitting(false);
    if ('error' in res && res.error) {
      setError(res.error.message || 'Failed to create event');
      toast.error(res.error.message);
      return;
    }
    if ('data' in res && res.success && res.data) {
      toast.success(`Event "${(res.data as Event).name}" created`);
      router.push('/admin/events');
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="relative overflow-hidden border border-border/60 bg-card shadow-lg shadow-black/5 sm:rounded-2xl sm:shadow-xl">
        <FullPageLoader isOpen={isSubmitting} message="Creating event..." />

        <CardHeader className="border-b border-border/40 bg-muted/20 px-4 py-5 sm:px-6 sm:pt-6 sm:pb-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
              <CalendarPlus className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold sm:text-xl">Create Event</CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Add a new event. You can change status later from Manage Events.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Event name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Summer Concert 2025"
                className="h-10 rounded-xl border-border/60 bg-background transition-colors focus-visible:ring-2 sm:h-11"
                maxLength={255}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the event"
                className={cn(
                  'flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm transition-colors',
                  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                maxLength={2000}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-sm font-medium">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="100"
                  className="h-10 rounded-xl border-border/60 bg-background sm:h-11"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  disabled={isSubmitting}
                  className={cn(
                    'flex h-10 w-full cursor-pointer rounded-xl border border-input bg-background px-3 py-2 text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50 sm:h-11'
                  )}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/40 bg-muted/10 px-4 py-4 sm:flex-row sm:px-6 sm:py-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl sm:w-auto"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" className="text-primary-foreground" />
                  Creating...
                </span>
              ) : (
                'Create Event'
              )}
            </Button>
            <Link href="/admin/events" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer rounded-xl sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
