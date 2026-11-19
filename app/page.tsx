'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  Check,
  Star,
  MessageCircle,
  Award,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  Package,
  Headphones,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';

function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
import { initialSeedProducts, type Product } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { BUSINESS } from '@/lib/config';

const heroImages = [
  '/images/hero/hero-pooja-banner.jpg',
  '/images/hero/promo-banner.jpg',
  '/images/hero/hero-urli-banner.jpg',
];

// Initial deterministic slices for hydration safety
const initialFeatured = initialSeedProducts.filter(p => p.featured).slice(0, 5);
const initialBestSelling = [...initialSeedProducts]
  .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
  .slice(0, 5);
const initialNewArrivals = [...initialSeedProducts]
  .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  .slice(0, 5);

export default function HomePage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [productList, setProductList] = useState<Product[]>(initialSeedProducts);

  // Fetch live products after mount to incorporate admin uploads dynamically
  useEffect(() => {
    fetch('/api/products?activeOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductList(data.products);
        }
      })
      .catch(() => {
        // preserve initial
      });
  }, []);

  const featured = productList.filter(p => p.featured && p.active !== false).slice(0, 5);
  const bestSelling = [...productList]
    .filter(p => p.active !== false)
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0))
    .slice(0, 5);
  const newArrivals = [...productList]
    .filter(p => p.active !== false)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  return (
    <div className="space-y-16 pb-24 bg-[#FCFBF9]">
      {/* ─── Hero Banner ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#141414]">
        <div className="relative aspect-[16/7] sm:aspect-[16/6] lg:aspect-[16/5] min-h-[380px]">
          <img
            src={heroImages[heroSlide]}
            alt="Hori Metals Handcrafted Collection"
            className="h-full w-full object-cover transition-opacity duration-700"
          />
          <div className="hero-gradient absolute inset-0" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
              <div className="max-w-xl text-white">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/40 px-3.5 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>Sacred Metalcraft from Ujjain</span>
                </div>

                <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[3.25rem]">
                  <span className="italic font-light text-amber-100">Tradition</span> in<br />
                  Every Detail
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-base max-w-md">
                  Premium Brass, Pure Copper & Pooja Articles crafted with centuries of authentic Kasera metalworking lineage.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-md transition hover:bg-neutral-100 active:scale-95"
                  >
                    Shop Collection <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/shop?category=Pooja+Thali+Sets"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/30 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    Pooja Thalis
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === heroSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={() => setHeroSlide(s => (s === 0 ? heroImages.length - 1 : s - 1))}
            className="absolute left-4 top-1/2 -translate-y-1/2 hidden rounded-full bg-black/40 p-2.5 text-white backdrop-blur transition hover:bg-black/70 sm:block"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setHeroSlide(s => (s === heroImages.length - 1 ? 0 : s + 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden rounded-full bg-black/40 p-2.5 text-white backdrop-blur transition hover:bg-black/70 sm:block"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* ─── Trust Indicators Bar ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#EAE6DF] bg-white px-6 py-5 shadow-sm text-xs text-[#4A4A4A]">
          <div className="flex items-center gap-2.5">
            <Check size={17} className="text-[#8C6D37]" />
            <span className="font-medium text-[#1A1A1A]">Trusted by 10,000+ Families</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="text-[#8C6D37]" />
            <span className="font-medium text-[#1A1A1A]">Authentic Lead-Free Metals</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={17} className="text-[#8C6D37]" />
            <span className="font-medium text-[#1A1A1A]">Safe COD & Online Payments</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Truck size={17} className="text-[#8C6D37]" />
            <span className="font-medium text-[#1A1A1A]">Free Pan India Delivery</span>
          </div>
          <a
            href={BUSINESS.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[#1A1A1A] hover:text-[#8C6D37] transition font-medium"
          >
            <MessageCircle size={17} className="text-emerald-600" />
            <span>Support on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* ─── Shop by Category ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between border-b border-[#EAE6DF] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
              Sacred Craftsmanship
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
              Shop by Category
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#8C6D37] hover:underline flex items-center gap-1">
            View All Categories <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {[
            { name: 'Pooja Thali Sets', img: '/images/categories/pooja-thali-sets.jpg', filter: 'Pooja+Thali+Sets' },
            { name: 'Copper Bottles', img: '/images/categories/copper-bottles.jpg', filter: 'Copper+Bottles' },
            { name: 'Brass Diyas', img: '/images/categories/diyas-lamps.jpg', filter: 'Diyas+%26+Lamps' },
            { name: 'Brass Kalash', img: '/images/categories/kalash-lota.jpg', filter: 'Kalash+%26+Lota' },
            { name: 'Brass Idols', img: '/images/categories/idols.jpg', filter: 'Idols' },
            { name: 'Brass Bells', img: '/images/categories/bells.jpg', filter: 'Bells' },
            { name: 'Havan Items', img: '/images/categories/havan-items.jpg', filter: 'Havan+Items' },
            { name: 'Brass Utensils', img: '/images/categories/brass-utensils.jpg', filter: 'Brass+Utensils' },
            { name: 'Pooja Accessories', img: '/images/categories/pooja-accessories.jpg', filter: 'Pooja+Accessories' },
            { name: 'Traditional Decor', img: '/images/categories/traditional-decor.jpg', filter: 'Decor+%26+Gifts' },
          ].map(c => (
            <Link
              key={c.name}
              href={`/shop?category=${c.filter}`}
              className="group flex flex-col items-center gap-2.5 text-center"
            >
              <div className="aspect-square w-full overflow-hidden rounded-full border-2 border-[#EAE6DF] bg-white p-1 transition-all duration-300 group-hover:border-[#8C6D37] group-hover:shadow-md">
                <div className="h-full w-full overflow-hidden rounded-full">
                  <img
                    src={c.img}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="text-[12px] font-semibold text-[#1A1A1A] group-hover:text-[#8C6D37] transition leading-tight">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between border-b border-[#EAE6DF] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
              Patron Favorites
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
              Featured Pieces
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#8C6D37] hover:underline flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ─── Pooja Collection Banner ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#EAE6DF] bg-[#F7F3ED] shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-14">
              <span className="text-xs font-semibold uppercase tracking-[.22em] text-[#8C6D37]">
                Ceremonial Collection
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-4xl">
                Bring Home Auspiciousness
              </h2>
              <p className="mt-3.5 max-w-md text-sm leading-relaxed text-[#5A554E]">
                Explore our exclusive pooja collection — heavy solid brass thalis, melodious temple bells, hand-carved peacock diyas, and authentic deity idols cast by Ujjain&apos;s master Kasera metalcrafters.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/shop?category=Pooja+Thali+Sets"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-7 py-3.5 text-xs font-semibold text-white shadow transition hover:bg-neutral-800"
                >
                  Shop Pooja Items <ArrowRight size={14} />
                </Link>
                <Link
                  href="/shop?material=Copper"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D4C9BC] bg-white px-6 py-3.5 text-xs font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
                >
                  Copper Utensils
                </Link>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden lg:aspect-auto">
              <img
                src="/images/hero/promo-banner.jpg"
                alt="Pooja Diya collection"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Best Selling ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between border-b border-[#EAE6DF] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
              Customer Top Picks
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
              Best Selling Utensils & Vessels
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold text-[#8C6D37] hover:underline flex items-center gap-1">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {bestSelling.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ─── New Arrivals ────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between border-b border-[#EAE6DF] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
                Fresh from Ujjain Workshop
              </span>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
                New Arrivals
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-[#8C6D37] hover:underline flex items-center gap-1">
              Explore All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Instagram Gallery ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EAE6DF] pb-4 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
              Follow Along
            </span>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl flex items-center gap-2">
              <span>Instagram</span>
              <a
                href={BUSINESS.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-normal text-[#8C6D37] hover:underline inline-flex items-center gap-1"
              >
                {BUSINESS.instagramHandle} <ArrowUpRight size={14} />
              </a>
            </h2>
          </div>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] hover:text-[#8C6D37]"
          >
            <InstagramIcon size={15} />
            <span>Follow on Instagram</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {[
            { img: '/images/products/thali-1.jpg', caption: 'Handmade Brass Thali Finishing' },
            { img: '/images/products/copper-bottle-1.jpg', caption: 'Hammered Copper Bottles' },
            { img: '/images/products/idols-1.jpg', caption: 'Sacred Lakshmi Ganesh Casting' },
            { img: '/images/products/bell-1.jpg', caption: 'Resonant Temple Bells' },
            { img: '/images/products/diya-1.jpg', caption: 'Traditional Brass Deepams' },
            { img: '/images/products/urli-1.jpg', caption: 'Hand-Fluted Decorative Urli' },
          ].map((item, idx) => (
            <a
              key={idx}
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl border border-[#EAE6DF] bg-white shadow-sm"
            >
              <img
                src={item.img}
                alt={item.caption}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100 p-2 text-center">
                <InstagramIcon size={22} className="text-white" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── Trust & Service Section ─────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAE6DF] bg-white p-6 text-center shadow-sm">
            <ShieldCheck size={30} className="text-[#8C6D37]" />
            <span className="text-xs font-semibold text-[#0A0A0A]">Secure Transactions</span>
            <span className="text-[11px] text-[#7A746B]">COD, UPI & Credit/Debit Cards</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAE6DF] bg-white p-6 text-center shadow-sm">
            <RotateCcw size={30} className="text-[#8C6D37]" />
            <span className="text-xs font-semibold text-[#0A0A0A]">Hassle-Free Returns</span>
            <span className="text-[11px] text-[#7A746B]">7-day guaranteed safe return</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAE6DF] bg-white p-6 text-center shadow-sm">
            <Truck size={30} className="text-[#8C6D37]" />
            <span className="text-xs font-semibold text-[#0A0A0A]">Insured Pan India Transit</span>
            <span className="text-[11px] text-[#7A746B]">Dispatched securely from Ujjain</span>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#EAE6DF] bg-white p-6 text-center shadow-sm">
            <Headphones size={30} className="text-[#8C6D37]" />
            <span className="text-xs font-semibold text-[#0A0A0A]">Direct Artisan Support</span>
            <span className="text-[11px] text-[#7A746B]">WhatsApp: {BUSINESS.phone}</span>
          </div>
        </div>
      </section>

      {/* ─── Customer Reviews ────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[.18em] text-[#8C6D37]">
            Verified Patron Reviews
          </span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
            Words from Homes & Mandirs
          </h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="mt-3.5 text-sm leading-6 text-[#4A4A4A]">
              &ldquo;The handcrafted brass pooja thali is stunningly heavy and balanced. It arrived in Bengaluru within 4 days in sturdy triple-layer packaging. You can truly feel the authentic Ujjain Kasera craftsmanship.&rdquo;
            </p>
            <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0A0A0A]">Meera Iyer</div>
                <div className="text-[11px] text-[#8A8A8A]">Bengaluru, KA</div>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="mt-3.5 text-sm leading-6 text-[#4A4A4A]">
              &ldquo;We ordered the temple brass bell with Nandi finial. The resonance lingers for over 15 seconds after a single strike — exactly what we wanted for our daily morning aarti.&rdquo;
            </p>
            <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0A0A0A]">Rajesh Sharma</div>
                <div className="text-[11px] text-[#8A8A8A]">Indore, MP</div>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAE6DF] bg-white p-6 shadow-sm">
            <div className="flex gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400" />
              ))}
            </div>
            <p className="mt-3.5 text-sm leading-6 text-[#4A4A4A]">
              &ldquo;The hammered copper water bottle is pure, leakproof and looks regal on my work desk. Customer service on WhatsApp was prompt in answering care and cleaning questions.&rdquo;
            </p>
            <div className="mt-5 border-t border-neutral-100 pt-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#0A0A0A]">Vikas Agarwal</div>
                <div className="text-[11px] text-[#8A8A8A]">New Delhi</div>
              </div>
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
