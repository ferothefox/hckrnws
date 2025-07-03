"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BackIcon } from "~/icons";
import { TBaseStory } from "~/types/story";
import StoryStarButton from "~/components/StoryStarButton";
import { useKeyPress } from "~/hooks/useKeyPress";

type Props = {
  story: TBaseStory;
};

export default function StoryActions({ story }: Props) {
  const router = useRouter();

  const onClickBack = useCallback(() => {
    router.back();
  }, [router]);

  useKeyPress("Escape", onClickBack);

  return (
    <div className="flex items-center justify-between mb-2">
      <button
        className="px-2 py-1 bg-transparent rounded-sm flex items-center w-fit group hover:bg-hover focus-visible:ring-1 focus-visible:ring-blue-500"
        onClick={onClickBack}
      >
        <BackIcon className="w-3 h-3 text-icon group-hover:text-primary" />
        <span className="text-xs ml-1 font-mono text-secondary group-hover:text-primary">
          Back
        </span>
      </button>
      
      <StoryStarButton story={story} />
    </div>
  );
}