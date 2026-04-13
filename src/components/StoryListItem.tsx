"use client";

import Link from "next/link";
import Meta from "@/components/Common/Meta";
import { decode } from "html-entities";
import StoryDomainLink from "@/components/StoryDomainLink";
import StoryStarButton from "@/components/StoryStarButton";
import type { TBaseStory } from "@/types/story";

type Props = {
  story: TBaseStory;
};

export default function StoryListItem({ story }: Props) {
  const { title, user, url, id, points, comments_count, time, domain } = story;

  if (!user) return null;

  return (
    <div className="border-primary flex w-full flex-col border-b bg-transparent py-2 duration-100">
      <Link href={`/stories/${id}`}>
        <h3 className="text-secondary hover:text-primary font-sans text-base font-medium whitespace-pre-line duration-100">
          {decode(title)}
        </h3>
      </Link>
      {domain ? (
        <StoryDomainLink
          url={url}
          domain={domain}
          className="hover:text-primary border-primary text-secondary mt-0.5 mb-0.5 w-fit border-b font-mono text-xs font-normal whitespace-nowrap focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      ) : null}
      <div className="flex items-center justify-between">
        <Meta points={points} comments={comments_count} time={time} />
        <StoryStarButton story={story} />
      </div>
    </div>
  );
}
