"use client";

import { memo } from "react";
import type { TComment } from "@/types/story";
import { CenteredText } from "../Common/Fragments";
import Comment from "./Comment";

type Props = {
  comments: TComment[];
  op: string;
};

function CommentList({ comments, op }: Props) {
  if (comments.length === 0) {
    return <CenteredText>No comments posted yet</CenteredText>;
  }

  return (
    <ol className="m-0 mt-4 list-none p-0">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} op={op} />
      ))}
    </ol>
  );
}

export default memo(CommentList);
