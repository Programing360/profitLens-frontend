"use client";

import { useEffect, type ReactNode } from "react";

interface AOSProviderProps {
  children: ReactNode;
}

export function AOSProvider({ children }: AOSProviderProps) {
  useEffect(() => {
    let aosInstance: typeof import("aos") | undefined;

    const initializeAOS = async () => {
      const AOS = (await import("aos")).default;

      await import("aos/dist/aos.css");

      aosInstance = AOS;

      AOS.init({
        duration: 600,
        easing: "ease-out",
        once: true,
        offset: 80,
      });
    };

    void initializeAOS();

    return () => {
      aosInstance?.refreshHard();
    };
  }, []);

  return <>{children}</>;
}
