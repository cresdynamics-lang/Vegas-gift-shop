import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Phone,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { products } from '../data/products';
import { getProductDescriptionContent } from '../utils/productDescription';
import {
  getProductGallery,
  buildWhatsAppOrderUrl,
  buildWhatsAppShareUrl,
  getRelatedProducts,
} from '../utils/productDisplay';
import ProductWhatsAppOrder from '../components/ProductWhatsAppOrder';
import ProductDescription from '../components/ProductDescription';
import RelatedProducts from '../components/RelatedProducts';
import ProductImageZoom from '../components/ProductImageZoom';
import ProductReviews from '../components/ProductReviews';
import type { Product } from '../data/products';
import type { ProductPackageSection, ProductAttribute } from '../data/products';
import { API_URL } from '../config';
import { syncProductToBackend } from '../utils/syncProductToBackend';
import { formatDisplayText } from '../utils/formatText';
import {
  IMAGE_WIDTH,
  getProductImageUrl,
  preloadImage,
  preloadProductImages,
} from '../utils/imageUtils';
import { trackViewContent } from '../tracking';
import {
  RIO_DELIVERY_BULLETS,
  RIO_CUSTOMIZATION_FIELDS,
  DEFAULT_WHATSAPP,
  DEFAULT_ORDER_PHONE,
} from '../constants/rioProductDefaults';
import type { CartItemOptions } from '../store/useCartStore';

