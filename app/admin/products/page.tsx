'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Star,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { categories as defaultCategories, type Product } from '@/lib/products';
import { money } from '@/lib/utils';

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMaterial, setFilterMaterial] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    sku: '',
    material: 'Brass',
    category: 'Brass Utensils',
    price: 999,
    salePrice: '' as string | number,
    stock: 20,
    weight: '500 g',
    size: '8 in',
    description: '',
    image: '',
    images: [] as string[],
    featured: false,
    bestSeller: false,
    active: true,
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  // Fetch products from API on mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProductList(data.products);
      }
    } catch (err) {
      console.error('Failed to load products from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      sku: `HM-BR-${Math.floor(100 + Math.random() * 900)}`,
      material: 'Brass',
      category: defaultCategories[0] || 'Brass Utensils',
      price: 1299,
      salePrice: 1099,
      stock: 15,
      weight: '650 g',
      size: '10 in',
      description: 'Handcrafted solid metal piece forged by generational Kasera artisans in Ujjain.',
      image: '',
      images: [],
      featured: false,
      bestSeller: false,
      active: true,
    });
    setImageUrlInput('');
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      id: p.id,
      name: p.name,
      sku: p.sku,
      material: p.material,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice ?? '',
      stock: p.stock,
      weight: p.weight,
      size: p.size,
      description: p.description,
      image: p.image,
      images: p.images && p.images.length > 0 ? [...p.images] : [p.image],
      featured: Boolean(p.featured),
      bestSeller: Boolean(p.bestSeller),
      active: p.active !== false,
    });
    setImageUrlInput('');
    setShowModal(true);
  };

  // Upload handler for files (laptop/mobile camera or storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append('files', files[i]);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        setFormData(prev => {
          const newImages = [...prev.images, ...data.urls];
          return {
            ...prev,
            images: newImages,
            image: prev.image || newImages[0],
          };
        });
      } else {
        alert(data.error || 'Failed to upload images');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    setFormData(prev => {
      const newImages = [...prev.images, url];
      return {
        ...prev,
        images: newImages,
        image: prev.image || newImages[0],
      };
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated.length > 0 ? updated[0] : '',
      };
    });
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData(prev => {
      const target = prev.images[index];
      const rest = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        image: target,
        images: [target, ...rest],
      };
    });
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }

    try {
      setSaving(true);
      const isEdit = Boolean(editingProduct);
      const primaryImage = formData.image || formData.images[0] || '/images/hori-metals-logo.jpg';
      const allImages = formData.images.length > 0 ? formData.images : [primaryImage];

      const payload = {
        ...formData,
        image: primaryImage,
        images: allImages,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
      };

      const res = await fetch('/api/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.product) {
        if (isEdit) {
          setProductList(prev => prev.map(p => (p.id === data.product.id ? data.product : p)));
        } else {
          setProductList(prev => [data.product, ...prev]);
        }
        setShowModal(false);
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProductList(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting product');
    }
  };

  // Quick Toggle Active Status
  const handleToggleActive = async (p: Product) => {
    const newActive = p.active === false;
    try {
      // optimistic update
      setProductList(prev =>
        prev.map(item => (item.id === p.id ? { ...item, active: newActive } : item))
      );
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, active: newActive }),
      });
    } catch {
      fetchProducts();
    }
  };

  // Quick Stock Update
  const handleStockDelta = async (p: Product, delta: number) => {
    const newStock = Math.max(0, p.stock + delta);
    try {
      setProductList(prev =>
        prev.map(item => (item.id === p.id ? { ...item, stock: newStock } : item))
      );
      await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, stock: newStock }),
      });
    } catch {
      fetchProducts();
    }
  };

  // Filtered List
  const filtered = useMemo(() => {
    return productList.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'All' || p.category === filterCategory;
      const matchesMat = filterMaterial === 'All' || p.material === filterMaterial;
      const matchesStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Active' && p.active !== false) ||
        (filterStatus === 'Inactive' && p.active === false);
      return matchesSearch && matchesCat && matchesMat && matchesStatus;
    });
  }, [productList, searchTerm, filterCategory, filterMaterial, filterStatus]);

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Material', 'Category', 'Price', 'Sale Price', 'Stock', 'Weight', 'Size', 'Status', 'Featured', 'BestSeller'];
    const rows = productList.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.material,
      `"${p.category}"`,
      p.price,
      p.salePrice ?? '',
      p.stock,
      `"${p.weight}"`,
      `"${p.size}"`,
      p.active !== false ? 'Active' : 'Inactive',
      p.featured ? 'Yes' : 'No',
      p.bestSeller ? 'Yes' : 'No',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hori_metals_inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add CTA */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-[#8C6D37]">
            Catalog & Inventory Control
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            Products ({productList.length})
          </h1>
          <p className="mt-1 text-xs text-[#7A746B]">
            Upload photographs, update stock, and manage live products. Changes sync instantly to the storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
            title="Reload from database"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
          >
            Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800"
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3 text-[#8A8A8A]" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title, SKU, or keyword..."
            className="h-9 w-full rounded-lg border border-[#E5E5E5] pl-9 pr-3 text-xs outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs outline-none"
          >
            <option value="All">All Categories</option>
            {defaultCategories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterMaterial}
            onChange={e => setFilterMaterial(e.target.value)}
            className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs outline-none"
          >
            <option value="All">All Materials</option>
            <option value="Brass">Brass</option>
            <option value="Copper">Copper</option>
            <option value="Kansa">Kansa / Bronze</option>
            <option value="Mixed Alloys">Mixed Alloys</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive / Hidden</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#FAF8F5] text-xs font-semibold text-[#5A554E] border-b border-[#EAE6DF]">
              <tr>
                <th className="p-4">Item & Images</th>
                <th>SKU</th>
                <th>Material</th>
                <th>Pricing</th>
                <th>Inventory Stock</th>
                <th>Flags</th>
                <th>Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {loading && productList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-[#8A8A8A]">
                    Loading products from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-xs text-[#8A8A8A]">
                    No products match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#F7F7F7]">
                          <img
                            src={p.image || (p.images && p.images[0]) || '/images/products/thali-1.jpg'}
                            className="h-full w-full object-cover"
                            alt={p.name}
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                                target.src = '/images/products/thali-1.jpg';
                              }
                            }}
                          />
                          {p.images && p.images.length > 1 && (
                            <span className="absolute bottom-0 right-0 rounded-tl bg-black/70 px-1 text-[8px] text-white">
                              +{p.images.length - 1}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-medium text-xs text-[#0A0A0A] truncate">{p.name}</div>
                          <div className="text-[11px] text-[#8A8A8A] truncate">
                            {p.category} · {p.weight} · {p.size}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-[#4A4A4A]">{p.sku}</td>
                    <td className="text-xs font-medium">{p.material}</td>
                    <td>
                      <div className="font-semibold text-xs text-[#0A0A0A]">
                        {money(p.salePrice ?? p.price)}
                      </div>
                      {p.salePrice && (
                        <div className="text-[10px] text-[#8A8A8A] line-through">
                          {money(p.price)}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs">
                        <button
                          onClick={() => handleStockDelta(p, -1)}
                          className="h-6 w-6 rounded border border-[#E5E5E5] bg-white text-xs hover:border-[#0A0A0A] active:scale-95 transition"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center font-semibold ${p.stock <= 5 ? 'text-amber-600' : ''}`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleStockDelta(p, 1)}
                          className="h-6 w-6 rounded border border-[#E5E5E5] bg-white text-xs hover:border-[#0A0A0A] active:scale-95 transition"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {p.featured && (
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800">
                            Featured
                          </span>
                        )}
                        {p.bestSeller && (
                          <span className="rounded bg-purple-50 border border-purple-200 px-1.5 py-0.5 text-[9px] font-semibold text-purple-800">
                            Bestseller
                          </span>
                        )}
                        {!p.featured && !p.bestSeller && (
                          <span className="text-[10px] text-[#8A8A8A]">Standard</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                          p.active !== false
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-neutral-100 text-[#8A8A8A] hover:bg-neutral-200'
                        }`}
                        title="Click to toggle visibility on storefront"
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${p.active !== false ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                        <span>{p.active !== false ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="rounded p-1 text-[#4A4A4A] hover:bg-neutral-100 hover:text-[#0A0A0A]"
                          title="Edit Product & Photos"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 rounded-full p-1 text-[#8A8A8A] hover:bg-neutral-100 hover:text-[#0A0A0A]"
            >
              <X size={20} />
            </button>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6D37]">
                {editingProduct ? 'Update Inventory' : 'New Metalcraft Entry'}
              </div>
              <h2 className="mt-1 text-2xl font-semibold text-[#0A0A0A]">
                {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Product to Store'}
              </h2>
              <p className="mt-1 text-xs text-[#7A746B]">
                Upload photographs from your phone or computer. Changes appear on the customer storefront immediately.
              </p>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-6 text-xs">
              {/* ─── IMAGE UPLOAD SECTION ──────────────────────────── */}
              <div className="rounded-xl border border-[#E5E5E5] bg-[#FAF8F5] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-[#0A0A0A] flex items-center gap-1.5">
                      <ImageIcon size={15} className="text-[#8C6D37]" />
                      Product Photographs ({formData.images.length})
                    </label>
                    <p className="mt-0.5 text-[11px] text-[#7A746B]">
                      Upload from phone or laptop (multiple photos supported, PNG/JPG/WEBP).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-full bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                  >
                    <Upload size={13} />
                    <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Thumbnails Grid */}
                {formData.images.length > 0 ? (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-white ${
                          idx === 0 ? 'border-[#8C6D37] ring-2 ring-[#8C6D37]/30' : 'border-[#E5E5E5]'
                        }`}
                      >
                        <img src={imgUrl} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />

                        {idx === 0 && (
                          <span className="absolute left-1 top-1 rounded bg-[#8C6D37] px-1 py-0.5 text-[8px] font-semibold text-white shadow">
                            Primary
                          </span>
                        )}

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition group-hover:opacity-100">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-black hover:bg-white"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#D4C9BC] bg-white/70 py-8 text-center transition hover:border-[#8C6D37]"
                  >
                    <Upload size={24} className="text-[#8C6D37]" />
                    <span className="mt-2 text-xs font-semibold text-[#0A0A0A]">
                      Click to choose photographs from your phone or device
                    </span>
                    <span className="mt-1 text-[11px] text-[#8A8A8A]">
                      Supports multiple product angles (front, details, ceremonial context)
                    </span>
                  </div>
                )}

                {/* Direct Image URL input as fallback */}
                <div className="mt-3 flex gap-2">
                  <input
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    placeholder="Or paste an image web URL..."
                    className="h-8 flex-1 rounded border border-[#E5E5E5] bg-white px-2.5 text-[11px] outline-none focus:border-[#0A0A0A]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="rounded border border-[#0A0A0A] bg-white px-3 text-[11px] font-semibold hover:bg-neutral-50"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* ─── BASIC DETAILS ────────────────────────────────── */}
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-[#4A4A4A]">Product Name *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Handcrafted Brass Aarti Diya with Stand"
                    className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="font-semibold text-[#4A4A4A]">SKU Code *</label>
                    <input
                      required
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="HM-BR-013"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 font-mono text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Material</label>
                    <select
                      value={formData.material}
                      onChange={e => setFormData({ ...formData, material: e.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs"
                    >
                      <option value="Brass">Solid Brass</option>
                      <option value="Copper">Pure Copper</option>
                      <option value="Kansa">Kansa / Bronze</option>
                      <option value="Mixed Alloys">Panchdhatu / Alloys</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="font-semibold text-[#4A4A4A]">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs"
                    >
                      {defaultCategories.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* PRICING & STOCK */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Original Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Selling Price (₹)</label>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={e => setFormData({ ...formData, salePrice: e.target.value })}
                      placeholder="Optional discount price"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Stock Units *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>
                </div>

                {/* SPECIFICATIONS */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Net Weight</label>
                    <input
                      value={formData.weight}
                      onChange={e => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 850 g or 1.2 kg"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#4A4A4A]">Dimensions / Diameter</label>
                    <input
                      value={formData.size}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      placeholder="e.g. 12 in diameter or 8 × 4 in"
                      className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="font-semibold text-[#4A4A4A]">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe traditional craft techniques, religious significance, ceremonial usage, and cleaning instructions..."
                    className="mt-1 w-full rounded-lg border border-[#E5E5E5] p-3 text-xs outline-none focus:border-[#0A0A0A]"
                  />
                </div>

                {/* TOGGLES */}
                <div className="flex flex-wrap items-center gap-6 rounded-lg border border-[#E5E5E5] p-3.5 bg-neutral-50/50">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-4 w-4 rounded accent-black"
                    />
                    <span className="font-medium text-[#0A0A0A]">Feature on Homepage</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bestSeller}
                      onChange={e => setFormData({ ...formData, bestSeller: e.target.checked })}
                      className="h-4 w-4 rounded accent-black"
                    />
                    <span className="font-medium text-[#0A0A0A]">Mark as Best Seller</span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 rounded accent-black"
                    />
                    <span className="font-medium text-[#0A0A0A]">Active (Visible in Store)</span>
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full border border-[#E5E5E5] px-5 py-2.5 font-medium hover:border-[#0A0A0A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#0A0A0A] px-6 py-2.5 font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
