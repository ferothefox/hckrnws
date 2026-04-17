export type TStoryType = "story" | "job" | "poll";

export type TStoryRoute = `/stories/${number}`;

export type TBaseStory = {
  id: number;
  title: string;
  score: number;
  author: string | null;
  time: number;
  type: TStoryType;
  externalUrl: string | null;
  discussionPath: TStoryRoute;
  domain: string | null;
  commentCount: number;
  textHtml: string | null;
};

export type TPollOption = {
  id: number;
  author: string | null;
  score: number;
  textHtml: string | null;
  time: number;
};

export type TComment = {
  id: number;
  author: string | null;
  time: number;
  textHtml: string | null;
  children: TComment[];
  replyCount: number;
  depth: number;
  isDeleted: boolean;
  isDead: boolean;
};

export type TStoryPageData = TBaseStory & {
  pollOptions: TPollOption[];
};
