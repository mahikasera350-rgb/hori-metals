'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Star,
  MessageCircle,
  Sparkles,
  Info,
  Heart,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { products, type Product as ProductType } from '@/lib/products';
import { money } from '@/lib/utils';
import { useStore } from '@/components/store';
import { ProductCard } from '@/components/product-card';
import { BUSINESS } from '@/lib/config';

export default function Product({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = params && 'then' in params ? use(params) : params;
  const initialProduct = products.find(x => x.slug === resolvedParams.slug);
  const [product, setProduct] = useState<ProductType | undefined>(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);

  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [pincode, setPincode] = useState('');
  const [checkedPin, setCheckedPin] = useState(false);
  const { add, toggleWishlist, isWishlisted } = useStore();
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list: ProductType[] = Array.isArray(data) ? data : data?.products;
        if (Array.isArray(list)) {
          const match = list.find(x => x.slug === resolvedParams.slug);
          if (match) {
            setProduct(match);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#8C6D37] border-t-transparent" />
        <p className="mt-3 text-xs tracking-wider uppercase text-[#8A8A8A]">Loading Product...</p>
      </div>
    );
  }

  if (!product) return notFound();
  const p = product;
  const wishlisted = isWishlisted(p.id);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setCheckedPin(true);
    }
  };

  const handleAddToCart = () => {
    if (addingToCart) return; // Prevent double-clicks
    setAddingToCart(true);
    add(p, qty);
    // Does NOT open cart drawer, does NOT navigate
    // Toast is shown automatically by the store
    setTimeout(() => setAddingToCart(false), 1200);
  };

  const handleBuyNow = () => {
    // Add to cart silently (no drawer open), then navigate to checkout
    add(p, qty);
    router.push('/checkout');
  };

  const discountPercent = p.salePrice
    ? Math.round(((p.price - p.salePrice) / p.price) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-[#8A8A8A] transition hover:text-[#0A0A0A]"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </Link>
        <span className="text-xs text-[#8A8A8A]">
          SKU: <span className="font-mono text-[#0A0A0A]">{p.sku}</span>
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images Gallery */}
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
            {p.images.map((x, i) => (
              <button
                key={x}
                onClick={() => setImg(i)}
                className={`aspect-square w-16 sm:w-full overflow-hidden rounded-lg border transition ${
                  i === img
                    ? 'border-[#0A0A0A] ring-1 ring-[#0A0A0A]'
                    : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={x}
                  alt=""
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                      target.src = '/images/products/thali-1.jpg';
                    }
                  }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="order-1 relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F7F7F7] sm:order-2">
            <img
              src={p.images[img] || p.image || '/images/products/thali-1.jpg'}
              alt={p.name}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                  target.src = '/images/products/thali-1.jpg';
                }
              }}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(p.id)}
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                wishlisted ? 'bg-[#0A0A0A] text-white' : 'bg-white text-[#4A4A4A] hover:text-[#0A0A0A]'
              }`}
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlisted ? 'fill-white' : ''} />
            </button>
          </div>
        </div>

        {/* Product Details Column */}
        <div className="space-y-5 lg:py-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">
                {p.category}
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                {p.material}
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#0A0A0A] sm:text-3xl">
              {p.name}
            </h1>

            {/* Rating Stars */}
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#0A0A0A]">{p.rating ?? 4.9}</span>
              </div>
              <span className="text-[#8A8A8A]">·</span>
              <span className="text-[#4A4A4A]">
                {p.reviewsCount ?? 64} reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-y border-[#E5E5E5] py-4">
            <span className="text-3xl font-semibold tracking-tight text-[#0A0A0A]">
              {money(p.salePrice ?? p.price)}
            </span>
            {p.salePrice && (
              <>
                <span className="text-base text-[#8A8A8A] line-through">
                  {money(p.price)}
                </span>
                <span className="rounded bg-[#0A0A0A] px-2 py-0.5 text-xs font-semibold text-white">
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span className="text-xs text-[#8A8A8A] ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[#4A4A4A]">
            {p.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8A8A]">Material</div>
              <div className="mt-1 text-xs font-semibold text-[#0A0A0A]">{p.material}</div>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8A8A]">Weight</div>
              <div className="mt-1 text-xs font-semibold text-[#0A0A0A]">{p.weight}</div>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8A8A]">Size</div>
              <div className="mt-1 text-xs font-semibold text-[#0A0A0A]">{p.size}</div>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] p-3 text-center">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8A8A]">In Stock</div>
              <div className="mt-1 text-xs font-semibold text-emerald-700">
                {p.stock > 0 ? `${p.stock} left` : 'Made to Order'}
              </div>
            </div>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <div className="flex h-12 items-center rounded-lg border border-[#E5E5E5] bg-white">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3.5 text-[#4A4A4A] transition hover:text-[#0A0A0A]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-[#0A0A0A]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(p.stock, qty + 1))}
                  className="px-3.5 text-[#4A4A4A] transition hover:text-[#0A0A0A]"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition ${
                  addingToCart
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#0A0A0A] text-white hover:bg-neutral-800'
                }`}
              >
                {addingToCart ? (
                  <>
                    <Check size={17} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} /> Add to Cart
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0A0A0A] bg-white text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:text-white"
            >
              <Zap size={15} /> Buy Now
            </button>
          </div>

          {/* Delivery & Pincode checker */}
          <div className="rounded-lg border border-[#E5E5E5] bg-[#F7F7F7]/60 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0A0A0A]">
              <Truck size={16} /> Estimate Delivery
            </div>

            <form onSubmit={handleCheckPincode} className="mt-2.5 flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={e => {
                  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setCheckedPin(false);
                }}
                placeholder="Enter 6-digit Pincode"
                className="h-9 w-40 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs outline-none focus:border-[#0A0A0A]"
              />
              <button
                type="submit"
                className="rounded-lg border border-[#0A0A0A] bg-[#0A0A0A] px-4 text-xs font-semibold text-white"
              >
                Check
              </button>
            </form>

            {checkedPin && (
              <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <Check size={14} /> Available for free insured delivery to {pincode} in 3–5 days
              </div>
            )}
          </div>

          {/* WhatsApp inquiry & care */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#4A4A4A] border-t border-[#E5E5E5] pt-4">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>Certified pure Kasera metalcraft</span>
            </div>

            <a
              href={`${BUSINESS.whatsAppUrl}?text=${encodeURIComponent(
                `Namaste Hori Metals, I have a query regarding ${p.name} (SKU: ${p.sku}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#0A0A0A] underline"
            >
              <MessageCircle size={14} /> Ask query on WhatsApp
            </a>
          </div>

          {/* Care Guidelines */}
          <div className="rounded-lg border border-[#E5E5E5] p-4 text-xs text-[#4A4A4A]">
            <div className="font-semibold text-[#0A0A0A] flex items-center gap-1.5">
              <Info size={14} /> Traditional Maintenance & Cleaning
            </div>
            <p className="mt-1.5 leading-5 text-[#8A8A8A]">
              Clean with natural Pitambari powder or lemon/tamarind pulp and warm water. Wipe completely dry with a soft cotton cloth to preserve its rich natural glow. Avoid abrasive steel wool.
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="mt-20 border-t border-[#E5E5E5] pt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold text-[#0A0A0A]">You May Also Like</h2>
          <Link href="/shop" className="text-xs font-semibold underline text-[#0A0A0A]">
            View All →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products
            .filter(x => x.id !== p.id && (x.material === p.material || x.category === p.category))
            .slice(0, 4)
            .map(x => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
