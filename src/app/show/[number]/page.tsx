"use client";

import { useParams, useRouter } from "next/navigation";
import { TBaseStory } from "~/types/story";
import StoryListItem from "~/components/StoryListItem";
import { useEffect, useState } from "react";
import Pagination from "~/components/Common/Pagination";
import { CenteredText } from "~/components/Common/Fragments";

export default function ShowStoriesPage() {
  const params = useParams();
  const router = useRouter();
  const number = params.number as string;
  const [data, setData] = useState<TBaseStory[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchStories() {
      try {
        const BASE_URL = "https://api.hnpwa.com/v0/show";
        const fetchUrl = `${BASE_URL}/${number}.json`;
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          setError(true);
          return;
        }
        
        const storiesData = await response.json();
        setData(storiesData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [number]);

  if (error) return <CenteredText>Oops! Something went wrong :(</CenteredText>;
  if (loading || !data) return <CenteredText>Loading...</CenteredText>;

  const handlePageChange = (page: number) => {
    router.push(`/show/${page}`);
  };

  return (
    <div className="flex-1">
      {data.map((story) => (
        <StoryListItem story={story} key={story.id} />
      ))}
      <Pagination
        currentPage={parseInt(number)}
        onChangePage={handlePageChange}
        totalPages={2}
      />
    </div>
  );
}