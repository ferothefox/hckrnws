import Link from "next/link";
import { TBaseStory } from "~/types/story";
import Meta from "~/components/Common/Meta";
import useStore from "~/store/useStore";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { StarIcon } from "~/icons";
import { Tooltip } from "radix-ui";

type Props = {
  story: TBaseStory;
};

const StoryListItem: React.FC<Props> = (props: Props) => {
  const {
    story: { title, user, url, id, points, comments_count, time, domain },
    story,
  } = props;
  const [isStoryStarred, setIsStoryStarred] = useState(false);

  const starStory = useStore((state) => state.starStory);
  const starred = useStore((state) => state.starred);

  useEffect(() => {
    setIsStoryStarred(starred?.some((story) => story.id === id));
  }, [starred, id]);

  if (!user) return null;

  const handleStar = () => {
    const isStoryStarred = starred?.some((story) => story.id === id);
    if (isStoryStarred) {
      const filteredStories = starred?.filter((story) => story.id !== id);
      starStory(filteredStories);
    } else {
      starStory([...starred, story]);
    }
  };

  return (
    <div className="py-2 flex flex-col w-full bg-transparent duration-100 border-b border-primary">
      <Link href={`/stories/${id}`} passHref>
        <h3
          className={`text-base text-secondary whitespace-pre-line font-medium duration-100 cursor-default font-sans hover:text-primary`}
        >
          {decode(title)}{" "}
        </h3>
      </Link>
      {domain && (
        <Tooltip.Root delayDuration={50}>
          <Tooltip.Trigger asChild>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs whitespace-nowrap font-normal mb-0.5 border-b hover:text-primary border-primary w-fit font-mono text-secondary mt-0.5 focus-visible:ring-1 focus-visible:ring-blue-500"
            >
              ({domain})
            </a>
          </Tooltip.Trigger>
          <Tooltip.Content
            side="right"
            sideOffset={8}
            className="text-xs z-50 border p-1 rounded-md border-primary bg-secondary whitespace-nowrap font-normal mb-0.5 border-b w-fit font-mono text-secondary"
          >
            {url}
          </Tooltip.Content>
        </Tooltip.Root>
      )}
      <div className="flex items-center justify-between">
        <Meta
          id={id}
          points={points}
          comments={comments_count}
          time={time}
          user={user}
          url={url}
        />
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
      </div>
    </div>
  );
};

export default StoryListItem;
