export type TBaseStory = {
  id: number;
  title: string;
  points: number;
  user: string | null;
  time: number;
  time_ago?: string;
  type?: string;
  url: string;
  domain: string | null;
  comments_count: number;
};

export type TDetailedStory = {
  id: number;
  title: string;
  points: number;
  user: string | null;
  time: number;
  time_ago: string;
  type: string;
  content: string | null;
  comments: TComment[];
  comments_count: number;
  url: string;
  domain: string | null;
};

export type TComment = {
  id: number;
  user: string | null;
  time: number;
  time_ago: string;
  type: "comment";
  content: string | null;
  comments: TComment[];
  comments_count: number;
  level: number;
  url: string;
  deleted?: boolean;
};
