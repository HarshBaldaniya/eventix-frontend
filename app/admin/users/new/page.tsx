'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsSubmitting(true);
    const res = await api<{ user: { id: number; email: string; name: string | null; role: string } }>(
      '/api/v1/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
        }),
        skipAuth: true,
      }
    );
    setIsSubmitting(false);
    if ('error' in res && res.error) {
      setError(res.error.message || 'Failed to create user');
      toast.error(res.error.message);
      return;
    }
    if ('data' in res && res.success) {
      toast.success(`User ${email.trim()} created successfully`);
      setEmail('');
      setPassword('');
      setName('');
      router.push('/admin');
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="relative overflow-hidden border border-border/60 bg-card shadow-lg shadow-black/5 sm:rounded-2xl sm:shadow-xl">
        {/* Loading overlay */}
        {isSubmitting && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
            <Loader size="lg" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">Creating user...</p>
          </div>
        )}

        <CardHeader className="border-b border-border/40 bg-muted/20 px-4 py-5 sm:px-6 sm:pt-6 sm:pb-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
              <UserPlus className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold sm:text-xl">Create User</CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                Register a new user. They can sign in with the email and password you set.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="h-10 rounded-xl border-border/60 bg-background sm:h-11"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="h-10 rounded-xl border-border/60 bg-background pr-10 sm:h-11"
                  minLength={8}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={isSubmitting}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-10 rounded-xl border-border/60 bg-background sm:h-11"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/40 bg-muted/10 px-4 py-4 sm:flex-row sm:px-6 sm:py-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer rounded-xl sm:w-auto"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" className="text-primary-foreground" />
                  Creating...
                </span>
              ) : (
                'Create User'
              )}
            </Button>
            <Link href="/admin" className="w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer rounded-xl sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
