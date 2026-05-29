import prisma from "./lib/prisma";
import { products, categories } from "./data/products";

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    const cleanCatName = cat.name.replace(/[^\x00-\x7F]/g, '');
    const cleanIcon = cat.icon ? cat.icon.replace(/[^\x00-\x7F]/g, '') : '';
    await prisma.category.upsert({
      where: { name: cleanCatName },
      update: { icon: cleanIcon },
      create: { name: cleanCatName, icon: cleanIcon },
    });
  }

  console.log('Seeding products...');
  for (const prod of products) {
    const cleanCatName = prod.category.replace(/[^\x00-\x7F]/g, '');
    const category = await prisma.category.findUnique({
      where: { name: cleanCatName }
    });

    if (category) {
      const cleanName = prod.name.replace(/[^\x00-\x7F]/g, '');
      const cleanDesc = (prod.description || '').replace(/[^\x00-\x7F]/g, '');
      
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {
          name: cleanName,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviews,
          image: prod.image,
          isSale: prod.isSale || false,
          isNew: prod.isNew || false,
          description: cleanDesc,
          categoryId: category.id
        },
        create: {
          id: prod.id,
          name: cleanName,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviews,
          image: prod.image,
          isSale: prod.isSale || false,
          isNew: prod.isNew || false,
          description: cleanDesc,
          categoryId: category.id,
          stock: 100
        }
      });
    } else {
      // Create category if it doesn't exist
      const newCat = await prisma.category.create({
        data: { name: cleanCatName }
      });
      
      const cleanName = prod.name.replace(/[^\x00-\x7F]/g, '');
      const cleanDesc = (prod.description || '').replace(/[^\x00-\x7F]/g, '');
      
      await prisma.product.upsert({
        where: { id: prod.id },
        update: {
          name: cleanName,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviews,
          image: prod.image,
          isSale: prod.isSale || false,
          isNew: prod.isNew || false,
          description: cleanDesc,
          categoryId: newCat.id
        },
        create: {
          id: prod.id,
          name: cleanName,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviews,
          image: prod.image,
          isSale: prod.isSale || false,
          isNew: prod.isNew || false,
          description: cleanDesc,
          categoryId: newCat.id,
          stock: 100
        }
      });
    }
  }

  console.log('Seeding admin user...');
  await prisma.user.upsert({
    where: { email: 'admin@vegasgifts.co.ke' },
    update: {},
    create: {
      email: 'admin@vegasgifts.co.ke',
      password: 'admin_password_2026', // In a real app, this would be hashed
      name: 'Vegas Admin',
      role: 'SUPER_ADMIN'
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
