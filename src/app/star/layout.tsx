import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Starred",
};

export default function StarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}