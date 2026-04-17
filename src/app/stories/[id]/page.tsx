import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CenteredText } from "@/components/Common/Fragments";
import StoryComments from "@/components/StoryComments";
import StoryDetail from "@/components/StoryDetail";
import { getStoryDescription, getStoryTitle, siteConfig } from "@/config/site";
import { getStory, getStoryPageData } from "@/helpers/hn";

type StoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data, errorCode } = await getStory(id);

  if (errorCode || !data) {
    return {
      title: siteConfig.name,
    };
  }

  const title = getStoryTitle(data.title);
  const description = getStoryDescription(
    data.textHtml ?? undefined,
    data.externalUrl ?? "",
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
  const { data, errorCode } = await getStoryPageData(id);

  if (errorCode === 404) {
    notFound();
  }

  if (errorCode || !data) {
    return <CenteredText>Oops! Something went wrong :(</CenteredText>;
  }

  const authorName = data.author ?? "unknown";

  return (
    <StoryDetail data={data}>
      <StoryComments
        storyId={data.id}
        op={authorName}
        commentCount={data.commentCount}
      />
    </StoryDetail>
  );
}
