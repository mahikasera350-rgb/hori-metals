'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/components/store';
import { money } from '@/lib/utils';

export default function Cart() {
  const { items, setQty, remove, total, count } = useStore();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex items-baseline justify-between border-b border-[#E5E5E5] pb-5">
        <h1 className="text-3xl font-semibold tracking-tight text-[#0A0A0A]">Your Cart</h1>
        {count > 0 && <span className="text-xs text-[#8A8A8A]">{count} items</span>}
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag size={48} className="text-[#E5E5E5]" />
          <p className="mt-4 text-base font-medium text-[#0A0A0A]">Your cart is currently empty</p>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Explore our handcrafted brass, copper and pooja articles from Ujjain.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 py-6">
                <Link href={`/product/${product.slug}`} className="shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-24 rounded-lg bg-[#F7F7F7] object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-medium text-[#0A0A0A] hover:underline"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-1 text-xs text-[#8A8A8A]">
                      {product.material} · {product.weight}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-[#E5E5E5]">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="p-1.5 hover:bg-neutral-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="p-1.5 hover:bg-neutral-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="rounded p-1 text-[#8A8A8A] transition hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <b className="text-sm font-semibold text-[#0A0A0A]">
                    {money((product.salePrice ?? product.price) * qty)}
                  </b>
                  {product.salePrice && (
                    <div className="text-xs text-[#8A8A8A] line-through">
                      {money(product.price * qty)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl border border-[#E5E5E5] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8A8A8A]">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4A4A4A]">Subtotal</span>
                <b className="font-semibold text-[#0A0A0A]">{money(total)}</b>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8A8A8A]">Pan-India Delivery</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E5E5] pt-3 text-base font-semibold text-[#0A0A0A]">
                <span>Total Amount</span>
                <span>{money(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-[#0A0A0A] py-3.5 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
