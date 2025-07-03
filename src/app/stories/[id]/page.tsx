import { Metadata } from "next";
import { baseUrl } from "~/config/seo";
import { decode } from "html-entities";
import StoryClient from "./story-client";

type Props = {
  params: Promise<{ id: string }>;
};

async function getStory(id: string) {
  const ITEM_BASE_URL = "https://api.hnpwa.com/v0/item";
  const fetchUrl = `${ITEM_BASE_URL}/${id}.json`;
  
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getStory(id);
  
  if (!data) {
    return {
      title: "Story not found",
    };
  }

  const { title, content, url } = data;
  const pageTitle = `${decode(title)} - hckrnws`;
  const canonicalUrl = `${baseUrl}/stories/${id}`;
  
  const description = content
    ? decode(
        content
          .replace(/<[^>]+>/g, "")
          .replace(/\\s+/g, " ")
          .trim()
      ).slice(0, 160)
    : `Discussion of ${url} on Hacker News`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      type: "article",
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
  };
}

export default function StoryPage() {
  return <StoryClient />;
}