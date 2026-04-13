"use client";

import { processContent } from "@/helpers/contentProcessor";
type InnerHTMLTextProps = {
  content: string;
  isDescription?: boolean;
};

const baseClassName =
  "text-base font-sans [&>p]:mb-1 [&>p]:whitespace-pre-line [&>p>a]:break-all [&>p>a]:underline [&>p>a]:text-link [&>pre]:whitespace-pre-line [&>pre]:p-2 [&>pre]:bg-code [&>pre]:rounded-sm [&>pre]:my-2 [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-primary [&>pre>code]:font-mono [&>pre>code]:text-xs md:[&>pre>code]:text-sm";

export default function InnerHTMLText({
  content,
  isDescription = false,
}: InnerHTMLTextProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: processContent(content),
      }}
      className={`${baseClassName} ${
        isDescription ? "text-secondary mt-3" : "text-primary"
      }`}
    />
  );
}
