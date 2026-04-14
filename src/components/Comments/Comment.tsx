"use client";

import { prettyTime } from "@/helpers/time";
import { memo } from "react";
import { ChevronDownIcon } from "@/icons";
import InnerHTMLText from "@/components/Common/InnerHTMLText";
import type { TComment } from "@/types/story";

type Props = {
  comment: TComment;
  op: string;
};

const getCommentStyles = (level: number, margin: number) => ({
  marginLeft: `calc(${margin}px * ${level})`,
});

const containerClassName =
  "border-primary relative w-full border-l-2 pt-0 pr-2 pb-1 pl-3";
const summaryClassName =
  "list-none cursor-pointer [&::-webkit-details-marker]:hidden";

const Comment = memo(function CommentComponent({
  comment: { user, content, time, deleted, level, comments, comments_count },
  op,
}: Props) {
  const isCommenterOP = user === op;
  const authorName = user ?? "[deleted]";
  const margin = 8;
  const commentStyles = getCommentStyles(level, margin);

  return (
    <li className="my-2 list-none" style={commentStyles}>
      <details open className="group">
        <summary className={summaryClassName}>
          <div className={containerClassName}>
            <div className="flex justify-between">
              <span
                className={`text-secondary flex items-center rounded px-2 py-1 font-mono text-xs ${
                  isCommenterOP ? "bg-op" : "bg-secondary"
                }`}
              >
                {authorName} {isCommenterOP ? "• OP" : null}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-secondary font-mono text-[10px] tabular-nums">
                  {comments_count}
                </span>
                <time
                  className="text-secondary font-mono text-[10px] select-none"
                  dateTime={new Date(time * 1000).toISOString()}
                  suppressHydrationWarning
                >
                  {prettyTime(time)}
                </time>
                <span
                  className="text-icon flex h-3 w-3 items-center justify-center"
                  aria-hidden="true"
                >
                  <ChevronDownIcon className="h-3 w-3 transition-transform group-open:rotate-180" />
                </span>
              </div>
            </div>
          </div>
        </summary>
        <div className={containerClassName}>
          {deleted ? (
            <p className="text-secondary font-mono text-sm">[deleted]</p>
          ) : (
            <InnerHTMLText content={content ?? ""} />
          )}
        </div>
        {comments.length > 0 ? (
          <ol className="m-0 list-none p-0">
            {comments.map((childComment) => (
              <Comment key={childComment.id} comment={childComment} op={op} />
            ))}
          </ol>
        ) : null}
      </details>
    </li>
  );
});

export default Comment;
