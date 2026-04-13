import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/icons";

type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  basePath: `/${string}`;
};

export default function Pagination({
  currentPage,
  totalPages = 10,
  basePath,
}: PaginationProps) {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;
  const previousPageHref = `${basePath}/${currentPage - 1}`;
  const nextPageHref = `${basePath}/${currentPage + 1}`;

  return (
    <nav className="mt-8 mb-3" aria-label="Story list pagination">
      <div className="mb-1 flex items-center justify-center rounded-full">
        {isPrevDisabled ? (
          <span
            className="border-primary bg-tertiary flex w-20 cursor-not-allowed items-center justify-start rounded-l-full border-r px-4 py-2 opacity-40"
            aria-disabled="true"
          >
            <ArrowLeftIcon className="text-icon h-4 w-4" />
            <span className="text-secondary ml-1 font-sans text-sm font-normal">
              Prev
            </span>
          </span>
        ) : (
          <Link
            href={previousPageHref}
            className="border-primary bg-tertiary group hover:bg-btn flex w-20 items-center justify-start rounded-l-full border-r px-4 py-2 focus-visible:ring-1 focus-visible:ring-blue-500"
          >
            <ArrowLeftIcon className="text-icon group-hover:text-btn h-4 w-4" />
            <span className="text-secondary group-hover:text-btn ml-1 font-sans text-sm font-normal">
              Prev
            </span>
          </Link>
        )}
        {isNextDisabled ? (
          <span className="bg-tertiary flex w-20 cursor-not-allowed items-center justify-end rounded-r-full px-4 py-2 opacity-40">
            <span className="text-secondary mr-1 font-sans text-sm font-normal">
              Next
            </span>
            <ArrowRightIcon className="text-icon h-4 w-4" />
          </span>
        ) : (
          <Link
            href={nextPageHref}
            className="bg-tertiary group hover:bg-btn flex w-20 items-center justify-end rounded-r-full px-4 py-2 focus-visible:ring-1 focus-visible:ring-blue-500"
          >
            <span className="text-secondary group-hover:text-btn mr-1 font-sans text-sm font-normal">
              Next
            </span>
            <ArrowRightIcon className="text-icon group-hover:text-btn h-4 w-4" />
          </Link>
        )}
      </div>
      <p className="text-secondary text-center font-sans text-sm">
        Page {currentPage} of {totalPages}
      </p>
    </nav>
  );
}
