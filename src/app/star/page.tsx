import type { Metadata } from "next";
import StarredStories from "@/components/StarredStories";

export const metadata: Metadata = {
  title: "Starred",
};

export default function StarPage() {
  return <StarredStories />;
}
