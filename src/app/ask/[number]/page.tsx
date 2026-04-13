import type { Metadata } from "next";
import PaginatedStoryFeed from "@/components/PaginatedStoryFeed";
import {
  buildFeedPageTitle,
  feedRouteConfig,
  parseFeedPageNumber,
} from "@/helpers/feed";
import { buildStaticPageParams, getFeedStories } from "@/helpers/hn";

const routeConfig = feedRouteConfig.ask;

type AskPageProps = {
  params: Promise<{
    number: string;
  }>;
};

export async function generateStaticParams() {
  return buildStaticPageParams(routeConfig.totalPages);
}

export async function generateMetadata({
  params,
}: AskPageProps): Promise<Metadata> {
  const { number } = await params;

  return {
    title: buildFeedPageTitle(routeConfig.metadataTitle, number),
  };
}

export default async function AskPage({ params }: AskPageProps) {
  const { number } = await params;
  const currentPage = parseFeedPageNumber(number, routeConfig.totalPages);
  const { data, errorCode } = await getFeedStories(
    routeConfig.feedType,
    number,
  );

  return (
    <PaginatedStoryFeed
      stories={data}
      errorCode={errorCode}
      currentPage={currentPage}
      totalPages={routeConfig.totalPages}
      basePath={routeConfig.basePath}
    />
  );
}
