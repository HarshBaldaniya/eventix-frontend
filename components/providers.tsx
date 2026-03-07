'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { LayoutWrapper } from '@/components/layout-wrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="eventix-theme"
    >
      <AuthProvider>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
