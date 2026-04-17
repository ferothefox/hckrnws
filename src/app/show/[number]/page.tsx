import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { after } from "next/server";
import PaginatedStoryFeed from "@/components/PaginatedStoryFeed";
import {
  buildFeedPageTitle,
  feedRouteConfig,
  parseFeedPageNumber,
} from "@/helpers/feed";
import { getFeedStories, prewarmFeedStoryComments } from "@/helpers/hn";

const routeConfig = feedRouteConfig.show;

type ShowPageProps = {
  params: Promise<{
    number: string;
  }>;
};

export async function generateMetadata({
  params,
}: ShowPageProps): Promise<Metadata> {
  const { number } = await params;

  return {
    title: buildFeedPageTitle(routeConfig.metadataTitle, number),
  };
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { number } = await params;
  const currentPage = parseFeedPageNumber(number, routeConfig.maxPages);
  const { data, errorCode, totalPages } = await getFeedStories(
    routeConfig.feedType,
    currentPage,
  );

  if (errorCode === 404) {
    notFound();
  }

  if (data?.length) {
    after(() => prewarmFeedStoryComments(data));
  }

  return (
    <PaginatedStoryFeed
      stories={data}
      errorCode={errorCode}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={routeConfig.basePath}
    />
  );
}
