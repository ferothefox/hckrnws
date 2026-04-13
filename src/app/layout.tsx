import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { karla, spaceMono } from "@/app/fonts";
import AppProviders from "@/components/AppProviders";
import Header from "@/components/Header";
import { defaultMetadata } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${karla.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-primary font-sans antialiased">
        <AppProviders>
          <main className="bg-primary mx-auto flex min-h-screen w-full flex-col overflow-x-hidden p-4 md:w-5/6 xl:w-[900px]">
            <h1 className="hidden">hckrnws</h1>
            <Header />
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
