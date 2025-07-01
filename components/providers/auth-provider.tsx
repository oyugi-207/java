
"use client";

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
