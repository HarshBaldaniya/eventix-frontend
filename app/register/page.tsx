'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

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
            router.push('/');
        } else {
            setError(result.error || 'Registration failed');
        }
    };

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:py-16 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <div className="container relative z-10 flex flex-col items-center">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/50 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all hover:scale-105"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <Card className="w-full max-w-[440px] border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden bg-background/80 backdrop-blur-xl">
                    <CardHeader className="px-8 pt-10 pb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tighter">Join the Elite</CardTitle>
                        <CardDescription className="mt-2 text-base font-medium text-muted-foreground">
                            Create your account to unlock exclusive access
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="px-8 pt-0 pb-6 space-y-4">
                            {error && (
                                <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive animate-fade-in-up">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-sm font-bold ml-1">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                    className="h-11 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-sm font-bold ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    disabled={isSubmitting}
                                    required
                                    className="h-11 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-sm font-bold ml-1">Password</Label>
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
                                        className="h-11 rounded-xl border-border/60 bg-muted/20 focus:bg-background transition-all pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        disabled={isSubmitting}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="px-8 pb-10 pt-6 flex flex-col gap-4">
                            <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all shine-effect" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating Account...' : 'Create Elite Account'}
                            </Button>
                            <p className="text-center text-sm font-medium text-muted-foreground">
                                Already a member?{' '}
                                <Link href="/login" className="text-primary hover:underline font-bold">
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>

                <div className="mt-8 flex items-center gap-6 text-xs font-bold text-muted-foreground/40 tracking-widest uppercase">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Vetted Security
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        VIP Access
                    </div>
                </div>
            </div>
        </div>
    );
}
