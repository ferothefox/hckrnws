import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import type {
  TBaseStory,
  TComment,
  TPollOption,
  TStoryPageData,
  TStoryRoute,
  TStoryType,
} from "@/types/story";

const API_BASE_URL = "https://hacker-news.firebaseio.com/v0";
const HN_BASE_URL = "https://news.ycombinator.com/";
const FEED_REVALIDATE_SECONDS = 60;
const ITEM_REVALIDATE_SECONDS = 60;
const STORIES_PER_PAGE = 30;
const FEED_FETCH_CONCURRENCY = 12;
const COMMENT_FETCH_CONCURRENCY = 32;
const POLL_FETCH_CONCURRENCY = 12;
const COMMENT_PREWARM_FETCH_CONCURRENCY = 2;
const FEED_COMMENT_PREWARM_LIMIT = 6;
const FEED_PRIORITY_PREWARM_LIMIT = 2;
const FEED_COMMENT_PREWARM_MAX_COMMENT_COUNT = 200;

const FEED_ENDPOINTS = {
  top: "topstories",
  new: "newstories",
  ask: "askstories",
  show: "showstories",
} as const;

export const FEED_PAGE_LIMITS = {
  top: 500,
  new: 500,
  ask: 200,
  show: 200,
} as const;

type FetchResult<T> = {
  data: T | null;
  errorCode: false | number;
};

type FeedStoriesResult = FetchResult<TBaseStory[]> & {
  totalPages: number;
};

type StoryRecordResult = {
  rawItem: THackerNewsItem | null;
  story: TBaseStory | null;
  errorCode: false | number;
};

type THackerNewsItemType = TStoryType | "comment" | "pollopt";

type THackerNewsItem = {
  id: number;
  deleted?: boolean;
  type?: THackerNewsItemType;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
};

type TStoryCommentsResult = FetchResult<TComment[]>;

export type FeedType = keyof typeof FEED_ENDPOINTS;

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

    const data = (await response.json()) as T | null;

    if (data === null) {
      return {
        data: null,
        errorCode: 404,
      };
    }

    return { data, errorCode: false };
  } catch {
    return {
      data: null,
      errorCode: 500,
    };
  }
}

function mapWithConcurrency<T, TResult>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<TResult>,
) {
  const results = new Array<TResult>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  return Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  ).then(() => results);
}

function getDiscussionPath(id: number): TStoryRoute {
  return `/stories/${id}` as TStoryRoute;
}

function getDomain(url: string | null) {
  if (!url) {
    return null;
  }

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname || null;
  } catch {
    return null;
  }
}

function normalizeExternalUrl(url?: string) {
  const normalizedUrl = url?.trim();

  if (!normalizedUrl) {
    return null;
  }

  try {
    return new URL(normalizedUrl, HN_BASE_URL).toString();
  } catch {
    return null;
  }
}

function normalizeStory(item: THackerNewsItem): TBaseStory | null {
  if (!item.type || !item.title) {
    return null;
  }

  if (item.type !== "story" && item.type !== "job" && item.type !== "poll") {
    return null;
  }

  const externalUrl = normalizeExternalUrl(item.url);

  return {
    id: item.id,
    title: item.title,
    score: item.score ?? 0,
    author: item.by ?? null,
    time: item.time ?? 0,
    type: item.type,
    externalUrl,
    discussionPath: getDiscussionPath(item.id),
    domain: getDomain(externalUrl),
    commentCount: item.descendants ?? 0,
    textHtml: item.text ?? null,
  };
}

function normalizePollOption(item: THackerNewsItem): TPollOption | null {
  if (item.type !== "pollopt") {
    return null;
  }

  return {
    id: item.id,
    author: item.by ?? null,
    score: item.score ?? 0,
    textHtml: item.text ?? null,
    time: item.time ?? 0,
  };
}

const getFeedStoryIds = cache(async (feed: FeedType) => {
  return fetchHnJson<number[]>(`${FEED_ENDPOINTS[feed]}.json`, {
    next: { revalidate: FEED_REVALIDATE_SECONDS },
  });
});

const getItemResult = cache(async (id: number) => {
  return fetchHnJson<THackerNewsItem>(`item/${id}.json`, {
    next: { revalidate: ITEM_REVALIDATE_SECONDS },
  });
});

