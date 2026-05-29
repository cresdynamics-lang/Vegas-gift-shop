import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { type Product } from '../data/products';

interface ProductSectionProps {
  title: string;
  products: Product[];
  bgColor?: string;
}

const ProductSection = ({ title, products, bgColor = 'bg-white' }: ProductSectionProps) => {
  const addItem = useCartStore((state) => state.addItem);

  if (!products || products.length === 0) return null;

  return (
    <section className={`py-12 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white border border-gray-100 rounded-lg p-4 hover:shadow-lg transition-all">
              <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden rounded-md mb-4 block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isSale && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </span>
                )}
              </Link>
              
              <Link to={`/product/${product.id}`} className="flex-1">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-red-600">KShs {product.price.toLocaleString()}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">KShs {product.oldPrice.toLocaleString()}</span>
                  )}
                </div>
                
                <button
                  onClick={() => addItem(product)}
                  className="w-full bg-black text-white py-2 rounded font-bold text-sm hover:bg-red-600 transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;