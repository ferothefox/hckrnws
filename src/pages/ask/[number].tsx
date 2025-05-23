import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageProps } from "~/types/story";
import StoryListItem from "~/components/StoryListItem";
import Head from "next/head";
import { Fragment } from "react";
import { useRouter } from "next/router";
import Pagination from "~/components/Common/Pagination";
import { CenteredText } from "~/components/Common/Fragments";

const AskStoriesList: NextPage<PageProps> = (props: PageProps) => {
  const router = useRouter();
  const { number } = router.query;
  const { data, errorCode } = props;

  if (errorCode)
    return <CenteredText>Oops! Something went wrong :(</CenteredText>;

  if (!data) return <CenteredText>Loading...</CenteredText>;

  const handlePageChange = (page: number) => {
    router.push(`/ask/${page}`);
  };

  const title = `Ask HN - Page ${number}`;

  return (
    <Fragment>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="flex-1">
        {data.map((story) => (
          <StoryListItem story={story} key={story.id} />
        ))}
        <Pagination
          currentPage={parseInt(number as string)}
          onChangePage={handlePageChange}
          totalPages={1}
        />
      </div>
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const number = params?.number || 1;

  const BASE_URL = "https://api.hnpwa.com/v0/ask";
  const fetchUrl = `${BASE_URL}/${number}.json`;

  const response = await fetch(fetchUrl);
  const errorCode = response.ok ? false : response.status;
  // Only run the json if the error is not present
  const data = errorCode === false ? await response.json() : [];

  return {
    props: {
      errorCode,
      data,
    },

    revalidate: 3600, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [...Array(1)].map((x, idx) => ({
    params: { number: (idx + 1).toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default AskStoriesList;
