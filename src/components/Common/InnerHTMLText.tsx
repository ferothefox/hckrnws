"use client";

import { useMemo } from "react";
import { processContent } from "~/helpers/contentProcessor";

interface IProps {
  content: string;
  isDescription?: boolean;
}

const InnerHTMLText = ({ content, isDescription = false }: IProps) => {
  const processedContent = useMemo(() => {
    return processContent(content);
  }, [content]);

  const className = useMemo(
    () =>
      `text-base font-sans [&>p]:mb-1 [&>p]:whitespace-pre-line [&>p>a]:break-all [&>p>a]:underline [&>p>a]:text-link [&>pre]:whitespace-pre-line [&>pre]:p-2 [&>pre]:bg-code [&>pre]:rounded-sm [&>pre]:my-2 [&>pre]:overflow-x-auto [&>pre]:border [&>pre]:border-primary [&>pre>code]:font-mono [&>pre>code]:text-xs md:[&>pre>code]:text-sm ${
        isDescription ? "text-secondary mt-3" : "text-primary"
      }`,
    [isDescription],
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: processedContent,
      }}
      className={className}
    />
  );
};

export default InnerHTMLText;
