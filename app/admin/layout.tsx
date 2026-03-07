'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import {
  LayoutDashboard,
  CalendarPlus,
  UserPlus,
  CalendarDays,
  ShieldCheck,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events/new', label: 'Create Event', icon: CalendarPlus },
  { href: '/admin/users/new', label: 'Create User', icon: UserPlus },
  { href: '/admin/events', label: 'Manage Events', icon: CalendarDays },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.href === '/admin'
            ? pathname === '/admin'
            : item.href === '/admin/events'
              ? pathname === '/admin/events'
              : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
      {onNavigate && (
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to site
        </Link>
      )}
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-muted/20">
        <div className="flex">
          {/* Mobile: admin nav bar sits BELOW main site header (LayoutWrapper Header). Same z-40 so header stays on top. */}
          <div className="fixed left-0 right-0 top-14 z-40 flex h-14 w-full items-center gap-3 border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur-md md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className="inline-flex h-10 w-10 cursor-pointer shrink-0 items-center justify-center rounded-lg border-0 bg-transparent transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex w-[min(100vw-2rem,280px)] max-w-[280px] flex-col border-r border-border bg-background p-0 shadow-xl"
                showCloseButton={true}
              >
                <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">Admin Panel</span>
                </div>
                <nav className="flex flex-1 flex-col gap-0.5 overflow-auto p-3" aria-label="Admin navigation">
                  <AdminNav onNavigate={() => setMobileOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>
            <span className="font-semibold text-foreground">Admin</span>
          </div>

          {/* Desktop sidebar: starts below main site header (top-16 = h-16), height excludes header */}
          <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:block">
            <div className="flex h-14 items-center gap-2 border-b border-border px-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Admin Panel</span>
            </div>
            <nav className="flex flex-col gap-0.5 p-3" aria-label="Admin navigation">
              <AdminNav />
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <Link
                href="/"
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to site
              </Link>
            </div>
          </aside>

          {/* Main content: below main header; on mobile also below admin bar (pt-28 = 14+14) */}
          <main className="min-h-screen flex-1 pt-28 md:pt-0 md:pl-64">
            <div className="min-h-screen w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
