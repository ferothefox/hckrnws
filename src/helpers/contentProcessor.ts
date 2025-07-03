/**
 * Pre-processes HTML content to style quote blocks consistently
 * Replaces paragraphs starting with ">" with properly styled paragraphs
 * Works identically in both server and client environments
 */
export function processContent(htmlContent: string): string {
  if (!htmlContent) return "";

  // Convert HTML entities for > character to actual > character for consistent processing
  let processedContent = htmlContent.replace(/&gt;/g, ">");
  
  // Simple pattern to match paragraphs that start with ">" (with optional whitespace)
  // This catches: <p>> content</p>, <p> > content</p>, etc.
  const quotePattern = /<p([^>]*)>\s*>\s*(.*?)<\/p>/g;
  
  // Process the content by adding quotes class to quote paragraphs
  processedContent = processedContent.replace(quotePattern, (_, attributes, content) => {
    // Clean up the content and add quotes styling
    const cleanContent = content.trim();
    return `<p${attributes} class="quotes">${cleanContent}</p>`;
  });
  
  return processedContent;
}
