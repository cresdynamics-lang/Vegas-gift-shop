import prisma from './prisma';

export type StorefrontProductPayload = {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  packageSections?: unknown;
  attributes?: unknown;
  features?: string[];
  enableCustomization?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
};

function cleanAscii(value: string): string {
  return value.replace(/[^\x00-\x7F]/g, '');
}

export async function upsertStorefrontProduct(payload: StorefrontProductPayload) {
  const categoryName = cleanAscii(payload.category);
  let category = await prisma.category.findFirst({
    where: { name: { equals: categoryName, mode: 'insensitive' } },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name: categoryName },
    });
  }

  const data = {
    name: cleanAscii(payload.name),
    description: cleanAscii(payload.description || ''),
    shortDescription: payload.shortDescription
      ? cleanAscii(payload.shortDescription)
      : null,
    price: payload.price,
    oldPrice: payload.oldPrice ?? null,
    rating: payload.rating ?? 0,
    reviewCount: payload.reviews ?? 0,
    image: payload.image,
    images: payload.images ?? undefined,
    packageSections: payload.packageSections ?? undefined,
    attributes: payload.attributes ?? undefined,
    enableCustomization: payload.enableCustomization !== false,
    isSale: payload.isSale ?? false,
    isNew: payload.isNew ?? false,
    categoryId: category.id,
    features: payload.features ?? [],
  };

  return prisma.product.upsert({
    where: { id: payload.id },
    update: data,
    create: { id: payload.id, ...data, stock: 100 },
    include: { category: true },
  });
}
