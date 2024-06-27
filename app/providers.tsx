'use client';

import { SessionProvider } from "@hono/auth-js/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
