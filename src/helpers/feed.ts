import { notFound } from "next/navigation";

export const feedRouteConfig = {
  top: {
    basePath: "/top",
    feedType: "news",
    metadataTitle: "Top HN",
    totalPages: 10,
  },
  new: {
    basePath: "/new",
    feedType: "newest",
    metadataTitle: "New HN",
    totalPages: 10,
  },
  ask: {
    basePath: "/ask",
    feedType: "ask",
    metadataTitle: "Ask HN",
    totalPages: 1,
  },
  show: {
    basePath: "/show",
    feedType: "show",
    metadataTitle: "Show HN",
    totalPages: 2,
  },
} as const;

export function buildFeedPageTitle(title: string, pageNumber: string) {
  return `${title} - Page ${pageNumber}`;
}

export function parseFeedPageNumber(number: string, totalPages: number) {
  const pageNumber = Number.parseInt(number, 10);

  if (Number.isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    notFound();
  }

  return pageNumber;
}
