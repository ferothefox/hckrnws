/**
 * Pre-processes HTML content to style quote blocks without post-render DOM manipulation
 * Replaces paragraphs starting with ">" with properly styled paragraphs
 * Works in both server and client environments
 */
export function processContent(htmlContent: string): string {
  if (!htmlContent) return "";

  // The isomorphic approach using regex that works in both server and client
  // This regex pattern more accurately finds paragraphs with ">" at the beginning
  
  // Convert HTML entities for > character to actual > character for consistent processing
  const normalizedContent = htmlContent.replace(/&gt;/g, ">");
  
  // First pattern: <p>> content</p> or <p> > content</p> (with potential whitespace)
  const quotePattern1 = /<p[^>]*>\s*(>)\s*([\s\S]*?)<\/p>/g;
  
  // Process the content
  let processedContent = normalizedContent.replace(quotePattern1, (match, prefix, content) => {
    return `<p class="quotes">${content.trim()}</p>`;
  });
  
  // Browser-only DOM processing (only runs on client)
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      // Check if there are still unprocessed quotes after regex processing
      // This runs only on the client to catch any edge cases the regex missed
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = processedContent;
      
      const paragraphs = tempDiv.querySelectorAll("p");
      let hasChanges = false;
      
      paragraphs.forEach(p => {
        const text = p.textContent || "";
        if (text.trim().startsWith(">")) {
          p.classList.add("quotes");
          p.textContent = text.substring(text.indexOf(">") + 1).trim();
          hasChanges = true;
        }
      });
      
      // Only update processed content if changes were made
      if (hasChanges) {
        processedContent = tempDiv.innerHTML;
      }
    } catch (error) {
      console.error("Error in client-side content processing:", error);
    }
  }
  
  return processedContent;
}
