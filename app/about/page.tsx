'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Ticket,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full max-w-[320px] sm:max-w-[380px] md:max-w-[400px]"
      aria-hidden
    >
      {/* Calendar base */}
      <rect
        x="80"
        y="40"
        width="240"
        height="200"
        rx="16"
        className="fill-primary/10 stroke-primary/30"
        strokeWidth="2"
      />
      {/* Calendar header */}
      <rect
        x="80"
        y="40"
        width="240"
        height="48"
        rx="16"
        className="fill-primary/20"
      />
      <rect
        x="80"
        y="64"
        width="240"
        height="24"
        rx="0"
        className="fill-primary/20"
      />
      {/* Calendar grid lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={80 + (i * 240) / 6}
          y1="88"
          x2={80 + (i * 240) / 6}
          y2="240"
          className="stroke-border/60"
          strokeWidth="1"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="80"
          y1={88 + (i * 152) / 5}
          x2="320"
          y2={88 + (i * 152) / 5}
          className="stroke-border/60"
          strokeWidth="1"
        />
      ))}
      {/* Event dots */}
      <circle cx="140" cy="120" r="6" className="fill-primary" />
      <circle cx="200" cy="160" r="6" className="fill-primary" />
      <circle cx="260" cy="200" r="6" className="fill-primary" />
      {/* Ticket icon overlay */}
      <g transform="translate(160, 180)">
        <rect
          x="0"
          y="0"
          width="80"
          height="44"
          rx="8"
          className="fill-background stroke-primary"
          strokeWidth="2"
        />
        <line
          x1="40"
          y1="0"
          x2="40"
          y2="44"
          stroke="currentColor"
          strokeWidth="1"
          className="stroke-primary/40"
        />
        <circle cx="40" cy="22" r="4" className="fill-primary/20" />
      </g>
      {/* Decorative sparkles */}
      <path
        d="M340 60l4 8 8 4-8 4-4 8-4-8-8-4 8-4 4-8z"
        className="fill-primary/30"
      />
      <path
        d="M60 220l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z"
        className="fill-primary/20"
      />
    </svg>
  );
}

const values = [
  {
    icon: CalendarDays,
    title: 'Discover Events',
    description: 'Browse upcoming events in one place. From concerts to workshops, find what matters to you.',
  },
  {
    icon: Ticket,
    title: 'Easy Booking',
    description: 'Book tickets in a few clicks. No hassle, no hidden fees. Your confirmation is instant.',
  },
  {
    icon: Users,
    title: 'For Everyone',
    description: 'Eventix is built for attendees and organizers alike. Explore or create — your way.',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your data and payments are safe. We focus on trust so you can focus on the experience.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/20">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                About Eventix
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Where events and people connect
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Eventix helps you discover, book, and manage event tickets in one place.
                Whether you&apos;re looking for the next concert or hosting your own event, we&apos;re here to make it simple.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-start">
                <Button asChild className="h-11 w-full cursor-pointer gap-2 rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 sm:w-auto">
                  <Link href="/events" className="inline-flex items-center justify-center">
                    Browse Events
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 w-full cursor-pointer rounded-xl border-border bg-background px-6 font-medium text-foreground hover:bg-muted sm:w-auto">
                  <Link href="/" className="inline-flex items-center justify-center">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex shrink-0 justify-center lg:justify-end">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Values / Features */}
      <section className="container mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 md:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Why Eventix?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground sm:text-lg">
            We built Eventix to make event discovery and booking straightforward for everyone.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-16">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ready to find your next event?
          </h2>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Explore what&apos;s on and book in seconds.
          </p>
          <Button asChild className="mt-6 h-11 min-w-[200px] cursor-pointer gap-2 rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30">
            <Link href="/events" className="inline-flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Explore Events
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
