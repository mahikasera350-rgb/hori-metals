'use client';

import { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  image: string;
  active: boolean;
};

const initialBanners: Banner[] = [
  {
    id: 'BAN-01',
    title: 'Festive Pooja Thali & Diya Sets',
    subtitle: 'Hand-hammered brass vessels blessed in the city of Mahakal',
    link: '/shop?category=Pooja+Thali+Sets',
    image: '/images/hero/hero-pooja-banner.jpg',
    active: true,
  },
  {
    id: 'BAN-02',
    title: 'Pure Ayurvedic Copperware',
    subtitle: 'Natural water storage with therapeutic wellness benefits',
    link: '/shop?category=Copper+Bottles',
    image: '/images/categories/copper-bottles.jpg',
    active: true,
  },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUploadBannerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Error uploading banner image');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setBanners([
      ...banners,
      {
        id: `BAN-0${banners.length + 1}`,
        title,
        subtitle,
        link,
        image: imageUrl || '/images/hero/hero-pooja-banner.jpg',
        active: true,
      },
    ]);
    setTitle('');
    setSubtitle('');
    setLink('/shop');
    setImageUrl('');
  };

  const toggleStatus = (id: string) => {
    setBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, active: !b.active } : b))
    );
  };

  const removeBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.18em] text-[#8C6D37]">
          Storefront Merchandising
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
          Promotional Banners ({banners.length})
        </h1>
        <p className="mt-1 text-xs text-[#7A746B]">
          Manage promotional hero and spotlight banners displayed on the storefront.
        </p>
      </div>

      {/* Add Banner Form */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-[#0A0A0A]">Create Promotional Banner</h2>
        <p className="text-xs text-[#8A8A8A]">
          Upload custom banner artwork or select showcase photography.
        </p>

        <form onSubmit={handleAdd} className="mt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A]">Headline *</label>
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Navratri Special Brass Diya Pair"
                className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A]">Subtitle</label>
              <input
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. Free shipping on orders over ₹999"
                className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4A4A4A]">Target Link</label>
              <input
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="/shop?category=Pooja+Thali+Sets"
                className="mt-1 h-10 w-full rounded-lg border border-[#E5E5E5] px-3 text-xs outline-none focus:border-[#0A0A0A]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-full border border-[#0A0A0A] bg-white px-4 py-2 text-xs font-semibold text-[#0A0A0A] hover:bg-neutral-50"
            >
              <Upload size={13} />
              <span>{uploading ? 'Uploading...' : imageUrl ? 'Change Banner Photo' : 'Upload Banner Image'}</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUploadBannerImage}
              className="hidden"
            />
            {imageUrl && (
              <span className="text-xs text-emerald-700 font-medium">✓ Image uploaded ({imageUrl})</span>
            )}

            <button
              type="submit"
              className="ml-auto flex items-center gap-1.5 rounded-full bg-[#0A0A0A] px-6 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              <Plus size={14} /> Add Banner
            </button>
          </div>
        </form>
      </div>

      {/* Banners Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {banners.map(b => (
          <div key={b.id} className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
            <div className="aspect-[16/9] w-full bg-neutral-100 overflow-hidden relative">
              <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              <div className="hero-gradient absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  {b.id}
                </div>
                <div className="mt-1 text-lg font-semibold">{b.title}</div>
                <p className="text-xs text-neutral-200 mt-1">{b.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(b.id)}
                  className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] ${
                    b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-[#8A8A8A]'
                  }`}
                >
                  {b.active ? 'Active' : 'Draft'}
                </button>
                <span className="font-mono text-[#8A8A8A] text-[11px]">{b.link}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => removeBanner(b.id)}
                  className="rounded p-1 text-red-600 hover:bg-red-50 hover:text-red-800"
                  title="Delete banner"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
