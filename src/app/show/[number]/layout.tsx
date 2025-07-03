import { Metadata } from "next";

type Props = {
  params: Promise<{ number: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  return {
    title: `Show HN - Page ${number}`,
  };
}

export default function ShowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}