'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  MapPin,
  User,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useStore } from './store';
import { products, categories } from '@/lib/products';
import { money } from '@/lib/utils';

export function Header() {
  const router = useRouter();
  const { count, setDrawer, wishlistCount } = useStore();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userPincode, setUserPincode] = useState('Ujjain, 456010');

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState(products);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const headerSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.products;
        if (Array.isArray(list) && list.length > 0) {
          setCatalog(list);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const u = localStorage.getItem('hori-user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.role === 'admin' || parsed.email === 'mahikasera350@gmail.com') {
          setIsAdmin(true);
        }
      }

      const pin = localStorage.getItem('hori-pincode');
      if (pin) {
        setUserPincode(pin);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const searchResults = query.trim()
    ? catalog
        .filter(
          p =>
            p.active !== false &&
            (p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase()) ||
              p.material.toLowerCase().includes(query.toLowerCase()) ||
              (p.tags && p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))))
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#0A0A0A] px-4 py-1.5 text-center text-[11px] font-medium text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <Sparkles size={12} className="text-amber-400" />
          <span>
            Free Insured Delivery Across India · Authentic Ujjain Kasera Metalcraft
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#E5E5E5] bg-white/95 backdrop-blur">
        {/* Main Header Row */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo */}
          <Link href="/" className="mr-2 shrink-0">
            <img
              src="/images/hori-metals-logo.jpg"
              alt="Hori Metals"
              className="h-10 w-auto sm:h-11"
            />
          </Link>

          {/* Desktop Inline Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full items-center rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] transition focus-within:border-[#0A0A0A] focus-within:bg-white"
            >
              <Search size={15} className="ml-3 text-[#8A8A8A]" />
              <input
                ref={headerSearchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search for brass utensils, pooja items..."
                className="h-9 w-full bg-transparent pl-2 pr-3 text-sm outline-none placeholder:text-[#8A8A8A]"
              />
            </form>
          </div>

          {/* Right Icons */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#0A0A0A] px-3 py-1 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                <ShieldCheck size={12} /> Admin
              </Link>
            )}

            {/* Location pill */}
            <button
              onClick={() => {
                localStorage.removeItem('hori-location-seen');
                window.location.reload();
              }}
              className="hidden lg:flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1 text-xs text-[#4A4A4A] transition hover:border-[#0A0A0A]"
              title="Change Delivery Location"
            >
              <MapPin size={12} />
              <span className="max-w-[80px] truncate">{userPincode}</span>
            </button>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Search Catalog"
            >
              <Search size={18} />
            </button>

            <Link
              href="/wishlist"
              className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0A0A0A] px-1 text-[9px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            <button
              onClick={() => setDrawer(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-neutral-100"
              aria-label="Cart"
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0A0A0A] px-1 text-[9px] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden md:block border-t border-[#E5E5E5] bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 overflow-x-auto hide-scrollbar">
            <Link
              href="/shop"
              className="flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[13px] font-medium text-[#0A0A0A] transition hover:text-[#B8860B]"
            >
              All Categories
              <ChevronDown size={13} />
            </Link>
            {[
              { label: 'Brass Utensils', href: '/shop?category=Brass+Utensils' },
              { label: 'Copper Bottles', href: '/shop?category=Copper+Bottles' },
              { label: 'Pooja Thali Sets', href: '/shop?category=Pooja+Thali+Sets' },
              { label: 'Diyas & Lamps', href: '/shop?category=Diyas+%26+Lamps' },
              { label: 'Idols', href: '/shop?category=Idols' },
              { label: 'Bells', href: '/shop?category=Bells' },
              { label: 'Havan Items', href: '/shop?category=Havan+Items' },
              { label: 'Kalash & Lota', href: '/shop?category=Kalash+%26+Lota' },
              { label: 'Pooja Accessories', href: '/shop?category=Pooja+Accessories' },
              { label: 'Decor & Gifts', href: '/shop?category=Decor+%26+Gifts' },
            ].map(c => (
              <Link
                key={c.label}
                href={c.href}
                className="whitespace-nowrap px-3 py-2 text-[13px] text-[#4A4A4A] transition hover:text-[#0A0A0A]"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {open && (
          <nav className="border-t border-[#E5E5E5] bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3.5 text-sm">
              {isAdmin && (
                <Link
                  onClick={() => setOpen(false)}
                  href="/admin"
                  className="flex items-center gap-2 rounded bg-neutral-100 p-2.5 font-semibold text-[#0A0A0A]"
                >
                  <ShieldCheck size={16} /> Admin Panel
                </Link>
              )}
              <Link onClick={() => setOpen(false)} href="/shop">
                Shop All Products
              </Link>
              <Link onClick={() => setOpen(false)} href="/shop?material=Brass">
                Brass Utensils & Thalis
              </Link>
              <Link onClick={() => setOpen(false)} href="/shop?material=Copper">
                Copper Vessels & Bottles
              </Link>
              <Link onClick={() => setOpen(false)} href="/wishlist" className="flex items-center justify-between">
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-[#0A0A0A] px-2 py-0.5 text-xs text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link onClick={() => setOpen(false)} href="/about">
                Our Ujjain Heritage
              </Link>
              <Link onClick={() => setOpen(false)} href="/contact">
                Contact & Workshop
              </Link>
              <Link onClick={() => setOpen(false)} href="/account">
                My Account
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Live Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setQuery(''); }}
        >
          <div
            className="mx-auto mt-16 max-w-2xl px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl">
              <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-[#E5E5E5] px-4 py-3">
                <Search size={18} className="text-[#8A8A8A]" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search brass thalis, copper bottles, diyas, idols..."
                  className="h-10 w-full pl-3 pr-2 text-sm outline-none placeholder:text-[#8A8A8A]"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setQuery(''); }}
                  className="rounded p-1 text-[#8A8A8A] hover:text-[#0A0A0A]"
                >
                  <X size={18} />
                </button>
              </form>

              {/* Suggestions */}
              <div className="max-h-96 overflow-y-auto p-4">
                {query.trim() === '' ? (
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                      Popular Searches
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {['Pooja Thali', 'Copper Bottle', 'Lakshmi Ganesh', 'Brass Bell', 'Urli', 'Diya'].map(
                        term => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setQuery(term);
                            }}
                            className="rounded-full border border-[#E5E5E5] px-3 py-1 text-xs text-[#4A4A4A] hover:border-[#0A0A0A]"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#8A8A8A]">
                    No metalcraft found matching &ldquo;{query}&rdquo;. Try browsing our <Link href="/shop" onClick={() => setSearchOpen(false)} className="underline text-[#0A0A0A]">full catalog</Link>.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A]">
                      Matching Products
                    </div>
                    {searchResults.map(p => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => { setSearchOpen(false); setQuery(''); }}
                        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-neutral-50"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-12 w-10 rounded bg-[#F7F7F7] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#0A0A0A] truncate">
                            {p.name}
                          </div>
                          <div className="text-xs text-[#8A8A8A]">
                            {p.material} · {p.weight}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-[#0A0A0A]">
                          {money(p.salePrice ?? p.price)}
                        </div>
                      </Link>
                    ))}
                    <div className="pt-2 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] underline"
                      >
                        View all results for &ldquo;{query}&rdquo; <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
