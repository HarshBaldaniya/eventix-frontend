'use client';

import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/40 bg-background/95 py-6 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">Eventix</span>
                    <span>© {currentYear}</span>
                </div>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/events"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Events
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/hb134/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://harshbaldaniya.com/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Portfolio
                    </a>
                </nav>
            </div>
        </footer>
    );
}
