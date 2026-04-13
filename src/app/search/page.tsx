import type { Metadata } from "next";
import SearchForm from "@/components/Common/SearchInput";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return <SearchForm />;
}
