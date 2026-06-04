import prisma from './prisma';

export type CatalogFeedItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  availability: 'in stock' | 'out of stock';
  condition: 'new';
  price: string;
  brand: string;
  googleProductCategory?: string;
};

function siteBaseUrl(): string {
  const base = (process.env.PUBLIC_SITE_URL || process.env.SITE_URL || 'https://vegasgifts.co.ke').replace(
    /\/$/,
    ''
  );
  return base;
}

function absoluteImageUrl(imagePath: string): string {
  const base = siteBaseUrl();
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${base}${encodeURI(path)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3)}...`;
}

export async function loadCatalogFeedItems(): Promise<CatalogFeedItem[]> {
  const brand = process.env.STORE_BRAND_NAME || 'Vegas Gift Shop';
  const base = siteBaseUrl();

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { updatedAt: 'desc' },
  });

  return products.map((p) => {
    const description = truncate(
      stripHtml(p.shortDescription || p.description || p.name),
      5000
    );
    const priceValue = p.oldPrice && p.isSale ? p.price : p.price;

    return {
      id: p.id,
      title: p.name,
      description,
      link: `${base}/product/${encodeURIComponent(p.id)}`,
      imageLink: absoluteImageUrl(p.image),
      availability: p.stock > 0 ? 'in stock' : 'out of stock',
      condition: 'new' as const,
      price: `${priceValue.toFixed(2)} KES`,
      brand,
      googleProductCategory: p.category?.name,
    };
  });
}

export function buildGoogleMerchantXml(items: CatalogFeedItem[]): string {
  const channelTitle = process.env.STORE_BRAND_NAME || 'Vegas Gift Shop';
  const base = siteBaseUrl();

  const itemXml = items
    .map((item) => {
      const extraCategory = item.googleProductCategory
        ? `\n      <g:product_type>${escapeXml(item.googleProductCategory)}</g:product_type>`
        : '';
      return `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>${item.availability}</g:availability>
      <g:condition>${item.condition}</g:condition>
      <g:price>${escapeXml(item.price)}</g:price>
      <g:brand>${escapeXml(item.brand)}</g:brand>${extraCategory}
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(channelTitle)} product feed for Google Merchant Center</description>
${itemXml}
  </channel>
</rss>`;
}

export function buildMetaCatalogCsv(items: CatalogFeedItem[]): string {
  const header =
    'id,title,description,availability,condition,price,link,image_link,brand';
  const rows = items.map((item) => {
    const cols = [
      item.id,
      item.title.replace(/"/g, '""'),
      item.description.replace(/"/g, '""'),
      item.availability,
      item.condition,
      item.price,
      item.link,
      item.imageLink,
      item.brand,
    ];
    return cols.map((c) => `"${c}"`).join(',');
  });
  return [header, ...rows].join('\n');
}

export function buildCatalogJson(items: CatalogFeedItem[]) {
  return {
    generatedAt: new Date().toISOString(),
    currency: 'KES',
    itemCount: items.length,
    products: items,
  };
}
