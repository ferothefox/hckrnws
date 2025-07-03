"use client";

import { Fragment, memo, useMemo } from "react";
import { TComment } from "~/types/story";
import { CenteredText } from "../Common/Fragments";
import Comment from "./Comment";

type Props = {
  comments: TComment[];
  op: string;
};

const CommentList: React.FC<Props> = memo((props: Props) => {
  const { comments, op } = props;

  const renderedComments = useMemo(() => {
    if (comments.length === 0) {
      return <CenteredText>No comments posted yet</CenteredText>;
    }

    return (
      <Fragment>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} op={op} />
        ))}
      </Fragment>
    );
  }, [comments, op]);

  return <div className="mt-4">{renderedComments}</div>;
});

CommentList.displayName = "CommentList";

export default CommentList;
