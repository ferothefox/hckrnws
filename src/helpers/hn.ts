import { cache } from "react";
import { processContent } from "@/helpers/contentProcessor";
import type { TDetailedStory, TBaseStory } from "@/types/story";

const API_BASE_URL = "https://api.hnpwa.com/v0";
const FEED_REVALIDATE_SECONDS = 60 * 60;

type FetchResult<T> = {
  data: T | null;
  errorCode: false | number;
};

export type FeedType = "news" | "newest" | "ask" | "show";

export function buildStaticPageParams(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => ({
    number: `${index + 1}`,
  }));
}

async function fetchHnJson<T>(
  path: string,
  options?: RequestInit & {
    next?: {
      revalidate?: number;
    };
  },
): Promise<FetchResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, options);

    if (!response.ok) {
      return {
        data: null,
        errorCode: response.status,
      };
    }

    return {
      data: (await response.json()) as T,
      errorCode: false,
    };
  } catch {
    return {
      data: null,
      errorCode: 500,
    };
  }
}

export function getStoryUrl(url: string, id: number) {
  return url.startsWith("item?id=") ? `/stories/${id}` : url;
}

export function toBaseStory(story: TBaseStory | TDetailedStory): TBaseStory {
  return {
    ...story,
    domain: story.domain,
    url: getStoryUrl(story.url, story.id),
  };
}

function normalizeCommentContent(comment: TDetailedStory["comments"][number]) {
  return {
    ...comment,
    content: comment.content ? processContent(comment.content) : null,
    comments: comment.comments.map(normalizeCommentContent),
  };
}

function normalizeDetailedStory(story: TDetailedStory): TDetailedStory {
  return {
    ...story,
    url: getStoryUrl(story.url, story.id),
    content: story.content ? processContent(story.content) : null,
    comments: story.comments.map(normalizeCommentContent),
  };
}

export const getFeedStories = cache(
  async (feed: FeedType, pageNumber: string) => {
    return fetchHnJson<TBaseStory[]>(`${feed}/${pageNumber}.json`, {
      next: { revalidate: FEED_REVALIDATE_SECONDS },
    });
  },
);

export const getDetailedStory = cache(async (id: string) => {
  const result = await fetchHnJson<TDetailedStory>(`item/${id}.json`, {
    cache: "no-store",
  });

  if (!result.data) {
    return result;
  }

  return {
    ...result,
    data: normalizeDetailedStory(result.data),
  };
});
