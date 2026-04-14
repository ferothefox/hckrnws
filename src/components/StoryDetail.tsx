"use client";

import { useRouter } from "next/navigation";
import { decode } from "html-entities";
import CommentList from "@/components/Comments/CommentList";
import InnerHTMLText from "@/components/Common/InnerHTMLText";
import Meta from "@/components/Common/Meta";
import StoryDomainLink from "@/components/StoryDomainLink";
import StoryStarButton from "@/components/StoryStarButton";
import { BackIcon } from "@/icons";
import { toBaseStory } from "@/helpers/hn";
import { useKeyPress } from "@/hooks/useKeyPress";
import type { TDetailedStory } from "@/types/story";

type StoryDetailProps = {
  data: TDetailedStory;
};

export default function StoryDetail({ data }: StoryDetailProps) {
  const router = useRouter();
  const story = toBaseStory(data);
  const {
    title,
    points,
    user,
    time,
    content,
    comments,
    domain,
    comments_count,
  } = data;
  const authorName = user ?? "unknown";

  useKeyPress("Escape", () => router.back());

  return (
    <div className="mb-8 flex flex-1 flex-col">
      <button
        className="group hover:bg-hover mb-2 flex w-fit items-center rounded-sm bg-transparent px-2 py-1 focus-visible:ring-1 focus-visible:ring-blue-500"
        onClick={() => router.back()}
        type="button"
      >
        <BackIcon className="text-icon group-hover:text-primary h-3 w-3" />
        <span className="text-secondary group-hover:text-primary ml-1 font-mono text-xs">
          Back
        </span>
      </button>
      <div className="bg-primary border-primary flex flex-col rounded-sm border p-4">
        <h2 className="text-primary m-0 mb-1 font-sans text-lg font-medium md:text-xl">
          {decode(title)}
        </h2>
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          {domain ? (
            <StoryDomainLink
              url={story.url}
              domain={domain}
              className="hover:text-primary border-primary text-secondary mt-0.5 mb-0.5 inline-block max-w-full min-w-0 shrink truncate border-b font-mono text-xs font-normal focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          ) : null}
          <Meta
            time={time}
            points={points}
            isDetailedView
            comments={comments_count}
          />
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="text-secondary ml-0.5 font-sans text-xs font-normal">
            by <span className="text-primary font-semibold">{authorName}</span>
          </p>
          <StoryStarButton story={story} />
        </div>
        {content ? <InnerHTMLText content={content} isDescription /> : null}
      </div>
      <CommentList comments={comments} op={authorName} />
    </div>
  );
}
