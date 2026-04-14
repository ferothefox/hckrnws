"use client";

import type { CSSProperties } from "react";
import { prettyTime } from "@/helpers/time";
import { ClockIcon, CommentIcon, UpvoteIcon } from "@/icons";

type Props = {
  points: number;
  comments: number;
  time: number;
  isDetailedView?: boolean;
};

export default function Meta({
  points,
  comments,
  time,
  isDetailedView = false,
}: Props) {
  const containerClassName = isDetailedView
    ? "mt-0 flex w-auto shrink-0 items-center"
    : "mt-1 flex w-full justify-between";
  const itemsClassName = "flex items-center";

  return (
    <div className={containerClassName}>
      <div className={itemsClassName}>
        <div
          className="fadein-animation mr-2 flex items-center p-1 pl-0"
          style={{ "--fadein-delay": "0s" } as CSSProperties}
        >
          <UpvoteIcon className="text-icon h-3 w-3" />
          <span className="text-secondary ml-1 font-sans text-xs">
            {points}
          </span>
        </div>
        <div
          className="fadein-animation mr-2 flex items-center p-1 pl-0"
          style={{ "--fadein-delay": "0.02s" } as CSSProperties}
        >
          <CommentIcon className="text-icon h-3 w-3" />
          <span className="text-secondary ml-1 font-sans text-xs">
            {comments}
          </span>
        </div>
        <div
          className="fadein-animation mr-2 flex items-center p-1 pl-0"
          style={{ "--fadein-delay": "0.04s" } as CSSProperties}
        >
          <ClockIcon className="text-icon h-3 w-3" />
          <time
            className="text-secondary ml-1 font-sans text-xs"
            dateTime={new Date(time * 1000).toISOString()}
            suppressHydrationWarning
          >
            {prettyTime(time)}
          </time>
        </div>
      </div>
    </div>
  );
}
