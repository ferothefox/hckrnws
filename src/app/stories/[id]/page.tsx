import { Metadata } from "next";
import { baseUrl } from "~/config/seo";
import { decode } from "html-entities";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import Meta from "~/components/Common/Meta";
import CommentList from "~/components/Comments/CommentList";
import InnerHTMLText from "~/components/Common/InnerHTMLText";
import { Tooltip } from "radix-ui";
import StoryActions from "./story-actions";

type Props = {
  params: Promise<{ id: string }>;
};

async function getStory(id: string) {
  const ITEM_BASE_URL = "https://api.hnpwa.com/v0/item";
  const fetchUrl = `${ITEM_BASE_URL}/${id}.json`;
  
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getStory(id);
  
  if (!data) {
    return {
      title: "Story not found",
    };
  }

  const { title, content, url } = data;
  const pageTitle = `${decode(title)} - hckrnws`;
  const canonicalUrl = `${baseUrl}/stories/${id}`;
  
  const description = content
    ? decode(
        content
          .replace(/<[^>]+>/g, "")
          .replace(/\\s+/g, " ")
          .trim()
      ).slice(0, 160)
    : `Discussion of ${url} on Hacker News`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "hckrnws",
      images: [
        {
          url: "/img/og/default.png",
          alt: "hckrnws",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const data = await getStory(id);

  if (!data) {
    notFound();
  }

  const {
    title,
    points,
    user,
    time,
    content,
    domain,
    comments_count,
    comments,
  } = data;
  
  let { url } = data;

  if (url.startsWith("item?id=")) {
    url = url.replace("item?id=", "");
  }

  const story = {
    id: data.id,
    title: data.title,
    points: data.points,
    user: data.user,
    time: data.time,
    url: url,
    domain: data.domain,
    comments_count: data.comments_count,
  };

  return (
    <Fragment>
      <div className="flex flex-col flex-1 mb-8">
        <StoryActions story={story} />
        
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
          </div>
          {content && <InnerHTMLText content={content} isDescription />}
        </div>
        
        <CommentList comments={comments} op={user} />
      </div>
    </Fragment>
  );
}