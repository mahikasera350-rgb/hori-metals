'use client';

import Link from 'next/link';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from './store';
import { money } from '@/lib/utils';

export function CartDrawer() {
  const { drawer, setDrawer, items, remove, setQty, total, count } = useStore();

  if (!drawer) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/25" onClick={() => setDrawer(false)}>
      <aside
        onClick={e => e.stopPropagation()}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span className="font-semibold">Your Cart</span>
            {count > 0 && (
              <span className="rounded-full bg-[#0A0A0A] px-2 py-0.5 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </div>
          <button onClick={() => setDrawer(false)} aria-label="Close" className="rounded p-1 hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingBag size={40} className="text-[#E5E5E5]" />
              <p className="mt-4 text-sm text-[#8A8A8A]">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={() => setDrawer(false)}
                className="mt-4 rounded-full bg-[#0A0A0A] px-5 py-2 text-xs font-semibold text-white"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map(({ product, qty }) => (
                <div className="flex gap-4" key={product.id}>
                  <img
                    src={product.image || '/images/products/thali-1.jpg'}
                    alt={product.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                        target.src = '/images/products/thali-1.jpg';
                      }
                    }}
                    className="h-24 w-20 rounded-lg bg-[#F7F7F7] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{product.name}</div>
                    <div className="mt-0.5 text-xs text-[#8A8A8A]">
                      {product.material} · {product.weight}
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {money(product.salePrice ?? product.price)}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-[#E5E5E5]">
                        <button className="px-2 py-1" onClick={() => setQty(product.id, qty - 1)}>
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs font-medium">{qty}</span>
                        <button className="px-2 py-1" onClick={() => setQty(product.id, qty + 1)}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="rounded p-1 text-[#8A8A8A] transition hover:text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E5E5E5] bg-white p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#4A4A4A]">Subtotal</span>
              <b>{money(total)}</b>
            </div>
            <div className="flex justify-between text-xs text-[#8A8A8A]">
              <span>Delivery</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-[#E5E5E5] pt-3">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <Link
              onClick={() => setDrawer(false)}
              href="/checkout"
              className="mt-2 block rounded-full bg-[#0A0A0A] py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
