"use client";

import type { ReactNode } from "react";
import { AOSProvider } from "./aos-provider";
import { ThemeProvider } from "./theme-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AOSProvider>{children}</AOSProvider>
    </ThemeProvider>
  );
}
