/** Decode common HTML entities from imported catalog text. */
function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, code) => {
      const n = parseInt(code, 10);
      return Number.isNaN(n) ? '' : String.fromCharCode(n);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, ' ');
}

/**
 * Clean text for display: decode entities, replace underscores with spaces,
 * strip em dashes, fix stray punctuation from imports.
 */
export function formatDisplayText(input: string): string {
  if (!input) return '';

  let text = decodeHtmlEntities(input);

  text = text
    .replace(/\s*—\s*/g, ', ')
    .replace(/—/g, ', ')
    .replace(/\s*–\s*/g, '-')
    .replace(/–/g, '-')
    .replace(/__+/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\(\s*_+\s*\)/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+-\s+-/g, ' - ')
    .replace(/\n\s*-\s*\n/g, '\n')
    .replace(/^\s*-\s+/gm, '')
    .replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/** Multi-line product descriptions: preserve paragraphs after cleanup. */
export function formatDisplayMultiline(input: string): string {
  if (!input) return '';
  return decodeHtmlEntities(input)
    .replace(/\s*—\s*/g, ', ')
    .replace(/—/g, ', ')
    .replace(/\s*–\s*/g, '-')
    .replace(/–/g, '-')
    .replace(/__+/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\(\s*_+\s*\)/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
