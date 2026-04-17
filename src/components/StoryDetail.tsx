"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { decode } from "html-entities";
import InnerHTMLText from "@/components/Common/InnerHTMLText";
import Meta from "@/components/Common/Meta";
import StoryDomainLink from "@/components/StoryDomainLink";
import StoryStarButton from "@/components/StoryStarButton";
import { BackIcon } from "@/icons";
import { useKeyPress } from "@/hooks/useKeyPress";
import type { TBaseStory, TStoryPageData } from "@/types/story";

type StoryDetailProps = {
  data: TStoryPageData;
  children?: ReactNode;
};

export default function StoryDetail({ data, children }: StoryDetailProps) {
  const router = useRouter();
  const {
    id,
    title,
    score,
    author,
    time,
    textHtml,
    pollOptions,
    domain,
    externalUrl,
    commentCount,
  } = data;
  const authorName = author ?? "unknown";
  const story: TBaseStory = {
    id,
    title,
    score,
    author,
    time,
    type: data.type,
    externalUrl,
    discussionPath: data.discussionPath,
    domain,
    commentCount,
    textHtml,
  };

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
          {externalUrl && domain ? (
            <StoryDomainLink
              url={externalUrl}
              domain={domain}
              className="hover:text-primary border-primary text-secondary mt-0.5 mb-0.5 inline-block max-w-full min-w-0 shrink truncate border-b font-mono text-xs font-normal focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          ) : null}
          <Meta
            time={time}
            score={score}
            isDetailedView
            commentCount={commentCount}
          />
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          <p className="text-secondary ml-0.5 font-sans text-xs font-normal">
            by <span className="text-primary font-semibold">{authorName}</span>
          </p>
          <StoryStarButton story={story} />
        </div>
        {textHtml ? <InnerHTMLText content={textHtml} isDescription /> : null}
        {pollOptions.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-primary font-sans text-sm font-medium">
              Poll options
            </h3>
            <ol className="mt-2 flex list-none flex-col gap-2 p-0">
              {pollOptions.map((pollOption) => (
                <li
                  key={pollOption.id}
                  className="border-primary bg-secondary rounded-sm border p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-primary font-mono text-xs">
                      {pollOption.score} votes
                    </span>
                    {pollOption.author ? (
                      <span className="text-secondary font-mono text-[10px]">
                        by {pollOption.author}
                      </span>
                    ) : null}
                  </div>
                  {pollOption.textHtml ? (
                    <InnerHTMLText content={pollOption.textHtml} />
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
