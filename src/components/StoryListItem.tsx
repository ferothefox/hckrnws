import Link from "next/link";
import { TBaseStory } from "~/types/story";
import Meta from "~/components/Common/Meta";
import { decode } from "html-entities";
import StoryStarButton from "~/components/StoryStarButton";
import { Tooltip } from "radix-ui";

type Props = {
  story: TBaseStory;
};

const StoryListItem: React.FC<Props> = (props: Props) => {
  const {
    story: { title, user, url, id, points, comments_count, time, domain },
    story,
  } = props;

  if (!user) return null;

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
        <StoryStarButton story={story} />
      </div>
    </div>
  );
};

export default StoryListItem;
