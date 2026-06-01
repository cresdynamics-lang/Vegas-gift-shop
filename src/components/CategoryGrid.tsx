import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const categories = [
  { name: 'Men', image: '/products/product_2.jpeg', href: '/shop?category=Men%20Gifts' },
  { name: 'Women', image: '/products/product_9.jpg', href: '/shop?category=Women%20Gifts' },
  { name: 'Cards', image: '/products/product_15.jpeg', href: '/shop?category=Cards' },
  { name: 'Trophies', image: '/products/product_3.jpeg', href: '/shop?category=Awards%20%26%20Trophies' },
  { name: 'Corporate', image: '/products/product_4.jpeg', href: '/shop?category=Corporate%20Gifts' },
  { name: 'Promotional', image: '/products/product_5.jpeg', href: '/shop?category=Promotional%20Gifts' },
  { name: 'Personalized', image: '/products/product_10.jpeg', href: '/shop?category=Personalized%20Gifts' },
  { name: 'Watches', image: '/products/product_16.jpeg', href: '/shop?category=Watches%20Gifts' },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((cat, index) => (
        <Link key={cat.name} to={cat.href} className="group flex flex-col items-center">
          <div className="w-full aspect-square rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover:border-red-600 transition-all p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
              <OptimizedImage
                src={cat.image}
                alt={cat.name}
                priority={index < 4}
                sizes="96px"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
          <h3 className="font-bold text-gray-800 text-center text-sm group-hover:text-red-600 transition-colors">{cat.name}</h3>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
