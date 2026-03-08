'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirect);
    }
  }, [isAuthenticated, isLoading, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsSubmitting(true);
    const result = await register(name.trim(), email.trim(), password);
    setIsSubmitting(false);
    if (result.success) {
      router.push(redirect);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-8 sm:py-12 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-primary/10 blur-[80px] sm:blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[200px] w-[200px] sm:h-[300px] sm:w-[300px] rounded-full bg-accent/10 blur-[80px] sm:blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 flex flex-col items-center max-w-[440px] w-full min-w-0">
        <Link
          href="/"
          className="mb-4 sm:mb-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border/60 bg-background/80 backdrop-blur-sm px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors touch-manipulation"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          Back to Home
        </Link>

        <Card className="w-full border border-border/60 shadow-xl rounded-2xl sm:rounded-[32px] overflow-hidden bg-background/90 backdrop-blur-xl">
          <CardHeader className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-5 text-center">
            <div className="mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold sm:font-black tracking-tight">Create account</CardTitle>
            <CardDescription className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Sign up to book events and manage your tickets
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="px-4 pt-0 pb-4 sm:px-6 sm:pb-5 space-y-4">
              {error && (
                <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  required
                  className="h-11 min-h-[44px] rounded-xl border-border/60 bg-muted/20 focus:bg-background touch-manipulation"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isSubmitting}
                  required
                  className="h-11 min-h-[44px] rounded-xl border-border/60 bg-muted/20 focus:bg-background touch-manipulation"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    required
                    className="h-11 min-h-[44px] rounded-xl border-border/60 bg-muted/20 focus:bg-background pr-12 touch-manipulation"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    disabled={isSubmitting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors touch-manipulation"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-6 pt-0 sm:px-6 sm:pb-8 flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 min-h-[44px] text-base font-semibold rounded-xl touch-manipulation" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href={redirect !== '/' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'} className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Secure
          </span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Book events
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center"><Skeleton className="h-[480px] w-full max-w-md rounded-2xl" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
