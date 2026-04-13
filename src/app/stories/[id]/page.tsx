import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CenteredText } from "@/components/Common/Fragments";
import StoryDetail from "@/components/StoryDetail";
import { getStoryDescription, getStoryTitle, siteConfig } from "@/config/site";
import { getDetailedStory, getStoryUrl } from "@/helpers/hn";

type StoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data, errorCode } = await getDetailedStory(id);

  if (errorCode || !data) {
    return {
      title: siteConfig.name,
    };
  }

  const title = getStoryTitle(data.title);
  const description = getStoryDescription(
    data.content ?? undefined,
    getStoryUrl(data.url, data.id),
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/stories/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/stories/${id}`,
      type: "article",
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const { data, errorCode } = await getDetailedStory(id);

  if (errorCode === 404) {
    notFound();
  }

  if (errorCode || !data) {
    return <CenteredText>Oops! Something went wrong :(</CenteredText>;
  }

  return <StoryDetail data={data} />;
}
