import { GetServerSideProps, NextPage } from "next";

import { useRouter } from "next/router";
import { TDetailedStory } from "~/types/story";
import { Fragment, useEffect, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Meta from "~/components/Common/Meta";
import CommentList from "~/components/Comments/CommentList";
import { BackIcon, StarIcon } from "~/icons";
import useStore from "~/store/useStore";
import { decode } from "html-entities";
import InnerHTMLText from "~/components/Common/InnerHTMLText";

type Props = {
  data: TDetailedStory;
  errorCode: false | number;
};

const Story: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { data } = props;
  const [isStoryStarred, setIsStoryStarred] = useState(false);

  const starStory = useStore((state) => state.starStory);
  const starred = useStore((state) => state.starred);

  const {
    title,
    id,
    points,
    user,
    time,
    content,
    comments,
    domain,
    comments_count,
  } = data;
  let { url } = data;

  const onClickBack = useCallback(() => {
    router.back();
  }, [router]);

  if (url.startsWith("item?id=")) {
    url = url.replace("item?id=", "");
  }

  const story = useMemo(
    () => ({
      id,
      title,
      points,
      user,
      time,
      url,
      domain,
      comments_count: comments_count,
    }),
    [id, title, points, user, time, url, domain, comments_count],
  );

  const handleStar = useCallback(() => {
    // save them to the zustand store, which in turn will save to local storage
    const isStoryStarred = starred?.some((story) => story.id === id);
    if (isStoryStarred) {
      const filteredStories = starred?.filter((story) => story.id !== id);
      starStory(filteredStories);
    } else {
      starStory([...starred, story]);
    }
  }, [starred, story, id, starStory]);

  useEffect(() => {
    setIsStoryStarred(starred?.some((story) => story.id === id));
  }, [starred, id]);

  const pageTitle = useMemo(() => `${decode(title)} - hckrnws`, [title]);

  const commentsSection = useMemo(
    () => <CommentList comments={comments} op={user} />,
    [comments, user],
  );

  return (
    <Fragment>
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
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
          <div className="flex items-center">
            {domain && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs mr-3  max-w-[128px] md:max-w-full truncate md:whitespace-normal md:overflow-visible font-normal mb-0.5 border-b hover:text-primary border-primary w-fit font-mono text-secondary mt-0.5"
              >
                ({domain})
              </a>
            )}
            <Meta
              time={time}
              points={points}
              user={user}
              isDetailedView
              comments={comments_count} // Use comments_count instead of comments.length
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
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  const ITEM_BASE_URL = "https://api.hnpwa.com/v0/item";

  const fetchUrl = `${ITEM_BASE_URL}/${id}.json`;

  const response = await fetch(fetchUrl);
  const errorCode = response.ok ? false : response.status;
  const data = errorCode === false ? await response.json() : [];

  return {
    props: {
      errorCode,
      data,
    },
  };
};

export default Story;
