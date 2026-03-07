'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import type { Pagination } from '@/lib/api';
import { LazyEventCard } from '@/components/lazy-event-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, ShieldCheck, Filter, LockIcon, ChevronDownIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
                            className="inline-flex items-center justify-center rounded-md font-medium h-8 w-fit px-3 gap-2 text-sm bg-background border border-input shadow-sm hover:bg-muted/50 transition-all disabled:opacity-50 disabled:pointer-events-none"
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
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage all events across the platform. Update statuses below.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border shrink-0">
                    <Filter className="h-4 w-4 text-muted-foreground ml-2" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Filter by Status:</span>
                    <select
                        className="h-9 rounded-md border-border bg-background px-3 py-1 text-sm shadow-sm md:w-[150px]"
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

            {isLoading ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[400px] rounded-xl" />
                    ))}
                </div>
            ) : events.length > 0 ? (
                <>
                    <div className="grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="text-lg font-medium text-foreground">No events found for this filter</p>
                    <p className="mt-2 text-muted-foreground">Try adjusting your filters or create a new event.</p>
                </div>
            )}
        </div>
    );
}

export default function AdminEventsPage() {
    return (
        <ProtectedRoute requireAdmin>
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
        </ProtectedRoute>
    );
}
