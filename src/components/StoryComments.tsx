import { Suspense } from "react";
import CommentList from "@/components/Comments/CommentList";
import { CenteredText } from "@/components/Common/Fragments";
import { getStoryComments } from "@/helpers/hn";
import { SpinnerIcon } from "@/icons";

type StoryCommentsProps = {
  storyId: number;
  op: string;
  commentCount: number;
};

function StoryCommentsFallback() {
  return (
    <div
      className="mt-4 flex justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <SpinnerIcon className="text-icon h-6 w-6 animate-spin" />
    </div>
  );
}

async function StoryCommentsContent({
  storyId,
  op,
}: Pick<StoryCommentsProps, "storyId" | "op">) {
  const { data, errorCode } = await getStoryComments(`${storyId}`);

  if (errorCode || !data) {
    return <CenteredText>Could not load comments.</CenteredText>;
  }

  return <CommentList comments={data} op={op} />;
}

export default function StoryComments({
  storyId,
  op,
  commentCount,
}: StoryCommentsProps) {
  if (commentCount === 0) {
    return <CommentList comments={[]} op={op} />;
  }

  return (
    <Suspense fallback={<StoryCommentsFallback />}>
      <StoryCommentsContent storyId={storyId} op={op} />
    </Suspense>
  );
}
