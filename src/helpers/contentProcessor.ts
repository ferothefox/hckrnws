export function processContent(htmlContent: string): string {
  if (!htmlContent) {
    return "";
  }

  const quoteParagraphPattern = /<p([^>]*)>\s*(?:&gt;|>)\s*([\s\S]*?)<\/p>/gi;

  if (!quoteParagraphPattern.test(htmlContent)) {
    return htmlContent;
  }

  quoteParagraphPattern.lastIndex = 0;

  return htmlContent.replace(
    quoteParagraphPattern,
    (_, attributes, content) => {
      const normalizedContent = content.trim();
      const paragraphAttributes = attributes ?? "";

      return `<blockquote class="quotes"><p${paragraphAttributes}>${normalizedContent}</p></blockquote>`;
    },
  );
}
