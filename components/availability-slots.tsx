'use client';

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface AvailabilitySlotsProps {
  remaining: number;
  capacity: number;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function AvailabilitySlots({
  remaining,
  capacity,
  size = 'default',
  showLabel = true,
  className,
}: AvailabilitySlotsProps) {
  const percent = capacity > 0 ? Math.round((remaining / capacity) * 100) : 0;
  const isLow = percent <= 20 && percent > 0;
  const isSoldOut = remaining <= 0;

  const sizeClasses = {
    sm: 'h-1.5',
    default: 'h-2',
    lg: 'h-2.5',
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {size !== 'sm' && (
            <div className={cn(
              'flex shrink-0 items-center justify-center rounded-lg',
              size === 'lg' ? 'h-9 w-9' : 'h-7 w-7',
              isSoldOut
                ? 'bg-destructive/10'
                : isLow
                  ? 'bg-amber-500/10'
                  : 'bg-primary/10'
            )}>
              <Users className={cn(
                size === 'lg' ? 'h-4.5 w-4.5' : 'h-3.5 w-3.5',
                isSoldOut
                  ? 'text-destructive'
                  : isLow
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-primary'
              )} />
            </div>
          )}
          {size === 'sm' && (
            <Users className={cn(
              'h-3.5 w-3.5 shrink-0',
              isSoldOut
                ? 'text-destructive'
                : isLow
                  ? 'text-amber-600 dark:text-amber-500'
                  : 'text-primary'
            )} />
          )}
          {showLabel && (
            <span className={cn(
              'font-medium text-foreground truncate',
              size === 'sm' ? 'text-xs' : 'text-sm'
            )}>
              {remaining}/{capacity} spots
            </span>
          )}
        </div>
        {showLabel && (
          <span
            className={cn(
              'font-bold tabular-nums shrink-0',
              size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
              'rounded-full',
              isSoldOut && 'text-destructive bg-destructive/10',
              isLow && !isSoldOut && 'text-amber-700 dark:text-amber-500 bg-amber-500/10',
              !isLow && !isSoldOut && 'text-muted-foreground bg-muted'
            )}
          >
            {isSoldOut ? 'Sold out' : `${percent}%`}
          </span>
        )}
      </div>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-muted/80',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={remaining}
        aria-valuemin={0}
        aria-valuemax={capacity}
        aria-label={`${remaining} of ${capacity} spots available`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            isSoldOut && 'bg-gradient-to-r from-destructive/80 to-destructive/50',
            isLow && !isSoldOut && 'bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse-soft',
            !isLow && !isSoldOut && 'bg-gradient-to-r from-primary to-primary/70'
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
