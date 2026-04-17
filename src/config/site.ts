import type { Metadata } from "next";
import { decode } from "html-entities";

export const siteConfig = {
  name: "hckrnws",
  description: "hckrnws - A cleaner frontend for reading hackernews",
  url: "https://hckrnws.com",
  ogImage: "/img/og/default.png",
};

export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url,
);

export const defaultMetadata: Metadata = {
  metadataBase: siteUrl,
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  manifest: "/img/meta/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/img/meta/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/img/meta/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/img/meta/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export function getStoryTitle(title: string) {
  return `${decode(title)} - ${siteConfig.name}`;
}

export function getStoryDescription(content: string | undefined, url: string) {
  if (content) {
    return decode(
      content
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    ).slice(0, 160);
  }

  return url
    ? `Discussion of ${url} on Hacker News`
    : "Discussion on Hacker News";
}