const getStoryRecord = cache(async (id: number): Promise<StoryRecordResult> => {
  const result = await getItemResult(id);

  if (!result.data) {
    return {
      rawItem: null,
      story: null,
      errorCode: result.errorCode || 500,
    };
  }

  const story = normalizeStory(result.data);

  return {
    rawItem: result.data,
    story,
    errorCode: story ? false : 404,
  };
});

function parseItemId(id: string) {
  const parsedId = Number.parseInt(id, 10);
  return Number.isNaN(parsedId) || parsedId < 1 ? null : parsedId;
}

async function getCommentItems(commentIds: number[] | undefined) {
  if (!commentIds?.length) {
    return new Map<number, THackerNewsItem>();
  }

  const queue = [...commentIds];
  const seen = new Set(queue);
  const items = new Map<number, THackerNewsItem>();
  let nextIndex = 0;
  let activeWorkers = 0;

  await new Promise<void>((resolve) => {
    let finished = false;

    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      resolve();
    };

    const pump = () => {
      while (
        activeWorkers < COMMENT_FETCH_CONCURRENCY &&
        nextIndex < queue.length
      ) {
        const commentId = queue[nextIndex];
        nextIndex += 1;
        activeWorkers += 1;

        void getItemResult(commentId)
          .then((result) => {
            const comment = result.data;

            if (!comment || comment.type !== "comment") {
              return;
            }

            items.set(comment.id, comment);

            for (const childId of comment.kids ?? []) {
              if (seen.has(childId)) {
                continue;
              }

              seen.add(childId);
              queue.push(childId);
            }
          })
          .finally(() => {
            activeWorkers -= 1;

            if (activeWorkers === 0 && nextIndex >= queue.length) {
              finish();
              return;
            }

            pump();
          });
      }

      if (activeWorkers === 0 && nextIndex >= queue.length) {
        finish();
      }
    };

    pump();
  });

  return items;
}

function buildCommentTree(
  commentIds: number[] | undefined,
  items: Map<number, THackerNewsItem>,
  depth = 0,
): {
  comments: TComment[];
  totalCount: number;
} {
  if (!commentIds?.length) {
    return {
      comments: [],
      totalCount: 0,
    };
  }

  let totalCount = 0;
  const comments = commentIds.flatMap((commentId) => {
    const comment = items.get(commentId);

    if (!comment || comment.type !== "comment") {
      return [];
    }

    const childTree = buildCommentTree(comment.kids, items, depth + 1);
    totalCount += 1 + childTree.totalCount;

    return [
      {
        id: comment.id,
        author: comment.by ?? null,
        time: comment.time ?? 0,
        textHtml: comment.text ?? null,
        children: childTree.comments,
        replyCount: childTree.totalCount,
        depth,
        isDeleted: Boolean(comment.deleted),
        isDead: Boolean(comment.dead),
      } satisfies TComment,
    ];
  });

  return {
    comments,
    totalCount,
  };
}

async function getCommentTree(commentIds: number[] | undefined) {
  const commentItems = await getCommentItems(commentIds);
  return buildCommentTree(commentIds, commentItems).comments;
}

async function buildStoryCommentsResult(
  storyId: number,
): Promise<TStoryCommentsResult> {
  const storyRecord = await getStoryRecord(storyId);

  if (!storyRecord.rawItem || !storyRecord.story) {
    return {
      data: null,
      errorCode: storyRecord.errorCode,
    };
  }

  const comments = await getCommentTree(storyRecord.rawItem.kids);

  return {
    data: comments,
    errorCode: false,
  };
}

const getCachedStoryCommentsResult = unstable_cache(
  async (storyId: number) => buildStoryCommentsResult(storyId),
  ["story-comments"],
  {
    revalidate: ITEM_REVALIDATE_SECONDS,
  },
);

async function getPollOptions(
  partIds: number[] | undefined,
): Promise<TPollOption[]> {
  if (!partIds?.length) {
    return [];
  }

  const pollOptions = await mapWithConcurrency(
    partIds,
    POLL_FETCH_CONCURRENCY,
    async (partId) => {
      const result = await getItemResult(partId);
      return result.data ? normalizePollOption(result.data) : null;
    },
  );

  return pollOptions.filter(
    (pollOption): pollOption is TPollOption => pollOption !== null,
  );
}

