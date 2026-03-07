'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Menu, Calendar, Ticket, ShieldCheck, LogOut, User, Info } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/about', label: 'About', icon: Info },
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

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    closeMobileMenu();
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="shrink-0 cursor-pointer text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary sm:text-xl"
        >
          Eventix
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" role="navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex h-9 min-w-18 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors hover:bg-muted/50 hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
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
                    <DropdownMenuTrigger className="flex cursor-pointer items-center rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <Avatar className="h-9 w-9 border-2 border-transparent transition-colors hover:border-primary/20">
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
                          <Link href="/bookings" className="flex cursor-pointer items-center gap-2.5 w-full py-2.5 px-3 rounded-lg transition-colors hover:bg-muted/80">
                            <Ticket className="h-4 w-4 text-primary" />
                            My Bookings
                          </Link>
                        }
                      />
                      {user?.role === 'admin' && (
                        <DropdownMenuItem
                          render={
                            <Link href="/admin" className="flex cursor-pointer items-center gap-2.5 w-full py-2.5 px-3 rounded-lg transition-colors hover:bg-muted/80">
                              <ShieldCheck className="h-4 w-4 text-primary" />
                              Admin Dashboard
                            </Link>
                          }
                        />
                      )}
                      <div className="my-1 h-px bg-border" />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => logout()}
                        className="flex cursor-pointer items-center gap-2.5 py-2.5 px-3 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(
                    'flex h-9 min-w-18 cursor-pointer items-center justify-center rounded-lg px-5 text-sm font-medium transition-colors',
                    pathname === '/login'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* Mobile nav - controlled sheet with auto-close on link click */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-2rem,300px)] max-w-[300px] flex-col border-l border-border bg-background p-0 shadow-xl"
              showCloseButton={true}
            >
              <div className="flex flex-1 flex-col overflow-auto">
                {/* User block when logged in */}
                {!isLoading && isAuthenticated && user && (
                  <div className="border-b border-border px-4 py-4">
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <Avatar className="h-11 w-11 shrink-0 border-2 border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials(user.name ?? null, user.email ?? '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{user.name || 'User'}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-0.5 p-3" role="navigation">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          pathname === link.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {link.label}
                      </Link>
                    );
                  })}

                  {!isLoading &&
                    (isAuthenticated ? (
                      <>
                        <Link
                          href="/bookings"
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                            pathname === '/bookings'
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                          )}
                        >
                          <Ticket className="h-4 w-4 shrink-0" />
                          My Bookings
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={closeMobileMenu}
                            className={cn(
                              'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                              pathname?.startsWith('/admin')
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                            )}
                          >
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                            Admin Dashboard
                          </Link>
                        )}
                        <div className="my-2 h-px bg-border" />
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                          pathname === '/login'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        )}
                      >
                        <User className="h-4 w-4 shrink-0" />
                        Login
                      </Link>
                    ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