type TabId = 'description' | 'additional' | 'reviews';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const staticProduct = products.find((p) => p.id === id);
  const [apiOverlay, setApiOverlay] = useState<Record<string, unknown> | null>(null);
  const [reviewStats, setReviewStats] = useState({ rating: 0, reviewCount: 0 });

  const product = useMemo((): Product | undefined => {
    if (!staticProduct) return undefined;
    if (!apiOverlay) return staticProduct;
    const o = apiOverlay;
    return {
      ...staticProduct,
      name: (o.name as string) || staticProduct.name,
      description: (o.description as string) || staticProduct.description,
      shortDescription: (o.shortDescription as string | undefined) ?? staticProduct.shortDescription,
      price: typeof o.price === 'number' ? o.price : staticProduct.price,
      oldPrice: (o.oldPrice as number | undefined) ?? staticProduct.oldPrice,
      image: staticProduct.image,
      images: staticProduct.images ?? (o.images as string[] | undefined),
      packageSections:
        (o.packageSections as ProductPackageSection[] | undefined) ?? staticProduct.packageSections,
      attributes: (o.attributes as ProductAttribute[] | undefined) ?? staticProduct.attributes,
      enableCustomization:
        typeof o.enableCustomization === 'boolean'
          ? o.enableCustomization
          : staticProduct.enableCustomization,
      isSale: typeof o.isSale === 'boolean' ? o.isSale : staticProduct.isSale,
      isNew: typeof o.isNew === 'boolean' ? o.isNew : staticProduct.isNew,
      rating: reviewStats.rating || (o.rating as number) || staticProduct.rating,
      reviews: reviewStats.reviewCount || (o.reviewCount as number) || staticProduct.reviews,
    };
  }, [staticProduct, apiOverlay, reviewStats]);

  const gallery = useMemo(() => (product ? getProductGallery(product) : []), [product]);
  const relatedProducts = useMemo(
    () => (product ? getRelatedProducts(product, products) : []),
    [product]
  );
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [customization, setCustomization] = useState({
    giftWrapping: false,
    giftCard: false,
    engraving: false,
    cardInstructions: '',
    brandingInstructions: '',
  });
  const [orderPhone, setOrderPhone] = useState(DEFAULT_ORDER_PHONE);
  const [whatsappPhone, setWhatsappPhone] = useState(DEFAULT_WHATSAPP);
  const [storeName, setStoreName] = useState('Vegas Gift Shop');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    setActiveImage(0);
    if (product) {
      const urls = getProductGallery(product);
      preloadProductImages(urls, [IMAGE_WIDTH.detail, IMAGE_WIDTH.thumb]);
    }
    if (product?.attributes) {
      const initial: Record<string, string> = {};
      product.attributes.forEach((attr) => {
        if (attr.values[0]) initial[attr.name] = attr.values[0];
      });
      setSelectedAttributes(initial);
    } else {
      setSelectedAttributes({});
    }
  }, [product?.id]);

  useEffect(() => {
    const src = gallery[activeImage];
    if (src) {
      preloadImage(src, IMAGE_WIDTH.detail);
      preloadImage(src, IMAGE_WIDTH.thumb);
    }
  }, [activeImage, gallery]);

  const prefetchGalleryImage = (index: number) => {
    const src = gallery[index];
    if (src) preloadImage(src, IMAGE_WIDTH.detail);
  };

  useEffect(() => {
    if (!product) return;
    trackViewContent({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }, [product?.id, product?.price, product?.name]);

  useEffect(() => {
    fetch(`${API_URL}/api/settings/public`)
      .then((r) => r.json())
      .then((s) => {
        const p = s?.general?.phoneSecondary?.replace(/\D/g, '') || s?.general?.phone?.replace(/\D/g, '');
        if (p) setWhatsappPhone(p.startsWith('254') ? p : `254${p.replace(/^0/, '')}`);
        if (s?.general?.phone) setOrderPhone(s.general.phone);
        if (s?.general?.storeName) setStoreName(s.general.storeName);
        if (s?.branding?.logoUrl) setLogoUrl(s.branding.logoUrl);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (!id || !staticProduct) return;

    let cancelled = false;
    setApiOverlay(null);

    (async () => {
      const data = await syncProductToBackend(staticProduct);
      if (cancelled || !data) return;

      setApiOverlay(data);
      setReviewStats({
        rating: data.rating ?? 0,
        reviewCount: data.reviewCount ?? 0,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-red-600 font-bold hover:underline">
          Return to shop
        </Link>
      </div>
    );
  }

  const descriptionContent = getProductDescriptionContent(product);
  const showCustomization = product.enableCustomization !== false;
  const displayReviewCount = reviewStats.reviewCount || product.reviews;
  const displayRating = reviewStats.rating || product.rating;
  const hasAttributes = (product.attributes?.length ?? 0) > 0;

  const buildOptions = (): CartItemOptions => ({
    ...(Object.keys(selectedAttributes).length
      ? { variants: { ...selectedAttributes } }
      : {}),
    giftWrapping: customization.giftWrapping,
    giftCard: customization.giftCard,
    engraving: customization.engraving,
    cardInstructions: customization.cardInstructions,
    brandingInstructions: customization.brandingInstructions,
  });

  const buildExtrasNote = () => {
    const parts: string[] = [];
    Object.entries(selectedAttributes).forEach(([name, val]) => {
      if (val) parts.push(`${name}: ${val}`);
    });
    if (customization.giftWrapping) parts.push('Gift wrapping: Yes');
    if (customization.giftCard) parts.push(`Gift card: Yes${customization.cardInstructions ? `, ${customization.cardInstructions}` : ''}`);
    if (customization.engraving) parts.push(`Engraving/branding: Yes${customization.brandingInstructions ? `, ${customization.brandingInstructions}` : ''}`);
    parts.push(`Qty: ${quantity}`);
    return parts.join('\n');
  };

  const handleAddToCart = () => {
    if (hasAttributes && product.attributes) {
      const missing = product.attributes.find((a) => !selectedAttributes[a.name]);
      if (missing) {
        alert(`Please select ${missing.name}.`);
        return;
      }
    }
    addItem(product, quantity, buildOptions());
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const displayName = formatDisplayText(product.name);

  const whatsappUrl = buildWhatsAppOrderUrl(
    whatsappPhone,
    displayName,
    product.price,
    buildExtrasNote()
  );

  const whatsappShareUrl = buildWhatsAppShareUrl(displayName, window.location.href);

  return (
    <div className="bg-white pb-16">
      {/* Breadcrumb, Rio style */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 overflow-x-auto">
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-1 min-w-0">
          <Link to="/" className="hover:text-red-600 shrink-0">
            Home
          </Link>
          <span className="shrink-0">/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-red-600 truncate max-w-[120px] sm:max-w-none"
          >
            {product.category}
          </Link>
          <span className="shrink-0">/</span>
          <span className="text-gray-800 line-clamp-2 sm:line-clamp-1">{displayName}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square bg-gray-50 border border-gray-100 rounded-lg overflow-hidden mb-4">
              <ProductImageZoom
                src={gallery[activeImage] || product.image}
                alt={displayName}
                className="p-6"
              >
                {product.isSale && (
                  <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 pointer-events-none">
                    Sale!
                  </span>
                )}
              </ProductImageZoom>
            </div>
            {gallery.length > 1 && (
              <div
                className={`grid gap-2 ${
                  gallery.length === 2
                    ? 'grid-cols-2'
                    : gallery.length === 3
                      ? 'grid-cols-3'
                      : 'grid-cols-4'
                }`}
              >
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    onMouseEnter={() => prefetchGalleryImage(i)}
                    onFocus={() => prefetchGalleryImage(i)}
                    className={`aspect-square border rounded overflow-hidden p-1 bg-white transition-all ${
                      activeImage === i
                        ? 'border-red-600 ring-1 ring-red-600'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={getProductImageUrl(src, IMAGE_WIDTH.thumb)}
                      alt=""
                      loading={i < 4 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase column, Rio layout */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-normal text-gray-900 mb-3 leading-snug">{displayName}</h1>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                KShs{product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  KShs{product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Delivery bullets */}
            <ul className="list-disc list-inside text-sm text-gray-600 mb-5 space-y-1">
              {RIO_DELIVERY_BULLETS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            {/* Customization, Want Your Gift Customized */}
            {showCustomization && (
              <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 border-b border-gray-200">
                  Want Your Gift Customized
                </h3>
                <div className="p-4 space-y-3">
                  {RIO_CUSTOMIZATION_FIELDS.filter((f) => f.type === 'checkbox').map((field) => (
                    <label key={field.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customization[field.id as keyof typeof customization] as boolean}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, [field.id]: e.target.checked }))
                        }
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      {field.label}
                    </label>
                  ))}
                  {customization.giftCard && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Card Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={customization.cardInstructions}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, cardInstructions: e.target.value }))
                        }
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                        placeholder="Message for the card..."
                      />
                    </div>
                  )}
                  {customization.engraving && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                        Branding Special Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={customization.brandingInstructions}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, brandingInstructions: e.target.value }))
                        }
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                        placeholder="Name, logo, or engraving details..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Attributes e.g. Size */}
            {hasAttributes &&
              product.attributes!.map((attr) => (
                <div key={attr.name} className="mb-5">
                  <label className="block text-sm font-bold text-gray-900 mb-2">{attr.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attr.name]: val }))}
                        className={`min-w-[3rem] px-4 py-2 border text-sm font-medium transition-colors ${
                          selectedAttributes[attr.name] === val
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-gray-900'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Quantity */}
            <div className="mb-6 flex items-center gap-4">
              <label className="text-sm font-bold text-gray-900">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart / Buy now */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 text-sm uppercase tracking-wide transition-colors"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3 px-6 text-sm uppercase tracking-wide transition-colors"
              >
                Buy now
              </button>
            </div>

            <ProductWhatsAppOrder
              storeName={storeName}
              whatsappOrderUrl={whatsappUrl}
              whatsappShareUrl={whatsappShareUrl}
              logoUrl={logoUrl || undefined}
            />

            <a
              href={`tel:${orderPhone.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-red-600 mb-4"
            >
              <Phone size={16} />
              Or call to order: {orderPhone}
            </a>

            <div className="flex items-center gap-2 text-amber-400 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(displayRating) ? 'fill-current' : 'text-gray-200'}
                />
              ))}
              <span className="text-xs text-gray-500">({displayReviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Tabs, full width below */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex gap-6 border-b border-gray-200 mb-8 overflow-x-auto">
            {(
              [
                { id: 'description' as TabId, label: 'Description' },
                { id: 'additional' as TabId, label: 'Additional information' },
                { id: 'reviews' as TabId, label: `Reviews (${displayReviewCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && <ProductDescription content={descriptionContent} />}

          {activeTab === 'additional' && (
            <div className="overflow-x-auto">
              {hasAttributes ? (
                <table className="min-w-[280px] border border-gray-200 text-sm">
                  <tbody>
                    {product.attributes!.map((attr) => (
                      <tr key={attr.name} className="border-b border-gray-200 last:border-0">
                        <th className="text-left font-bold text-gray-900 px-4 py-3 bg-gray-50 w-40">
                          {attr.name}
                        </th>
                        <td className="px-4 py-3 text-gray-600">{attr.values.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No additional information available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ProductReviews
              productId={product.id}
              productName={displayName}
              initialCount={displayReviewCount}
              onStatsChange={setReviewStats}
            />
          )}

          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
