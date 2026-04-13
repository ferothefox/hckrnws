"use client";

import { prettyTime } from "@/helpers/time";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ClipboardIcon } from "@/icons";
import InnerHTMLText from "@/components/Common/InnerHTMLText";
import type { TComment } from "@/types/story";

type Props = {
  comment: TComment;
  op: string;
};

const getCommentStyles = (level: number, margin: number) => ({
  marginLeft: `calc(${margin}px * ${level})`,
});

export default function Comment({
  comment: {
    user,
    content,
    time,
    deleted,
    level,
    comments,
    comments_count,
    id,
  },
  op,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const isCommenterOP = user === op;
  const margin = 16;
  const commentStyles = getCommentStyles(level, margin);

  if (collapsed) {
    return (
      <li className="my-2 list-none" style={commentStyles}>
        <div
          data-comment=""
          data-collapsed="true"
          className="border-primary relative flex w-full flex-col border-l-2 pt-0 pr-2 pb-1 pl-3"
        >
          <div className="flex justify-between">
            <span
              className={`text-secondary flex items-center rounded px-2 py-1 font-mono text-xs ${
                isCommenterOP ? "bg-op" : "bg-secondary"
              }`}
            >
              {user} {isCommenterOP ? "• OP" : null}
            </span>
            <div className="flex items-center">
              <button
                type="button"
                className="group ml-2 px-3 py-1 focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={() =>
                  void navigator.clipboard.writeText(
                    `${window.location.origin}/stories/${id}`,
                  )
                }
                aria-label="Copy story link"
              >
                <ClipboardIcon className="text-icon group-hover:text-primary mr-2 h-3 w-3" />
              </button>
              <span className="text-secondary bg-tertiary rounded-sm px-1.5 py-0.5 font-mono text-[10px]">
                {comments_count}
              </span>
              <button
                type="button"
                className="group ml-2 px-3 py-1 focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={() => setCollapsed(false)}
                aria-label="Expand comment"
              >
                <ChevronDownIcon className="text-icon group-hover:text-primary h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className="my-2 list-none" style={commentStyles}>
      <div
        data-comment=""
        data-collapsed="false"
        className="border-primary relative flex w-full flex-col border-l-2 pt-0 pr-2 pb-1 pl-3"
      >
        {!deleted ? (
          <div className="mb-2 flex justify-between">
            <span
              className={`text-secondary flex items-center rounded px-2 py-1 font-mono text-xs ${
                isCommenterOP ? "bg-op" : "bg-secondary"
              }`}
            >
              {user} {isCommenterOP ? "• OP" : null}
            </span>
            <div className="flex items-center">
              <button
                type="button"
                className="group px-3 py-1 focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={() =>
                  void navigator.clipboard.writeText(
                    `${window.location.origin}/stories/${id}`,
                  )
                }
                aria-label="Copy story link"
              >
                <ClipboardIcon className="text-icon group-hover:text-primary h-3 w-3" />
              </button>
              <time
                className="text-secondary font-mono text-[10px] select-none"
                dateTime={new Date(time * 1000).toISOString()}
                suppressHydrationWarning
              >
                {prettyTime(time)}
              </time>
              <button
                type="button"
                className="group px-3 py-1 focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse comment"
              >
                <ChevronUpIcon className="text-icon group-hover:text-primary h-3 w-3" />
              </button>
            </div>
          </div>
        ) : null}
        {deleted ? (
          <p className="text-secondary font-mono text-sm">[deleted]</p>
        ) : (
          <InnerHTMLText content={content ?? ""} />
        )}
      </div>
      {comments.length > 0 ? (
        <ol className="m-0 list-none p-0">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} op={op} />
          ))}
        </ol>
      ) : null}
    </li>
  );
}
