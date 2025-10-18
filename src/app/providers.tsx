"use client";

import dynamic from "next/dynamic";
import { MiniAppProvider } from "@neynar/react";
import { AppProvider } from "~/contexts/AppContext";
import { ThemeProvider } from "~/contexts/ThemeContext";

const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider>
      <MiniAppProvider analyticsEnabled={true}>
        <ThemeProvider>
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </MiniAppProvider>
    </WagmiProvider>
  );
}
