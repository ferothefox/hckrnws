import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { ThemeProvider } from "next-themes";
import Header from "~/components/Header";
import { DefaultSeo } from "next-seo";
import { defaultSEO } from "~/config/seo";
import { Tooltip } from "radix-ui";

function App({ Component, pageProps }: AppProps) {
  return (
    <Tooltip.Provider>
      <ThemeProvider disableTransitionOnChange>
        <DefaultSeo {...defaultSEO} />
        <main className="mx-auto flex flex-col min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px] ">
          <h1 className="hidden">hckrnws</h1>
          <Header />
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </Tooltip.Provider>
  );
}

export default App;