export function getFeedMaxPages(feed: FeedType) {
  return Math.ceil(FEED_PAGE_LIMITS[feed] / STORIES_PER_PAGE);
}

export async function getFeedStories(
  feed: FeedType,
  pageNumber: number,
): Promise<FeedStoriesResult> {
  const storyIdsResult = await getFeedStoryIds(feed);

  if (!storyIdsResult.data) {
    return {
      data: null,
      errorCode: storyIdsResult.errorCode,
      totalPages: getFeedMaxPages(feed),
    };
  }

  const totalPages = Math.max(
    1,
    Math.ceil(storyIdsResult.data.length / STORIES_PER_PAGE),
  );

  if (pageNumber > totalPages) {
    return {
      data: null,
      errorCode: 404,
      totalPages,
    };
  }

  const startIndex = (pageNumber - 1) * STORIES_PER_PAGE;
  const pageStoryIds = storyIdsResult.data.slice(
    startIndex,
    startIndex + STORIES_PER_PAGE,
  );

  const stories = await mapWithConcurrency(
    pageStoryIds,
    FEED_FETCH_CONCURRENCY,
    async (storyId) => {
      const result = await getItemResult(storyId);
      return result.data ? normalizeStory(result.data) : null;
    },
  );

  return {
    data: stories.filter((story): story is TBaseStory => story !== null),
    errorCode: false,
    totalPages,
  };
}

export const getStory = cache(async (id: string) => {
  const itemId = parseItemId(id);

  if (itemId === null) {
    return {
      data: null,
      errorCode: 404,
    };
  }

  const storyRecord = await getStoryRecord(itemId);

  return {
    data: storyRecord.story,
    errorCode: storyRecord.errorCode,
  };
});

export const getStoryPageData = cache(async (id: string) => {
  const itemId = parseItemId(id);

  if (itemId === null) {
    return {
      data: null,
      errorCode: 404,
    };
  }

  const storyRecord = await getStoryRecord(itemId);

  if (!storyRecord.rawItem || !storyRecord.story) {
    return {
      data: null,
      errorCode: storyRecord.errorCode,
    };
  }

  const pollOptions = await getPollOptions(storyRecord.rawItem.parts);

  return {
    data: {
      ...storyRecord.story,
      pollOptions,
    } satisfies TStoryPageData,
    errorCode: false,
  };
});

export async function getStoryComments(id: string) {
  const itemId = parseItemId(id);

  if (itemId === null) {
    return {
      data: null,
      errorCode: 404,
    };
  }

  return getCachedStoryCommentsResult(itemId);
}

function getStoriesToPrewarm(stories: TBaseStory[]) {
  const prioritizedStoryIds = stories
    .filter((story) => story.commentCount > 0)
    .slice(0, FEED_PRIORITY_PREWARM_LIMIT)
    .map((story) => story.id);

  const prioritizedStoryIdSet = new Set(prioritizedStoryIds);
  const remainingSlots = Math.max(
    0,
    FEED_COMMENT_PREWARM_LIMIT - prioritizedStoryIds.length,
  );

  const secondaryStoryIds = stories
    .filter(
      (story) =>
        story.commentCount > 0 &&
        story.commentCount <= FEED_COMMENT_PREWARM_MAX_COMMENT_COUNT &&
        !prioritizedStoryIdSet.has(story.id),
    )
    .slice(0, remainingSlots)
    .map((story) => story.id);

  return [...prioritizedStoryIds, ...secondaryStoryIds];
}

export async function prewarmStoryComments(storyIds: number[]) {
  if (!storyIds.length) {
    return;
  }

  await mapWithConcurrency(
    storyIds,
    COMMENT_PREWARM_FETCH_CONCURRENCY,
    async (storyId) => {
      await getStoryComments(`${storyId}`);
      return null;
    },
  );
}

export async function prewarmFeedStoryComments(stories: TBaseStory[]) {
  return prewarmStoryComments(getStoriesToPrewarm(stories));
}
