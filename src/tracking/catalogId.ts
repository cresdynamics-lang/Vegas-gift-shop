/** Must match Google Merchant `g:id` and Meta catalog `id` (storefront slug). */
export function getCatalogProductId(id: string | number): string {
  return String(id).split('__')[0];
}
