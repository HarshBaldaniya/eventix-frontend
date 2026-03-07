'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/events', label: 'Events' },
  ];

  const getInitials = (name: string | null, email: string) => {
    if (name && name.trim()) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
          Eventix
        </Link>

        {/* Desktop nav - aligned baseline, consistent spacing */}
        <nav className="hidden md:flex items-center gap-6" role="navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex h-9 min-w-18 items-center justify-center px-4 text-sm font-medium transition-colors rounded-md hover:bg-muted/50 hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                }`}
            >
              {link.label}
            </Link>
          ))}
          {!isLoading && (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex h-9 items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-colors">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                          {getInitials(user?.name ?? null, user?.email ?? '')}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 rounded-xl p-2 shadow-lg">
                      <div className="flex flex-col gap-1 px-3 py-3 mb-2 rounded-lg bg-muted/50">
                        <p className="text-sm font-semibold text-foreground">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuItem
                        render={
                          <Link href="/bookings" className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg hover:bg-muted/80 transition-colors">
                            <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            My Bookings
                          </Link>
                        }
                      />
                      {user?.role === 'admin' && (
                        <DropdownMenuItem
                          render={
                            <Link href="/admin/events" className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg hover:bg-muted/80 transition-colors">
                              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Admin Dashboard
                            </Link>
                          }
                        />
                      )}
                      <div className="my-1 h-px bg-border" />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => logout()}
                        className="flex items-center gap-2.5 py-2.5 px-3 rounded-lg"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`flex h-9 min-w-18 items-center justify-center rounded-md px-5 text-sm font-medium transition-colors ${pathname === '/login'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* Mobile nav - SheetTrigger renders as button, so we style it directly to avoid nested buttons */}
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted transition-colors">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoading && (
                isAuthenticated ? (
                  <>
                    <Link href="/bookings" className="text-sm font-medium text-muted-foreground hover:text-primary">
                      My Bookings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin/events" className="text-sm font-medium text-muted-foreground hover:text-primary">
                        Admin Dashboard
                      </Link>
                    )}
                    <Button variant="outline" onClick={() => logout()} className="justify-start">
                      Log out
                    </Button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Login
                  </Link>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
