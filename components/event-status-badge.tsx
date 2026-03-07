'use client';

import type { Event } from '@/types/api';
import { cn } from '@/lib/utils';

type EventStatus = Event['status'];

/** Premium pill-style event status badges with dot indicators */
const statusConfig: Record<EventStatus, { label: string; dotColor: string; bgColor: string; textColor: string }> = {
  published: {
    label: 'Open',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    textColor: 'text-emerald-700 dark:text-emerald-400',
  },
  coming_soon: {
    label: 'Soon',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
    textColor: 'text-amber-700 dark:text-amber-400',
  },
  draft: {
    label: 'Draft',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-500/10 dark:bg-red-500/15',
    textColor: 'text-red-700 dark:text-red-400',
  },
  completed: {
    label: 'Ended',
    dotColor: 'bg-gray-400 dark:bg-gray-500',
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
  },
};

export function EventStatusBadge({ status, size = 'default' }: { status: EventStatus; size?: 'sm' | 'default' }) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold tracking-wide rounded-full',
        size === 'sm'
          ? 'text-[10px] uppercase px-2.5 py-1'
          : 'text-[11px] uppercase px-3 py-1.5',
        config.bgColor,
        config.textColor
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0 animate-pulse', config.dotColor)} />
      {config.label}
    </span>
  );
}
