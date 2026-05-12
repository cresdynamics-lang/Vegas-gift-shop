import prisma from "./lib/prisma";

const categories = [
  { name: 'Men Gifts', icon: '👨' },
  { name: 'Women Gifts', icon: '👩' },
  { name: 'Corporate Gifts', icon: '💼' },
  { name: 'Awards & Trophies', icon: '🏆' },
  { name: 'Drinkware', icon: '☕' },
  { name: 'Stationery Gifts', icon: '📝' },
  { name: 'Tech Gifts', icon: '📱' },
  { name: 'Personalized Gifts', icon: '✨' },
  { name: 'Watches Gifts', icon: '⌚' }
];

const products = [
  {
    name: 'Golden Prestige Velvet Award Plaque',
    price: 4500,
    oldPrice: 5500,
    rating: 5,
    reviewCount: 24,
    image: '/src/assets/hero.png',
    categoryName: 'Awards & Trophies',
    isSale: true,
    description: 'A premium velvet-lined award plaque for high-level recognition and corporate prestige.',
    stock: 15
  },
  {
    name: 'Custom Crystal Award on Black Base',
    price: 3800,
    rating: 5,
    reviewCount: 18,
    image: '/src/assets/gifts for men 1.jpg',
    categoryName: 'Awards & Trophies',
    description: 'Elegant custom crystal award with a deep black base for a modern, sophisticated look.',
    stock: 20
  },
  {
    name: 'Smart LED Temperature Display Thermal Flask',
    price: 1800,
    oldPrice: 2200,
    rating: 4,
    reviewCount: 56,
    image: '/src/assets/mug gift 2.jpg',
    categoryName: 'Drinkware',
    isSale: true,
    description: 'Modern thermal flask featuring an LED display that shows the internal temperature of your beverage.',
    stock: 45
  },
  {
    name: 'Luxury Ladies Jewelry & Watch Gift Set',
    price: 9500,
    rating: 5,
    reviewCount: 38,
    image: '/src/assets/gifts for women 6.jpg',
    categoryName: 'Watches Gifts',
    isNew: true,
    description: 'An exquisite gift set featuring a luxury watch paired with matching fine jewelry.',
    stock: 10
  }
];

async function main() {
  console.log('Seeding categories...');
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  console.log('Seeding products...');
  for (const prod of products) {
    const category = await prisma.category.findUnique({
      where: { name: prod.categoryName }
    });

    if (category) {
      const { categoryName, ...productData } = prod;
      await prisma.product.create({
        data: {
          ...productData,
          categoryId: category.id
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
