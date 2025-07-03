import { TBaseStory } from "~/types/story";
import StoryListItem from "~/components/StoryListItem";
import Pagination from "~/components/Common/Pagination";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ number: string }>;
};

async function getNewStories(pageNumber: string): Promise<TBaseStory[]> {
  const BASE_URL = "https://api.hnpwa.com/v0/newest";
  const fetchUrl = `${BASE_URL}/${pageNumber}.json`;
  
  const response = await fetch(fetchUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch new stories: ${response.status}`);
  }
  
  return response.json();
}

export default async function NewStoriesPage({ params }: Props) {
  const { number } = await params;
  const data = await getNewStories(number);

  if (!data || data.length === 0) {
    notFound();
  }

  return (
    <div className="flex-1">
      {data.map((story) => (
        <StoryListItem story={story} key={story.id} />
      ))}
      <Pagination
        currentPage={parseInt(number)}
        totalPages={10}
        basePath="/new"
      />
    </div>
  );
}