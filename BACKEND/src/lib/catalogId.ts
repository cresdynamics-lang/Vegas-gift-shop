/** Canonical catalog / Merchant Center / Meta product id (slug, no variant suffix). */
export function getCatalogProductId(id: string | number): string {
  return String(id).split('__')[0];
}
