import { Link } from 'react-router-dom';

const categories = [
  { name: 'Men', image: '/products/product_2.jpeg', href: '/shop?category=Men Gifts' },
  { name: 'Women', image: '/products/product_9.jpg', href: '/shop?category=Women Gifts' },
  { name: 'Cards', image: '/products/product_15.jpeg', href: '/shop?category=Cards' },
  { name: 'Trophies', image: '/products/product_3.jpeg', href: '/shop?category=Awards & Trophies' },
  { name: 'Corporate Gifts', image: '/products/product_4.jpeg', href: '/shop?category=Corporate Gifts' },
  { name: 'Promotional Gifts', image: '/products/product_5.jpeg', href: '/shop?category=Promotional Gifts' },
  { name: 'Personalized Gifts', image: '/products/product_10.jpeg', href: '/shop?category=Personalized Gifts' },
  { name: 'Watches Gifts', image: '/products/product_16.jpeg', href: '/shop?category=Watches Gifts' },
];

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {categories.map((cat) => (
        <Link key={cat.name} to={cat.href} className="group flex flex-col items-center">
          <div className="w-full aspect-square rounded-full overflow-hidden mb-3 border-2 border-gray-100 group-hover:border-red-600 transition-all p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
              <img 
                src={cat.image} 
                alt={cat.name} 
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
