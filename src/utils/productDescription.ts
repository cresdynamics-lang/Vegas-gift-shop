import type { ProductPackageSection, ProductDescriptionContent } from '../types/product';
import { formatDisplayMultiline, formatDisplayText } from './formatText';

const SECTION_DEFS: { title: string; patterns: RegExp[] }[] = [
  {
    title: "What's included",
    patterns: [
      /^what'?s included:?/im,
      /^set includes:?/im,
      /^gift set includes:?/im,
      /^this set includes:?/im,
      /^package includes:?/im,
      /^items included:?/im,
    ],
  },
  {
    title: 'Features',
    patterns: [/^key features:?/im, /^features:?/im],
  },
  {
    title: "Why you'll love it",
    patterns: [/^why you(?:'|')?ll love it:?/im, /^why choose this:?/im],
  },
  {
    title: 'Perfect for',
    patterns: [/^perfect for:?/im, /^ideal for:?/im],
  },
];

function normalizeText(input: string): string {
  return input
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function htmlToPlainText(html: string): string {
  if (!html) return '';
  return normalizeText(
    formatDisplayMultiline(
      html
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n- ')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
    )
  );
}

function extractListItems(block: string): string[] {
  const items: string[] = [];
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const bullet = line.match(/^[-•*–]\s*(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet) {
      items.push(bullet[1].trim());
      continue;
    }
    if (numbered) {
      items.push(numbered[1].trim());
      continue;
    }
    if (/^features?:?$/i.test(line) || /^perfect for:?$/i.test(line) || /^set includes:?$/i.test(line)) {
      continue;
    }
    if (line.length > 2 && !line.endsWith(':')) {
      items.push(line);
    }
  }

  return [...new Set(items.map((i) => i.replace(/\s+/g, ' ').trim()).filter((i) => i.length > 2))];
}

export function parseProductDescription(raw: string): ProductDescriptionContent {
  const text = normalizeText(raw);
  if (!text) return { intro: '', sections: [] };

  const markers: { index: number; title: string; len: number }[] = [];

  for (const def of SECTION_DEFS) {
    for (const pattern of def.patterns) {
      const match = pattern.exec(text);
      if (match && match.index !== undefined) {
        markers.push({ index: match.index, title: def.title, len: match[0].length });
        break;
      }
    }
  }

  markers.sort((a, b) => a.index - b.index);

  if (markers.length === 0) {
    return { intro: text, sections: [] };
  }

  const intro = text.slice(0, markers[0].index).trim();
  const sections: ProductPackageSection[] = [];

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index + markers[i].len;
    const end = markers[i + 1]?.index ?? text.length;
    const body = text.slice(start, end).trim();
    const items = extractListItems(body);
    if (items.length > 0) {
      sections.push({ title: markers[i].title, items });
    }
  }

  return { intro: intro || text, sections };
}

export function getProductDescriptionContent(product: {
  description: string;
  packageSections?: ProductPackageSection[];
}): ProductDescriptionContent {
  if (product.packageSections && product.packageSections.length > 0) {
    const hasIntro =
      product.description &&
      !product.packageSections.some((s) => product.description.includes(s.title));
    const introRaw = hasIntro
      ? product.description
      : product.description.split(/\n\nSet Includes/i)[0]?.trim() || product.description;
    return {
      intro: formatDisplayMultiline(introRaw),
      sections: product.packageSections.map((s) => ({
        title: formatDisplayText(s.title),
        items: s.items.map((item) => formatDisplayText(item)),
      })),
    };
  }
  return parseProductDescription(product.description);
}

export const DEFAULT_PACKAGE_SECTION_TITLES = [
  "What's included",
  'Features',
  "Why you'll love it",
  'Perfect for',
];
