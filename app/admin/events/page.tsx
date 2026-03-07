'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import type { Pagination } from '@/lib/api';
import { LazyEventCard } from '@/components/lazy-event-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, CalendarPlus, Filter, LockIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function AdminEventCardWrapper({ event, index, onStatusUpdate }: { event: Event, index: number, onStatusUpdate: (id: number, status: string) => Promise<void> }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async (status: string) => {
        setIsUpdating(true);
        await onStatusUpdate(event.id, status);
        setIsUpdating(false);
    };

    const isTerminal = ['published', 'cancelled', 'completed'].includes(event.status);

    return (
        <div className="flex flex-col gap-3 group">
            <LazyEventCard event={event} index={index} compact />
            <div className="flex items-center justify-between px-2 py-1 bg-muted/40 rounded-xl border border-border/50">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Manage Status
                </span>

                {isTerminal ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border/50 text-xs font-medium text-muted-foreground shadow-sm cursor-not-allowed">
                        <LockIcon className="h-3.5 w-3.5 opacity-70" />
                        <span className="capitalize">{event.status.replace('_', ' ')}</span>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="inline-flex cursor-pointer items-center justify-center rounded-md font-medium h-8 w-fit px-3 gap-2 text-sm bg-background border border-input shadow-sm hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-r-transparent animate-spin shrink-0" />
                            ) : (
                                <span className="capitalize">{event.status.replace('_', ' ')}</span>
                            )}
                            <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Update Status</div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => handleUpdate('published')}
                                className="gap-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
                            >
                                <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                                <span className="font-medium">Publish Event</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleUpdate('cancelled')}
                                className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                            >
                                <XCircleIcon className="h-4 w-4" />
                                <span className="font-medium">Cancel Event</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

function AdminEventsPageContent() {
    const [events, setEvents] = useState<Event[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('draft');

    const fetchEvents = useCallback(async () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', '12');
        params.set('sort_by', 'created_at');
        params.set('order', 'desc');
        if (statusFilter !== 'all') {
            params.set('status', statusFilter);
        }

        // Using skipAuth: false so the backend knows we are an admin and returns draft events
        const res = await api<Event[]>(`/api/v1/events?${params.toString()}`, { skipAuth: false });
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
    }, [page, statusFilter]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleStatusUpdate = async (eventId: number, newStatus: string) => {
        const res = await api<Event>(`/api/v1/events/${eventId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
            skipAuth: false,
        });
        if (res.success) {
            // refresh data after successful update
            fetchEvents();
        } else {
            alert('Failed to update event status');
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                        Manage Events
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2 sm:text-base">
                        View all events, update statuses, or create a new event.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/admin/events/new" className="cursor-pointer">
                        <Button className="cursor-pointer gap-2 rounded-xl">
                            <CalendarPlus className="h-4 w-4" />
                            Create Event
                        </Button>
                    </Link>
                    <div className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-border bg-muted/30 p-2 sm:w-auto sm:min-w-0">
                    <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="hidden text-sm font-medium text-muted-foreground sm:inline">Filter:</span>
                    <select
                        className="h-9 min-w-0 flex-1 cursor-pointer rounded-lg border-border bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring sm:w-[150px] sm:flex-none"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="all">All Events</option>
                        <option value="draft">Draft (Non-Public)</option>
                        <option value="cancelled">Cancelled (Non-Public)</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="published">Published</option>
                        <option value="completed">Completed</option>
                    </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[360px] rounded-xl sm:h-[400px]" />
                    ))}
                </div>
            ) : events.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-6 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
                        {events.map((event, index) => (
                            <AdminEventCardWrapper
                                key={event.id}
                                event={event}
                                index={index}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>

                    {pagination && (pagination.has_next || pagination.has_prev) && (
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:mt-14 sm:gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={!pagination.has_prev}
                                className="cursor-pointer gap-1 disabled:cursor-not-allowed"
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
                                className="cursor-pointer gap-1 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center sm:py-20">
                    <p className="text-base font-medium text-foreground sm:text-lg">No events found for this filter</p>
                    <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">Try adjusting your filters or create a new event.</p>
                </div>
            )}
        </div>
    );
}

export default function AdminEventsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-5 w-80 mt-2" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[280px] rounded-lg" />
                    ))}
                </div>
            </div>
        }>
            <AdminEventsPageContent />
        </Suspense>
    );
}
