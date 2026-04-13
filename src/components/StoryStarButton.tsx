"use client";

import { StarIcon } from "@/icons";
import useStore from "@/store/useStore";
import type { TBaseStory } from "@/types/story";

type StoryStarButtonProps = {
  story: TBaseStory;
  className?: string;
};

const defaultClassName =
  "flex mr-2 p-1 w-fit items-center rounded-sm border-none hover:bg-hover focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60";

export default function StoryStarButton({
  story,
  className = defaultClassName,
}: StoryStarButtonProps) {
  const starredStories = useStore((state) => state.starredStories);
  const hasHydrated = useStore((state) => state.hasHydrated);
  const toggleStarredStory = useStore((state) => state.toggleStarredStory);

  const isStarred =
    hasHydrated &&
    starredStories.some((starredStory) => starredStory.id === story.id);

  return (
    <button
      type="button"
      className={className}
      onClick={() => toggleStarredStory(story)}
      aria-label={isStarred ? "Remove story from starred" : "Star story"}
      aria-pressed={isStarred}
      disabled={!hasHydrated}
    >
      <StarIcon
        className={`h-3 w-3 ${isStarred ? "text-amber-400" : "text-icon"}`}
      />
      <span className="text-secondary ml-1 font-sans text-xs">
        {isStarred ? "Starred" : "Star"}
      </span>
    </button>
  );
}
