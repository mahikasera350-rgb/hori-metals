'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { Product } from '@/lib/products';
import { money } from '@/lib/utils';
import { useStore } from './store';

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, isWishlisted } = useStore();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (adding) return; // Prevent duplicate clicks
      setAdding(true);
      add(product);
      setTimeout(() => setAdding(false), 1000);
    },
    [add, product, adding]
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <article className="group relative flex flex-col justify-between">
      <div>
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-[#F7F7F7]">
            <img
              src={product.image || '/images/products/thali-1.jpg'}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                  target.src = '/images/products/thali-1.jpg';
                }
              }}
              className="metal-img h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
              {product.salePrice && (
                <span className="rounded-md bg-[#0A0A0A] px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {product.stock <= 8 && (
                <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full transition shadow-sm ${
                wishlisted
                  ? 'bg-[#0A0A0A] text-white'
                  : 'bg-white/90 text-[#4A4A4A] hover:bg-white hover:text-[#0A0A0A]'
              }`}
            >
              <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
            </button>
          </div>
        </Link>

        <div className="pt-3">
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-5 text-[#0A0A0A] transition hover:underline">
              {product.name}
            </h3>
          </Link>

          {/* Ratings */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-[#4A4A4A]">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold">{product.rating ?? 4.9}</span>
            <span className="text-[#8A8A8A]">({product.reviewsCount ?? 45})</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between pt-1">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold text-[#0A0A0A]">
            {money(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-xs text-[#8A8A8A] line-through">
              {money(product.price)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
            adding
              ? 'bg-[#0A0A0A] text-white'
              : 'border border-[#E5E5E5] bg-white text-[#0A0A0A] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white'
          }`}
          aria-label="Add to cart"
        >
          <ShoppingBag size={13} />
          {adding ? 'Added' : 'Add'}
        </button>
      </div>
    </article>
  );
}
