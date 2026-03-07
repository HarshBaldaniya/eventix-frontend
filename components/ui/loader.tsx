'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Loader({
  className,
  size = 'default',
}: {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClass =
    size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
  return (
    <Loader2
      className={cn('animate-spin text-primary', sizeClass, className)}
      aria-hidden
    />
  );
}

export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-8">
      <Loader size="lg" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
