import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageProps } from "~/types/story";
import StoryListItem from "~/components/StoryListItem";
import Head from "next/head";
import { Fragment } from "react";
import { useRouter } from "next/router";
import Pagination from "~/components/Common/Pagination";
import { CenteredText } from "~/components/Common/Fragments";

const TopStoriesList: NextPage<PageProps> = (props: PageProps) => {
  const router = useRouter();
  const { number } = router.query;
  const { data, errorCode } = props;

  if (errorCode)
    return <CenteredText>Oops! Something went wrong :(</CenteredText>;

  if (!data) return <CenteredText>Loading...</CenteredText>;

  const handlePageChange = (page: number) => {
    void router.push(`/top/${page}`);
  };

  const title = `Top HN - Page ${number}`;

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
        />
      </div>
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const number = params?.number || 1;

  const TOP_BASE_URL = "https://api.hnpwa.com/v0/news";
  const fetchUrl = `${TOP_BASE_URL}/${number}.json`;

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
  const paths = [...Array(10)].map((x, idx) => ({
    params: { number: (idx + 1).toString() },
  }));

  return { paths, fallback: "blocking" };
};

export default TopStoriesList;
