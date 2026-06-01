import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Edit2, Trash2, Search, Loader2, X, Upload, ImageIcon } from 'lucide-react';
import { API_URL } from '../../config';
import { DEFAULT_PACKAGE_SECTION_TITLES } from '../../utils/productDescription';
import type { ProductAttribute, ProductPackageSection } from '../../types/product';

type VariantRow = { name: string; values: string };

const defaultVariantRows = (): VariantRow[] => [{ name: 'Size', values: '' }];

const variantRowsFromAttributes = (attrs?: ProductAttribute[]): VariantRow[] => {
  if (!attrs?.length) return defaultVariantRows();
  return attrs.map((a) => ({ name: a.name, values: a.values.join(', ') }));
};

const attributesFromVariantRows = (rows: VariantRow[]): ProductAttribute[] =>
  rows
    .map((v) => ({
      name: v.name.trim(),
      values: v.values
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    }))
    .filter((v) => v.name && v.values.length);

/** Extra angles for the thumbnail strip (excludes main product image). */
const galleryExtrasFromProduct = (product: Pick<Product, 'image' | 'images'>): string[] => {
  const list = (product.images ?? []).filter(Boolean);
  const main = product.image?.trim();
  if (!list.length) return [];
  if (!main) return list.slice(1);
  const extras = list.filter((u) => u !== main);
  if (extras.length) return extras;
  return list.length > 1 ? list.slice(1) : [];
};

const buildProductImages = (main: string, extras: string[]): string[] | undefined => {
  const m = main.trim();
  const extra = extras.map((u) => u.trim()).filter(Boolean).filter((u) => u !== m);
  if (!m && !extra.length) return undefined;
  if (!m) return extra.length ? extra : undefined;
  return extra.length ? [m, ...extra] : [m];
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith('image/')) {
    return 'Please choose an image file (JPG, PNG, WebP, or GIF).';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
};

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  categoryId: string;
  category?: { name: string };
  image: string;
  description?: string;
  packageSections?: ProductPackageSection[];
  shortDescription?: string;
  images?: string[];
  attributes?: ProductAttribute[];
  enableCustomization?: boolean;
  isSale?: boolean;
  isNew?: boolean;
}

