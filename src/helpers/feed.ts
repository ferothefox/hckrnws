import { notFound } from "next/navigation";
import { getFeedMaxPages, type FeedType } from "@/helpers/hn";

export const feedRouteConfig = {
  top: {
    basePath: "/top",
    feedType: "top",
    metadataTitle: "Top HN",
    maxPages: getFeedMaxPages("top"),
  },
  new: {
    basePath: "/new",
    feedType: "new",
    metadataTitle: "New HN",
    maxPages: getFeedMaxPages("new"),
  },
  ask: {
    basePath: "/ask",
    feedType: "ask",
    metadataTitle: "Ask HN",
    maxPages: getFeedMaxPages("ask"),
  },
  show: {
    basePath: "/show",
    feedType: "show",
    metadataTitle: "Show HN",
    maxPages: getFeedMaxPages("show"),
  },
} satisfies Record<
  string,
  {
    basePath: `/${string}`;
    feedType: FeedType;
    metadataTitle: string;
    maxPages: number;
  }
>;

export function buildFeedPageTitle(title: string, pageNumber: string) {
  return `${title} - Page ${pageNumber}`;
}

export function parseFeedPageNumber(number: string, maxPages: number) {
  const pageNumber = Number.parseInt(number, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1 || pageNumber > maxPages) {
    notFound();
  }

  return pageNumber;
}
