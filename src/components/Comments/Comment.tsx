import { prettyTime } from "@/helpers/time";
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

export default function Comment({
  comment: {
    author,
    textHtml,
    time,
    isDeleted,
    isDead,
    depth,
    children,
    replyCount,
  },
  op,
}: Props) {
  const isCommenterOP = author === op;
  const authorName = author ?? "[deleted]";
  const margin = 8;
  const commentStyles = getCommentStyles(depth, margin);
  const unavailableText = isDead ? "[dead]" : "[deleted]";

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
                  {replyCount}
                </span>
                <time
                  className="text-secondary font-mono text-[10px] select-none"
                  dateTime={new Date(time * 1000).toISOString()}
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
          {isDeleted || isDead ? (
            <p className="text-secondary font-mono text-sm">
              {unavailableText}
            </p>
          ) : (
            <InnerHTMLText content={textHtml ?? ""} />
          )}
        </div>
        {children.length > 0 ? (
          <ol className="m-0 list-none p-0">
            {children.map((childComment) => (
              <Comment key={childComment.id} comment={childComment} op={op} />
            ))}
          </ol>
        ) : null}
      </details>
    </li>
  );
}
