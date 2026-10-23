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
        duration: 800,
        once: true,
        offset: 100,
        easing: "ease-in-out",
      });
    };

    void initializeAOS();

    return () => {
      aosInstance?.refreshHard();
    };
  }, []);

  return <>{children}</>;
}
