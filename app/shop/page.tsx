'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, X, Star } from 'lucide-react';
import { products, categories } from '@/lib/products';
import { ProductCard } from '@/components/product-card';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialMat = searchParams.get('material') || 'All';
  const initialCat = searchParams.get('category') || 'All';
  const initialQ = searchParams.get('q') || '';

  const [q, setQ] = useState(initialQ);
  const [cat, setCat] = useState(initialCat);
  const [mat, setMat] = useState(initialMat);
  const [priceRange, setPriceRange] = useState<'all' | 'under-1000' | '1000-2000' | 'above-2000'>('all');
  const [sort, setSort] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [allProducts, setAllProducts] = useState(products);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.products;
        if (Array.isArray(list) && list.length > 0) {
          setAllProducts(list);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchParams.get('material')) setMat(searchParams.get('material')!);
    if (searchParams.get('category')) setCat(searchParams.get('category')!);
    if (searchParams.get('q')) setQ(searchParams.get('q')!);
  }, [searchParams]);

  const list = useMemo(() => {
    let a = allProducts.filter(p => {
      // Filter out hidden/inactive products on customer storefront
      if (p.active === false) return false;
      const matchesCat = cat === 'All' || p.category.toLowerCase() === cat.toLowerCase();
      const matchesMat = mat === 'All' || p.material.toLowerCase() === mat.toLowerCase();
      const matchesQ =
        !q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(q.toLowerCase())) ||
        p.sku.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase());

      const effectivePrice = p.salePrice ?? p.price;
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-1000' && effectivePrice < 1000) ||
        (priceRange === '1000-2000' && effectivePrice >= 1000 && effectivePrice <= 2000) ||
        (priceRange === 'above-2000' && effectivePrice > 2000);

      return matchesCat && matchesMat && matchesQ && matchesPrice;
    });

    if (sort === 'price-low') {
      a.sort((x, y) => (x.salePrice ?? x.price) - (y.salePrice ?? y.price));
    } else if (sort === 'price-high') {
      a.sort((x, y) => (y.salePrice ?? y.price) - (x.salePrice ?? x.price));
    } else if (sort === 'rating') {
      a.sort((x, y) => (y.rating ?? 4.5) - (x.rating ?? 4.5));
    }

    return a;
  }, [q, cat, mat, priceRange, sort]);

  const resetFilters = () => {
    setQ('');
    setCat('All');
    setMat('All');
    setPriceRange('all');
    setSort('featured');
  };

  const hasActiveFilters = q || cat !== 'All' || mat !== 'All' || priceRange !== 'all' || sort !== 'featured';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Title & Search Header */}
      <div className="flex flex-col gap-5 border-b border-[#E5E5E5] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">Kasera Collection</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            {mat === 'Brass' ? 'Brass Utensils & Pooja Articles' : mat === 'Copper' ? 'Pure Copper Vessels & Bottles' : 'All Metalcraft'}
          </h1>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Hand-finished in Ujjain · Guaranteed lead-free formulations
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 text-[#8A8A8A]" size={16} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, item or tag..."
            className="h-10 w-full rounded-full border border-[#E5E5E5] pl-10 pr-9 text-xs outline-none transition focus:border-[#0A0A0A]"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-3 top-2.5 text-[#8A8A8A] hover:text-[#0A0A0A]"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        {/* Material Pills */}
        <div className="flex items-center gap-1.5 border-r border-[#E5E5E5] pr-3">
          {(['All', 'Brass', 'Copper'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMat(m)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                mat === m
                  ? 'bg-[#0A0A0A] text-white'
                  : 'border border-[#E5E5E5] bg-white text-[#4A4A4A] hover:border-[#0A0A0A]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          className="h-8 rounded-full border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#0A0A0A]"
        >
          <option value="All">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Price Filter */}
        <select
          value={priceRange}
          onChange={e => setPriceRange(e.target.value as any)}
          className="h-8 rounded-full border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#0A0A0A]"
        >
          <option value="all">Any Price</option>
          <option value="under-1000">Under ₹1,000</option>
          <option value="1000-2000">₹1,000 – ₹2,000</option>
          <option value="above-2000">Above ₹2,000</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          className="ml-auto h-8 rounded-full border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#0A0A0A]"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated (★)</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 rounded-full border border-dashed border-[#8A8A8A] px-3 py-1 text-xs text-[#4A4A4A] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between text-xs text-[#8A8A8A]">
        <div>
          Showing <b>{list.length}</b> handcrafted pieces
          {q && <span> matching "<b>{q}</b>"</span>}
        </div>
      </div>

      {/* Products Grid */}
      {list.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="text-base font-semibold text-[#0A0A0A]">No products found</p>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Try clearing filters or searching for terms like "thali", "bottle", "bell", or "diya".
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 rounded-full bg-[#0A0A0A] px-5 py-2 text-xs font-semibold text-white"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {list.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-xs text-[#8A8A8A]">
          Loading Hori Metals catalog...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
