"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Tooltip } from "radix-ui";
import useStore from "@/store/useStore";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    if (!useStore.persist.hasHydrated()) {
      void useStore.persist.rehydrate();
    }
  }, []);

  return (
    <Tooltip.Provider>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark"]}
      >
        {children}
      </ThemeProvider>
    </Tooltip.Provider>
  );
}
