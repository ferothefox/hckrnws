type InnerHTMLTextProps = {
  content: string;
  isDescription?: boolean;
};

const baseClassName =
  "text-base font-sans [&>blockquote>p]:mb-0 [&>blockquote>p]:whitespace-pre-line [&>blockquote>p>a]:break-all [&>blockquote>p>a]:text-link [&>blockquote>p>a]:underline [&>p]:mb-1 [&>p]:whitespace-pre-line [&>p>a]:break-all [&>p>a]:text-link [&>p>a]:underline [&>pre]:my-2 [&>pre]:overflow-x-auto [&>pre]:rounded-sm [&>pre]:border [&>pre]:border-primary [&>pre]:bg-code [&>pre]:p-2 [&>pre]:whitespace-pre-line [&>pre>code]:font-mono [&>pre>code]:text-xs md:[&>pre>code]:text-sm";

export default function InnerHTMLText({
  content,
  isDescription = false,
}: InnerHTMLTextProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content,
      }}
      className={`${baseClassName} ${
        isDescription ? "text-secondary mt-3" : "text-primary"
      }`}
    />
  );
}
