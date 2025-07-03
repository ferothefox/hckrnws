import { Fragment } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "~/icons";

type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  basePath: string;
};

const Pagination = ({
  currentPage,
  totalPages = 10,
  basePath,
}: PaginationProps) => {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;
  
  return (
    <Fragment>
      <div className="flex justify-center items-center mt-8 mb-1 rounded-full">
        {isPrevDisabled ? (
          <div className="px-4 py-2 rounded-l-full flex items-center border-r border-primary justify-start bg-tertiary w-20 opacity-40 cursor-not-allowed">
            <ArrowLeftIcon className="h-4 w-4 text-icon" />
            <span className="text-sm font-normal font-sans text-secondary ml-1">
              Prev
            </span>
          </div>
        ) : (
          <Link
            href={`${basePath}/${currentPage - 1}`}
            className="px-4 py-2 rounded-l-full flex items-center border-r border-primary justify-start bg-tertiary group hover:bg-btn w-20 focus-visible:ring-1 focus-visible:ring-blue-500"
          >
            <ArrowLeftIcon className="h-4 w-4 text-icon group-hover:text-btn" />
            <span className="text-sm font-normal font-sans text-secondary group-hover:text-btn ml-1">
              Prev
            </span>
          </Link>
        )}
        
        {isNextDisabled ? (
          <div className="px-4 py-2 rounded-r-full flex items-center justify-end bg-tertiary w-20 opacity-40 cursor-not-allowed">
            <span className="text-sm font-normal font-sans text-secondary mr-1">
              Next
            </span>
            <ArrowRightIcon className="h-4 w-4 text-icon" />
          </div>
        ) : (
          <Link
            href={`${basePath}/${currentPage + 1}`}
            className="px-4 py-2 rounded-r-full flex items-center justify-end bg-tertiary group hover:bg-btn w-20 focus-visible:ring-1 focus-visible:ring-blue-500"
          >
            <span className="text-sm font-normal font-sans text-secondary group-hover:text-btn mr-1">
              Next
            </span>
            <ArrowRightIcon className="h-4 w-4 text-icon group-hover:text-btn" />
          </Link>
        )}
      </div>
      <p className="text-center text-secondary text-sm mb-3 font-sans">
        Page {currentPage} of {totalPages}
      </p>
    </Fragment>
  );
};

export default Pagination;
