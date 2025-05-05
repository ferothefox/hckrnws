import { prettyTime } from "~/helpers/time";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  memo,
  useState,
  useRef,
} from "react";
import { TComment } from "~/types/story";
import { ChevronDownIcon, ChevronUpIcon, ClipboardIcon } from "~/icons";
import InnerHTMLText from "~/components/Common/InnerHTMLText";

type Props = {
  comment: TComment;
  op: string;
};

const getCommentStyles = (level: number, margin: number) => ({
  marginLeft: `calc(${margin}px * ${level})`,
});

const Comment: React.FC<Props> = memo((props: Props) => {
  const {
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
  } = props;

  const contentRef = useRef<HTMLLIElement>(null);

  const isCommenterOP = useMemo(() => user === op, [user, op]);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const [wasUncollapsed, setWasUncollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (contentRef.current && !deleted && wasUncollapsed) {
      setWasUncollapsed(false);
    }
  }, [content, deleted, wasUncollapsed]);

  const margin = 16;
  const commentStyles = useMemo(() => getCommentStyles(level, margin), [level]);

  const handleCollapse = useCallback(() => setCollapsed(true), []);

  const handleExpand = useCallback(() => {
    setCollapsed(false);
    setWasUncollapsed(true);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_VERCEL_URL}/stories/${id}`,
    );
  }, [id]);

  const userBadge = useMemo(
    () => (
      <span
        className={`text-xs text-secondary font-mono py-1 px-2 rounded flex items-center ${
          isCommenterOP ? "bg-op" : "bg-secondary"
        }`}
      >
        {user} {isCommenterOP && "• OP"}
      </span>
    ),
    [user, isCommenterOP],
  );

  const sectionClassName = useMemo(
    () =>
      `pt-0 pr-2 pb-1 pl-3 flex flex-col my-2 relative w-full border-l-2 border-primary`,
    [],
  );

  const childComments = useMemo(() => {
    if (!comments?.length) return null;
    return comments.map((comment) => (
      <Comment key={comment.id} comment={comment} op={op} />
    ));
  }, [comments, op]);

  if (collapsed) {
    return (
      <div data-comment="" data-collapsed="true" style={{ display: "flex" }}>
        <li className={sectionClassName} style={commentStyles}>
          <div className="flex justify-between">
            {userBadge}
            <div className="flex items-center">
              <button
                className="py-1 px-3 ml-2 group focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={handleCopyLink}
              >
                <ClipboardIcon className="h-3 w-3 text-icon mr-2 group-hover:text-primary" />
              </button>
              <span className="py-0.5 px-1.5 text-secondary font-mono bg-tertiary rounded-sm text-[10px]">
                {comments_count}
              </span>
              <button
                className="py-1 px-3 ml-2 group focus-visible:ring-1 focus-visible:ring-blue-500"
                onClick={handleExpand}
              >
                <ChevronDownIcon className="h-3 w-3 text-icon group-hover:text-primary" />
              </button>
            </div>
          </div>
        </li>
      </div>
    );
  }

  return (
    <Fragment>
      <div data-comment="" data-collapsed="false" style={{ display: "flex" }}>
        <li className={sectionClassName} style={commentStyles} ref={contentRef}>
          {!deleted && (
            <div className="flex justify-between mb-2">
              {userBadge}
              <div className="flex items-center">
                <button
                  className="py-1 px-3 group focus-visible:ring-1 focus-visible:ring-blue-500"
                  onClick={handleCopyLink}
                >
                  <ClipboardIcon className="h-3 w-3 text-icon group-hover:text-primary" />
                </button>
                <span className="text-secondary select-none font-mono text-[10px]">
                  {prettyTime(time)}
                </span>
                <button
                  className="py-1 px-3 group focus-visible:ring-1 focus-visible:ring-blue-500"
                  onClick={handleCollapse}
                >
                  <ChevronUpIcon className="h-3 w-3 text-icon group-hover:text-primary" />
                </button>
              </div>
            </div>
          )}
          {deleted ? (
            <p className="font-mono text-secondary text-sm">[deleted]</p>
          ) : (
            <InnerHTMLText
              key={`content-${wasUncollapsed ? "uncollapsed" : "normal"}`}
              content={content}
            />
          )}
        </li>
      </div>
      {childComments}
    </Fragment>
  );
});

Comment.displayName = "Comment";

export default Comment;
