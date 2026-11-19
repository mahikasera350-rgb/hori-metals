'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/store';
import { products, type Product } from '@/lib/products';
import { money } from '@/lib/utils';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, add } = useStore();
  const [catalog, setCatalog] = useState<Product[]>(products);

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

  const savedProducts = catalog.filter(p => wishlist.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2 border-b border-[#E5E5E5] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#8A8A8A]">
            <Heart size={14} /> Saved Items
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            My Wishlist ({savedProducts.length})
          </h1>
        </div>
        <Link
          href="/shop"
          className="text-xs font-semibold text-[#0A0A0A] underline hover:text-neutral-700"
        >
          Continue Shopping →
        </Link>
      </div>

      {savedProducts.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F7F7F7] text-[#8A8A8A]">
            <Heart size={24} />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-[#0A0A0A]">Your wishlist is empty</h2>
          <p className="mt-2 text-sm leading-6 text-[#8A8A8A]">
            Tap the heart icon on any brass or copper piece while browsing to save it for later.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Explore Collection <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {savedProducts.map(product => (
            <div
              key={product.id}
              className="group flex flex-col justify-between border border-[#E5E5E5] bg-white transition hover:shadow-sm"
            >
              <div>
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F7F7]">
                    <img
                      src={product.image || '/images/products/thali-1.jpg'}
                      alt={product.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                          target.src = '/images/products/thali-1.jpg';
                        }
                      }}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={e => {
                        e.preventDefault();
                        toggleWishlist(product.id);
                      }}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#0A0A0A] shadow-sm hover:bg-white"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="text-xs text-[#8A8A8A]">
                    {product.material} · {product.weight}
                  </div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="mt-1 text-sm font-medium text-[#0A0A0A] hover:underline">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0A0A0A]">
                      {money(product.salePrice ?? product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-[#8A8A8A] line-through">
                        {money(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E5E5E5] p-3">
                <button
                  onClick={() => add(product)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
                >
                  <ShoppingBag size={14} /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