const emptyPackageSections = (): ProductPackageSection[] =>
  DEFAULT_PACKAGE_SECTION_TITLES.map((title) => ({ title, items: [''] }));

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { token } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [galleryUploadError, setGalleryUploadError] = useState('');
  const [galleryUrlDraft, setGalleryUrlDraft] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    stock: '100',
    categoryId: '',
    image: '',
    description: '',
    packageSections: emptyPackageSections(),
    shortDescription: '',
    galleryImages: [] as string[],
    variantRows: defaultVariantRows(),
    enableCustomization: true,
    isSale: false,
    isNew: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Fetch ALL products (or up to 5000) so admin can see everything
      let url = `${API_URL}/api/products?limit=5000`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedCategory) url += `&category=${categories.find(c => c.id === selectedCategory)?.name || ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
      setCurrentPage(1); // Reset page on new fetch
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        oldPrice: product.oldPrice ? product.oldPrice.toString() : '',
        stock: product.stock.toString(),
        categoryId: product.categoryId || (product.category as any)?.id || '',
        image: product.image,
        description: product.description || '',
        packageSections:
          product.packageSections?.length
            ? product.packageSections.map((s) => ({
                ...s,
                items: s.items.length ? s.items : [''],
              }))
            : emptyPackageSections(),
        shortDescription: product.shortDescription || '',
        galleryImages: galleryExtrasFromProduct(product),
        variantRows: variantRowsFromAttributes(product.attributes),
        enableCustomization: product.enableCustomization !== false,
        isSale: product.isSale || false,
        isNew: product.isNew || false,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        stock: '100',
        categoryId: categories.length > 0 ? categories[0].id : '',
        image: '',
        description: '',
        packageSections: emptyPackageSections(),
        shortDescription: '',
        galleryImages: [] as string[],
        variantRows: defaultVariantRows(),
        enableCustomization: true,
        isSale: false,
        isNew: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setUploadError('');
    setGalleryUploadError('');
    setGalleryUrlDraft('');
  };

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      handleOpenModal();
      const next = new URLSearchParams(searchParams);
      next.delete('action');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams]);

  const resolveImageSrc = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    return imagePath;
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append('image', file);
    const response = await fetch(`${API_URL}/api/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Upload failed');
    return data.url as string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const url = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setGalleryUploadError('');
    setIsUploadingGallery(true);

    try {
      const urls: string[] = [];
      for (const file of files) {
        const validationError = validateImageFile(file);
        if (validationError) throw new Error(validationError);
        urls.push(await uploadImageFile(file));
      }
      setFormData((prev) => ({
        ...prev,
        galleryImages: [...prev.galleryImages, ...urls],
      }));
    } catch (err: any) {
      setGalleryUploadError(err.message || 'Failed to upload gallery images');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const addGalleryUrl = () => {
    const url = galleryUrlDraft.trim();
    if (!url) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.includes(url)
        ? prev.galleryImages
        : [...prev.galleryImages, url],
    }));
    setGalleryUrlDraft('');
    setGalleryUploadError('');
  };

  const updateSection = (index: number, patch: Partial<ProductPackageSection>) => {
    setFormData((prev) => ({
      ...prev,
      packageSections: prev.packageSections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  const updateSectionItem = (sectionIndex: number, itemIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      packageSections: prev.packageSections.map((s, i) =>
        i === sectionIndex
          ? { ...s, items: s.items.map((item, j) => (j === itemIndex ? value : item)) }
          : s
      ),
    }));
  };

  const addSectionItem = (sectionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      packageSections: prev.packageSections.map((s, i) =>
        i === sectionIndex ? { ...s, items: [...s.items, ''] } : s
      ),
    }));
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      packageSections: prev.packageSections.map((s, i) =>
        i === sectionIndex ? { ...s, items: s.items.filter((_, j) => j !== itemIndex) } : s
      ),
    }));
  };

  const addPackageSection = () => {
    setFormData((prev) => ({
      ...prev,
      packageSections: [...prev.packageSections, { title: 'Custom section', items: [''] }],
    }));
  };

  const removePackageSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      packageSections: prev.packageSections.filter((_, i) => i !== index),
    }));
  };

  const updateVariantRow = (index: number, patch: Partial<VariantRow>) => {
    setFormData((prev) => ({
      ...prev,
      variantRows: prev.variantRows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    }));
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variantRows: [...prev.variantRows, { name: '', values: '' }],
    }));
  };

  const removeVariantRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variantRows:
        prev.variantRows.length > 1
          ? prev.variantRows.filter((_, i) => i !== index)
          : [{ name: '', values: '' }],
    }));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      alert('Please upload a product image before saving.');
      return;
    }

    setIsSaving(true);

    const packageSections = formData.packageSections
      .map((s) => ({
        title: s.title.trim(),
        items: s.items.map((i) => i.trim()).filter(Boolean),
      }))
      .filter((s) => s.title && s.items.length > 0);

    const images = buildProductImages(formData.image, formData.galleryImages);

    const attributes = attributesFromVariantRows(formData.variantRows);

    try {
      const url = editingProduct 
        ? `${API_URL}/api/products/${editingProduct.id}`
        : `${API_URL}/api/products`;
        
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          oldPrice: formData.oldPrice,
          stock: formData.stock,
          categoryId: formData.categoryId,
          image: formData.image,
          images,
          description: formData.description,
          shortDescription: formData.shortDescription,
          packageSections,
          attributes: attributes.length ? attributes : undefined,
          enableCustomization: formData.enableCustomization,
          isSale: formData.isSale,
          isNew: formData.isNew,
        }),
      });

      if (response.ok) {
        fetchProducts(); // Refresh list
        handleCloseModal();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product', error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Products Inventory</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Manage all {products.length} products in your store's catalog.
          </p>
        </div>
        <div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border-none rounded-2xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-sm font-medium transition-shadow"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-1 max-w-xs ml-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full py-3 pl-4 pr-10 border-none rounded-2xl leading-5 bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-sm font-medium transition-shadow cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="hidden sm:flex items-center ml-auto text-sm text-gray-500 font-medium">
            Showing {products.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, products.length)} of {products.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-4 sm:px-8 py-4 sm:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Product Details
                </th>
                <th scope="col" className="hidden sm:table-cell px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Category
                </th>
                <th scope="col" className="px-4 sm:px-8 py-4 sm:py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Price
                </th>
                <th scope="col" className="hidden md:table-cell px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Stock
                </th>
                <th scope="col" className="relative px-4 sm:px-8 py-4 sm:py-5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-red-500 mb-4" />
                    <p className="text-gray-500 font-medium text-sm">Loading inventory...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-900 font-bold text-lg mb-1">No products found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your search terms.</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 sm:px-8 py-4 sm:py-5">
                      <div className="flex items-center min-w-[180px]">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                          <img className="h-full w-full object-contain" src={product.image || 'https://via.placeholder.com/40'} alt="" loading="lazy" decoding="async" />
                        </div>
                        <div className="ml-3 sm:ml-5 min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[250px]" title={product.name}>
                            {product.name}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.isSale && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                                On Sale
                              </span>
                            )}
                            {(product.attributes?.length ?? 0) > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                                {product.attributes!.length} variant{product.attributes!.length === 1 ? '' : 's'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-8 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gray-100 text-gray-700">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">KShs {product.price.toLocaleString()}</div>
                      {product.oldPrice && (
                        <div className="text-xs text-gray-400 line-through">KShs {product.oldPrice.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold text-gray-700">{product.stock} in stock</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-500">
              Page <span className="font-bold text-gray-900">{currentPage}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-[100dvh] items-end justify-center sm:items-center sm:min-h-screen px-0 sm:px-4 sm:py-8">
            <div className="fixed inset-0 bg-gray-500/75" onClick={handleCloseModal} aria-hidden />

            <div className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 text-left bg-white shadow-xl rounded-t-2xl sm:rounded-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (KShs)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Old Price (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="w-28 h-28 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                        {formData.image ? (
                          <img
                            src={resolveImageSrc(formData.image)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(ev) => {
                              (ev.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                          {isUploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {isUploading ? 'Uploading...' : 'Upload image'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            disabled={isUploading}
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="text-xs text-gray-500">JPG, PNG, WebP or GIF, max 5MB. Saved to your store automatically.</p>
                        {uploadError && (
                          <p className="text-xs text-red-600">{uploadError}</p>
                        )}
                        {formData.image && (
                          <p className="text-xs text-gray-400 truncate">Saved as: {formData.image}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Short description (above customization)</label>
                    <textarea
                      rows={3}
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                      placeholder="Shown under price with delivery bullets..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional photos (product angles)
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Shown as thumbnails below the main image on the product page. Upload extra angles here; the main image above is always the first view.
                    </p>

                    {formData.galleryImages.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-3">
                        {formData.galleryImages.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden group"
                          >
                            <img
                              src={resolveImageSrc(src)}
                              alt={`Angle ${index + 1}`}
                              className="w-full h-full object-contain p-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              aria-label="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                        {isUploadingGallery ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        {isUploadingGallery ? 'Uploading...' : 'Upload angle photos'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          multiple
                          className="hidden"
                          disabled={isUploadingGallery || isUploading}
                          onChange={handleGalleryUpload}
                        />
                      </label>
                      <span className="text-xs text-gray-500">Select one or more images, max 5MB each</span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={galleryUrlDraft}
                        onChange={(e) => setGalleryUrlDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addGalleryUrl();
                          }
                        }}
                        className="flex-1 rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border font-mono text-xs"
                        placeholder="/products/angle-2.jpg"
                      />
                      <button
                        type="button"
                        onClick={addGalleryUrl}
                        className="px-4 py-2 text-sm font-bold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Add URL
                      </button>
                    </div>

                    {galleryUploadError && (
                      <p className="text-xs text-red-600 mt-2">{galleryUploadError}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Product variants</label>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Option groups shoppers choose on the product page (e.g. Size, Color, Quantity).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVariantRow}
                        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wide"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add variant
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.variantRows.map((row, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50"
                        >
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Option name</label>
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) => updateVariantRow(index, { name: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border bg-white"
                              placeholder="Size"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Values (comma-separated)</label>
                            <input
                              type="text"
                              value={row.values}
                              onChange={(e) => updateVariantRow(index, { values: e.target.value })}
                              className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border bg-white"
                              placeholder="39, 40, 41, 44, 45"
                            />
                          </div>
                          <div className="flex items-end sm:pb-1">
                            <button
                              type="button"
                              onClick={() => removeVariantRow(index)}
                              className="text-xs font-medium text-gray-500 hover:text-red-600 px-2 py-2"
                              aria-label="Remove variant"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      id="enableCustomization"
                      type="checkbox"
                      checked={formData.enableCustomization}
                      onChange={(e) => setFormData({ ...formData, enableCustomization: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="enableCustomization" className="text-sm text-gray-700">
                      Show gift customization options (wrapping, card, engraving)
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description (intro)</label>
                    <p className="text-xs text-gray-500 mb-1">
                      Main overview text, same as Rio Gift Shop product page opening paragraphs.
                    </p>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-2 px-3 border"
                      placeholder="Describe the product, who it's for, and key benefits..."
                    />
                  </div>

                  <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Package sections</label>
                        <p className="text-xs text-gray-500">
                          What&apos;s included, Features, Perfect for, like riogiftshop.com
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addPackageSection}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        + Add section
                      </button>
                    </div>
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                      {formData.packageSections.map((section, sIdx) => (
                        <div key={sIdx} className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSection(sIdx, { title: e.target.value })}
                              className="flex-1 rounded-md border-gray-300 text-sm py-1.5 px-2 border"
                              placeholder="Section title"
                            />
                            <button
                              type="button"
                              onClick={() => removePackageSection(sIdx)}
                              className="text-gray-400 hover:text-red-600 p-1"
                              title="Remove section"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            {section.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex gap-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateSectionItem(sIdx, iIdx, e.target.value)}
                                  className="flex-1 rounded-md border-gray-300 text-sm py-1.5 px-2 border bg-white"
                                  placeholder="List item"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSectionItem(sIdx, iIdx)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addSectionItem(sIdx)}
                              className="text-xs font-medium text-gray-600 hover:text-black"
                            >
                              + Add item
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex gap-4">
                    <div className="flex items-center">
                      <input
                        id="isSale"
                        type="checkbox"
                        checked={formData.isSale}
                        onChange={(e) => setFormData({...formData, isSale: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor="isSale" className="ml-2 block text-sm text-gray-900">
                        On Sale
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="isNew"
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor="isNew" className="ml-2 block text-sm text-gray-900">
                        New Product
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
