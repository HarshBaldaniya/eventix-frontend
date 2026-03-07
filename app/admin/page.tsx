'use client';

import Link from 'next/link';
import { LayoutDashboard, CalendarPlus, UserPlus, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const actions = [
  {
    href: '/admin/events/new',
    title: 'Create Event',
    description: 'Add a new event with name, capacity, and status.',
    icon: CalendarPlus,
  },
  {
    href: '/admin/users/new',
    title: 'Create User',
    description: 'Register a new user (email, password, name).',
    icon: UserPlus,
  },
  {
    href: '/admin/events',
    title: 'Manage Events',
    description: 'View all events, filter by status, and update event status.',
    icon: CalendarDays,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <div className="mb-8 sm:mb-10">
        <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-10 sm:w-10">
            <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Admin controls for events and users. Choose an action below.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
            >
              <Card
                className={cn(
                  'h-full border border-border/60 bg-card shadow-sm transition-all duration-200',
                  'hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:bg-card/95',
                  'active:scale-[0.99]'
                )}
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <CardTitle className="text-base font-semibold sm:text-lg">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed">
                    {action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="text-xs font-medium text-primary hover:underline sm:text-sm">
                    Open →
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
