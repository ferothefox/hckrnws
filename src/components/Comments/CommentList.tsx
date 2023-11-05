import { Fragment } from "react";
import { TComment } from "~/types/story";
import { CenteredText } from "../Common/Fragments";
import { For } from 'million/react';
import Comment from "./Comment";

type Props = {
  comments: TComment[];
  op: string;
};

const CommentList: React.FC<Props> = (props: Props) => {
  const { comments, op } = props;
  return (
    <div className="mt-4">
      {comments.length > 0 ? (
        <Fragment>
          {/*{comments.map((comment) => (*/}
          {/*  <Comment key={comment.id} comment={comment} op={op} />*/}
          {/*))}*/}
          <For each={comments}>
            {(comment) => <Comment key={comment.id} comment={comment} op={op} />}
          </For>
        </Fragment>
      ) : (
        <CenteredText>No comments posted yet!</CenteredText>
      )}
    </div>
  );
};

export default CommentList;
