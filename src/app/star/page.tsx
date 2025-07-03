"use client";

import StoryListItem from "~/components/StoryListItem";
import useStore from "~/store/useStore";

export default function StarPage() {
  const starred = useStore((state) => state.starred);
  
  return (
    <>
      <h3 className="text-lg mt-4 text-secondary font-medium">
        You starred <span className="text-amber-400">{starred?.length}</span>{" "}
        stories
      </h3>
      <div className="flex flex-col mt-8">
        {starred?.map((story) => (
          <StoryListItem story={story} key={story.id} />
        ))}
      </div>
    </>
  );
}