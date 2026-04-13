"use client";

import { CenteredText } from "@/components/Common/Fragments";
import StoryListItem from "@/components/StoryListItem";
import useStore from "@/store/useStore";

export default function StarredStories() {
  const hasHydrated = useStore((state) => state.hasHydrated);
  const starredStories = useStore((state) => state.starredStories);

  if (!hasHydrated) {
    return <CenteredText>Loading your starred stories...</CenteredText>;
  }

  return (
    <>
      <h3 className="text-secondary mt-4 text-lg font-medium">
        You starred{" "}
        <span className="text-amber-400">{starredStories.length}</span> stories
      </h3>
      <div className="mt-8 flex flex-col">
        {starredStories.map((story) => (
          <StoryListItem story={story} key={story.id} />
        ))}
      </div>
    </>
  );
}
