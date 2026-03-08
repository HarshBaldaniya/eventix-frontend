'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Event } from '@/types/api';
import { EventCard } from '@/components/event-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  TicketX,
  ArrowRight,
  Sparkles,
  Ticket,
  Users,
  Shield
} from 'lucide-react';
import { EventsCarousel } from '@/components/events-carousel';
import { LazyEventCard } from '@/components/lazy-event-card';
import { useAuth } from '@/contexts/auth-context';

function groupEvents(events: Event[]) {
  const open: Event[] = [];
  const comingSoon: Event[] = [];
  const soldOut: Event[] = [];
  for (const e of events) {
    if (e.status === 'coming_soon') comingSoon.push(e);
    else if (e.status === 'published' && e.remaining_spots > 0) open.push(e);
    else if (e.status === 'published' && e.remaining_spots <= 0) soldOut.push(e);
  }
  return { open, comingSoon, soldOut };
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api<Event[]>('/api/v1/events?limit=24&sort_by=created_at&order=desc', {
        skipAuth: true,
      });
      if ('data' in res && res.success && Array.isArray(res.data)) {
        setEvents(res.data as Event[]);
      }
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const { open, comingSoon, soldOut } = groupEvents(events);
  const hasAny = open.length > 0 || comingSoon.length > 0 || soldOut.length > 0;

  return (
    <div className="flex min-h-screen flex-col selection:bg-primary/20">
      {/* Hero Section - Elite UI Design */}
      <section className="relative overflow-hidden border-b bg-background pt-20 pb-16 px-4 md:pt-24 md:pb-24">

        {/* Layer 1: Moving Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[-5%] h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px] animate-pulse-slow opacity-60" />
          <div className="absolute bottom-[-10%] right-[10%] h-[550px] w-[550px] rounded-full bg-accent/20 blur-[100px] animate-pulse-slow opacity-40" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[20%] right-[-5%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[90px] animate-pulse-slow opacity-30" style={{ animationDelay: '5s' }} />
        </div>

        {/* Layer 2: Geometric Grids */}
        <div className="absolute inset-0 z-0 bg-grid-black opacity-[0.05] dark:bg-grid-white dark:opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

        <div className="container relative z-10 mx-auto max-w-6xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)] backdrop-blur-md animate-fade-in-up">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            Live Portfolio • Global Access
          </div>

          {/* Title */}
          <h1 className="mt-8 text-5xl font-black tracking-tighter text-foreground sm:text-7xl lg:text-[7rem] animate-title-reveal italic leading-[0.95] sm:leading-[0.9]">
            Create <span className="text-gradient not-italic pr-4">Unstoppable</span> <br className="hidden sm:block" /> Moments
          </h1>

          {/* Subtext */}
          <p className="mt-8 text-base leading-relaxed text-muted-foreground/80 md:text-lg lg:text-xl max-w-2xl mx-auto animate-fade-in-up stagger-2 font-medium balance">
            The elite destination for discovery. Secure your spot at the most exclusive events, from high-stakes tech summits to intimate underground concerts.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up stagger-3">
            <Link
              href="/events"
              className="group shine-effect relative inline-flex h-14 w-full sm:w-auto cursor-pointer items-center justify-center gap-3 rounded-xl bg-foreground px-10 text-base font-black text-background shadow-2xl transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] overflow-hidden"
            >
              <CalendarDays className="h-5 w-5" />
              Explore All Events
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/about"
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-background/50 backdrop-blur-sm px-10 text-sm font-bold shadow-sm transition-all hover:bg-muted hover:border-border/80"
            >
              The Experience
            </Link>
          </div>
        </div>

        {/* Floating Accents */}
        <div className="absolute top-[30%] left-[10%] hidden xl:block animate-float">
          <div className="h-20 w-20 rounded-[2rem] glass flex items-center justify-center rotate-6 border-primary/20 shadow-2xl">
            <Sparkles className="h-10 w-10 text-primary opacity-80" />
          </div>
        </div>
        <div className="absolute bottom-[20%] right-[10%] hidden xl:block animate-float" style={{ animationDelay: '2s' }}>
          <div className="h-24 w-24 rounded-full glass-dark flex items-center justify-center -rotate-12 border-accent/20 shadow-2xl">
            <Ticket className="h-12 w-12 text-accent/30" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto max-w-7xl py-20 px-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-20">
            <div>
              <Skeleton className="h-12 w-72 mb-8 rounded-2xl" />
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[450px] rounded-[40px] bg-muted/20" />
                ))}
              </div>
            </div>
          </div>
        ) : hasAny ? (
          <div className="space-y-48">
            {/* Featured Section - The "Live" Feed */}
            {open.length > 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-end justify-between mb-16 px-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Booking</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-foreground md:text-7xl">
                      Elite <span className="opacity-50">Selection</span>
                    </h2>
                  </div>
                  <Link href="/events" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                    All Access
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-1">
                  {open.slice(0, 6).map((event, index) => (
                    <div key={event.id} className="animate-mask-reveal py-4" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="hover-glow p-1 rounded-[40px] bg-gradient-to-br from-transparent via-transparent to-primary/5">
                        <LazyEventCard event={event} index={index} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coming Soon - The Premium Gallery */}
            {comingSoon.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                <div className="relative rounded-[48px] bg-muted/20 border border-border/40 p-8 md:p-12 overflow-hidden">
                  {/* Background Accents */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-background shadow-xl">
                        <Clock className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black text-foreground tracking-tighter sm:text-5xl">
                          The <span className="opacity-40">Upcoming</span> Collection
                        </h2>
                        <p className="text-base text-muted-foreground font-semibold max-w-md">Be the first to witness the next generation of experiences.</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <EventsCarousel events={comingSoon} baseIndex={0} />
                  </div>
                </div>
              </div>
            )}

            {/* Sold Out - Sophisticated Portfolio */}
            {soldOut.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                  <div className="h-[1px] w-12 bg-border/60" />
                  <h2 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
                    Memories <span className="opacity-40">Archived</span>
                  </h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">A legacy of successful gatherings</p>
                </div>
                <div className="relative rounded-[64px] bg-muted/20 border border-border/40 p-10 overflow-hidden">
                  <EventsCarousel events={soldOut} baseIndex={open.length + comingSoon.length} variant="soldOut" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[64px] border-2 border-dashed border-border/50 bg-muted/10 py-40 text-center group transition-colors hover:border-primary/30">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-muted transition-transform group-hover:scale-110 duration-500">
              <CalendarDays className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mt-10 text-3xl font-black text-foreground tracking-tighter">Curating Perfection</h3>
            <p className="mt-4 text-muted-foreground max-w-sm mx-auto font-semibold text-lg">
              We&apos;re currently hand-picking the next series of exclusive events. Subscribe for VIP access.
            </p>
          </div>
        )}
      </section>

      {/* Premium CTA Section - The Inner Circle */}
      <section className="container mx-auto px-4 py-40">
        <div className="relative group overflow-hidden rounded-[64px] bg-foreground p-1 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]">
          {/* Multi-layered Animated Border Glow */}
          <div className="absolute inset-[-200%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,oklch(0.55_0.22_262),transparent,oklch(0.65_0.15_285),transparent)] opacity-40 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[-150%] animate-[spin_12s_linear_infinite_reverse] bg-[conic-gradient(from_180deg,transparent,oklch(0.65_0.15_285),transparent,oklch(0.55_0.22_262),transparent)] opacity-20 group-hover:opacity-60 transition-opacity" />

          <div className="relative z-10 flex flex-col items-center gap-14 rounded-[60px] bg-background py-28 px-6 text-center md:py-48 overflow-hidden">
            {/* Decorative Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[120px] opacity-30 pointer-events-none" />

            <div className="relative space-y-10 group-hover:scale-[1.02] transition-transform duration-700">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[32px] bg-primary/10 shadow-inner group-hover:rotate-[360deg] transition-transform duration-1000">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-6">
                <h2 className="max-w-4xl text-5xl font-black tracking-tighter text-foreground sm:text-7xl md:text-8xl leading-[0.9]">
                  Ready to join the <br /> <span className="text-gradient animate-pulse">inner circle?</span>
                </h2>
                <p className="mx-auto mt-12 max-w-2xl text-lg font-bold text-muted-foreground/80 md:text-2xl leading-relaxed">
                  Don&apos;t just attend. Be part of the legacy. Join thousands of pioneers discovering the finest moments in their city.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 relative z-10 w-full sm:w-auto">
              {!isAuthenticated ? (
                <Link
                  href="/register"
                  className="group shine-effect relative inline-flex h-20 items-center justify-center rounded-2xl bg-foreground text-background px-16 text-xl font-black transition-all hover:scale-[1.05] active:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                  Join Eventix
                </Link>
              ) : (
                <Link
                  href="/bookings"
                  className="group relative inline-flex h-20 items-center justify-center rounded-2xl bg-foreground text-background px-16 text-xl font-black transition-all hover:scale-[1.05] active:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                  My Dashboard
                </Link>
              )}
              <Link
                href="/events"
                className="inline-flex h-20 items-center justify-center rounded-2xl border-2 border-border bg-background/50 backdrop-blur-md px-16 text-lg font-bold transition-all hover:bg-muted"
              >
                Browse Collection
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-[10px] font-black tracking-[0.3em] uppercase text-muted-foreground/50 animate-pulse-soft">
              <Shield className="h-4 w-4" />
              Encrypted Privacy
              <span className="h-1 w-1 rounded-full bg-border" />
              Elite Access
              <span className="h-1 w-1 rounded-full bg-border" />
              Verified Assets
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
