import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FullPageLoaderProps {
    isOpen: boolean;
    message?: string;
}

export function FullPageLoader({ isOpen, message = 'Loading...' }: FullPageLoaderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in-up">
            <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-card p-8 shadow-2xl border border-border/50 animate-scale-in">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <p className="text-lg font-semibold tracking-tight text-foreground">{message}</p>
            </div>
        </div>,
        document.body
    );
}
