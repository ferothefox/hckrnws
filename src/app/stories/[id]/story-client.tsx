"use client";

import { useParams, useRouter } from "next/navigation";
import { TDetailedStory } from "~/types/story";
import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import Meta from "~/components/Common/Meta";
import CommentList from "~/components/Comments/CommentList";
import { BackIcon, StarIcon } from "~/icons";
import useStore from "~/store/useStore";
import { decode } from "html-entities";
import InnerHTMLText from "~/components/Common/InnerHTMLText";
import { useKeyPress } from "~/hooks/useKeyPress";
import { Tooltip } from "radix-ui";

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<TDetailedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isStoryStarred, setIsStoryStarred] = useState(false);

  const starStory = useStore((state) => state.starStory);
  const starred = useStore((state) => state.starred);

  const onClickBack = useCallback(() => {
    router.back();
  }, [router]);

  useKeyPress("Escape", onClickBack);

  useEffect(() => {
    async function fetchStory() {
      try {
        const ITEM_BASE_URL = "https://api.hnpwa.com/v0/item";
        const fetchUrl = `${ITEM_BASE_URL}/${id}.json`;
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          setError(true);
          return;
        }
        
        const storyData = await response.json();
        setData(storyData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStory();
  }, [id]);

  useEffect(() => {
    if (data) {
      setIsStoryStarred(starred?.some((story) => story.id === data.id) || false);
    }
  }, [starred, data]);

  const story = useMemo(
    () => data ? ({
      id: data.id,
      title: data.title,
      points: data.points,
      user: data.user,
      time: data.time,
      url: data.url.startsWith("item?id=") ? data.url.replace("item?id=", "") : data.url,
      domain: data.domain,
      comments_count: data.comments_count,
    }) : null,
    [data]
  );

  const handleStar = useCallback(() => {
    if (!data || !story) return;
    const isStoryStarred = starred?.some((story) => story.id === data.id);
    if (isStoryStarred) {
      const filteredStories = starred?.filter((story) => story.id !== data.id);
      starStory(filteredStories);
    } else {
      starStory([...starred, story]);
    }
  }, [starred, story, data, starStory]);

  const commentsSection = useMemo(
    () => data ? <CommentList comments={data.comments} op={data.user} /> : null,
    [data]
  );

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading story</div>;

  const {
    title,
    points,
    user,
    time,
    content,
    domain,
    comments_count,
  } = data;
  
  let { url } = data;

  if (url.startsWith("item?id=")) {
    url = url.replace("item?id=", "");
  }

  return (
    <Fragment>
      <div className="flex flex-col flex-1 mb-8">
        <button
          className="px-2 py-1 bg-transparent rounded-sm flex items-center mb-2 w-fit group hover:bg-hover focus-visible:ring-1 focus-visible:ring-blue-500"
          onClick={onClickBack}
        >
          <BackIcon className="w-3 h-3 text-icon group-hover:text-primary" />
          <span className="text-xs ml-1 font-mono text-secondary group-hover:text-primary">
            Back
          </span>
        </button>
        <div className="flex flex-col p-4 bg-primary border border-primary rounded-sm">
          <h2 className="text-lg md:text-xl font-medium text-primary m-0 mb-1 font-sans">
            {decode(title)}
          </h2>
          <div className="flex items-center min-w-0 overflow-hidden">
            {domain && (
              <Tooltip.Root delayDuration={50}>
                <Tooltip.Trigger asChild>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mr-3 min-w-0 max-w-[128px] md:max-w-[200px] truncate font-normal mb-0.5 border-b hover:text-primary border-primary inline-block font-mono text-secondary mt-0.5 focus-visible:ring-1 focus-visible:ring-blue-500"
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
            <Meta
              time={time}
              points={points}
              user={user}
              isDetailedView
              comments={comments_count}
              url={url}
            />
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <p className="text-xs ml-0.5 text-secondary font-normal font-sans">
              by <span className="font-semibold text-primary">{user}</span>
            </p>
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
          {content && <InnerHTMLText content={content} isDescription />}
        </div>
        {commentsSection}
      </div>
    </Fragment>
  );
}