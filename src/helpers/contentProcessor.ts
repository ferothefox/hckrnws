/**
 * Pre-processes HTML content to style quote blocks without post-render DOM manipulation
 * Replaces paragraphs starting with ">" with properly styled paragraphs
 * Works in both server and client environments
 */
export function processContent(htmlContent: string): string {
  if (!htmlContent) {
    return "";
  }

  const normalizedContent = htmlContent.replace(/&gt;/g, ">");
  const quotePattern1 = /<p[^>]*>\s*(>)\s*([\s\S]*?)<\/p>/g;

  return normalizedContent.replace(quotePattern1, (_, __, content) => {
    return `<p class="quotes">${content.trim()}</p>`;
  });
}
