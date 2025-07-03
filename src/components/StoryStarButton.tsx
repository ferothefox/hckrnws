"use client";

import { TBaseStory } from "~/types/story";
import useStore from "~/store/useStore";
import { useEffect, useState } from "react";
import { StarIcon } from "~/icons";

type Props = {
  story: TBaseStory;
};

export default function StoryStarButton({ story }: Props) {
  const [isStoryStarred, setIsStoryStarred] = useState(false);

  const starStory = useStore((state) => state.starStory);
  const starred = useStore((state) => state.starred);

  useEffect(() => {
    setIsStoryStarred(starred?.some((s) => s.id === story.id) || false);
  }, [starred, story.id]);

  const handleStar = () => {
    const isStoryStarred = starred?.some((s) => s.id === story.id);
    if (isStoryStarred) {
      const filteredStories = starred?.filter((s) => s.id !== story.id);
      starStory(filteredStories);
    } else {
      starStory([...starred, story]);
    }
  };

  return (
    <button
      className="flex mr-2 p-1 w-fit items-center cursor-default rounded-sm border-none hover:bg-hover focus-visible:ring-1 focus-visible:ring-blue-500"
      onClick={handleStar}
    >
      <StarIcon
        className={`h-3 w-3 ${
          isStoryStarred ? "text-amber-400" : "text-icon"
        }`}
      />
      <span className="text-xs ml-1 text-secondary font-sans">
        {isStoryStarred ? "Starred" : "Star"}
      </span>
    </button>
  );
}