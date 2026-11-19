'use client';

import { useState, useEffect } from 'react';
import { Plus, Layers, RefreshCw, Trash2 } from 'lucide-react';
import { categories as defaultCategories } from '@/lib/products';

type CategoryItem = {
  name: string;
  slug: string;
  description?: string;
  active: boolean;
};

export default function AdminCategoriesPage() {
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategoryList(data.categories);
      } else {
        setCategoryList(
          defaultCategories.map(name => ({
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            active: true,
          }))
        );
      }
    } catch {
      setCategoryList(
        defaultCategories.map(name => ({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          active: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || saving) return;

    try {
      setSaving(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.success && data.category) {
        setCategoryList(prev => [...prev, data.category]);
        setNewCatName('');
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch {
      alert('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (slug: string, currentActive: boolean) => {
    const updatedStatus = !currentActive;
    try {
      setCategoryList(prev =>
        prev.map(c => (c.slug === slug ? { ...c, active: updatedStatus } : c))
      );
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, active: updatedStatus }),
      });
    } catch {
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-[#8C6D37]">
            Taxonomy & Merchandising
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            Categories ({categoryList.length})
          </h1>
        </div>

        <button
          onClick={fetchCategories}
          className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#0A0A0A] hover:border-[#0A0A0A]"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Add Category Card */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[#0A0A0A]">Add New Store Category</h2>
        <p className="mt-1 text-xs text-[#8A8A8A]">
          Create a collection to organize brass utensils, copperware, or ceremonial pooja articles.
        </p>

        <form onSubmit={handleAddCategory} className="mt-4 flex max-w-md gap-2">
          <input
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            placeholder="e.g. Copper Dinner Sets"
            className="h-10 flex-1 rounded-lg border border-[#E5E5E5] px-3.5 text-xs outline-none focus:border-[#0A0A0A]"
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            <Plus size={14} /> Add Category
          </button>
        </form>
      </div>

      {/* Categories Grid/Table */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[#FAF8F5] text-xs font-semibold text-[#5A554E] border-b border-[#EAE6DF]">
              <tr>
                <th className="p-4">Category Name</th>
                <th>Catalog Slug</th>
                <th>Store Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {categoryList.map(c => (
                <tr key={c.slug} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="p-4 font-medium text-xs text-[#0A0A0A]">
                    <div className="flex items-center gap-2.5">
                      <Layers size={15} className="text-[#8C6D37]" />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-[#8A8A8A]">/shop?category={c.slug}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(c.slug, c.active)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                        c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-[#8A8A8A]'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${c.active ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                      <span>{c.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(c.slug, c.active)}
                      className="text-xs font-medium text-[#0A0A0A] underline hover:text-[#8C6D37]"
                    >
                      {c.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
