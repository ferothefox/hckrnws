import "../styles/globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";
import Header from "~/components/Header";
import { Tooltip } from "radix-ui";
import { Metadata } from "next";
import { baseUrl } from "~/config/seo";

export const metadata: Metadata = {
  title: "hckrnws",
  description: "hckrnws - A cleaner frontend for reading hackernews",
  metadataBase: new URL(baseUrl || "https://hckrnws.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "hckrnws",
    images: [
      {
        url: "/img/og/default.png",
        alt: "hckrnws",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/img/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/img/favicon.ico",
    apple: { url: "/img/meta/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/img/meta/site.webmanifest",
  other: {
    "theme-color": "#fafafa",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-primary">
        <Tooltip.Provider>
          <ThemeProvider disableTransitionOnChange>
            <main className="mx-auto flex flex-col min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px]">
              <h1 className="hidden">hckrnws</h1>
              <Header />
              {children}
            </main>
          </ThemeProvider>
        </Tooltip.Provider>
      </body>
    </html>
  );
}
