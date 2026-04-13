import StoryListItem from "@/components/StoryListItem";
import Pagination from "@/components/Common/Pagination";
import { CenteredText } from "@/components/Common/Fragments";
import type { TBaseStory } from "@/types/story";

type PaginatedStoryFeedProps = {
  stories: TBaseStory[] | null;
  errorCode: false | number;
  currentPage: number;
  totalPages: number;
  basePath: `/${string}`;
};

export default function PaginatedStoryFeed({
  stories,
  errorCode,
  currentPage,
  totalPages,
  basePath,
}: PaginatedStoryFeedProps) {
  if (errorCode) {
    return <CenteredText>Oops! Something went wrong :(</CenteredText>;
  }

  if (!stories?.length) {
    return <CenteredText>No stories found.</CenteredText>;
  }

  return (
    <div className="flex-1">
      {stories.map((story) => (
        <StoryListItem story={story} key={story.id} />
      ))}
      <Pagination
        currentPage={currentPage}
        basePath={basePath}
        totalPages={totalPages}
      />
    </div>
  );
}
