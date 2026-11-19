'use client';

import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import type { Product } from '@/lib/products';

type CartItem = {
  product: Product;
  qty: number;
};

type Ctx = {
  items: CartItem[];
  add: (p: Product, quantity?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, q: number) => void;
  clear: () => void;
  count: number;
  total: number;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  wishlistCount: number;
  toast: string;
  showToast: (msg: string) => void;
};

const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawer, setDrawer] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const v = localStorage.getItem('hori-cart');
      if (v) setItems(JSON.parse(v));
    } catch {
      // ignore
    }

    try {
      const w = localStorage.getItem('hori-wishlist');
      if (w) setWishlist(JSON.parse(w));
    } catch {
      // ignore
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hori-cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hori-wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }, []);

  /**
   * Add a product to the cart.
   *
   * IMPORTANT: This does NOT open the cart drawer or navigate anywhere.
   * It only updates the cart state and shows a toast notification.
   * The drawer should only open when the user clicks the cart icon.
   */
  const add = useCallback(
    (p: Product, quantity: number = 1) => {
      setItems(a => {
        const existing = a.find(x => x.product.id === p.id);
        if (existing) {
          return a.map(x =>
            x.product.id === p.id
              ? { ...x, qty: Math.min(x.qty + quantity, p.stock) }
              : x
          );
        }
        return [...a, { product: p, qty: Math.min(quantity, p.stock) }];
      });
      showToast(`${p.name} added to cart`);
    },
    [showToast]
  );

  const remove = (id: string) => setItems(a => a.filter(x => x.product.id !== id));

  const setQty = (id: string, q: number) =>
    setItems(a =>
      a.map(x =>
        x.product.id === id ? { ...x, qty: Math.max(1, Math.min(q, x.product.stock)) } : x
      )
    );

  const toggleWishlist = (id: string) => {
    setWishlist(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const isWishlisted = (id: string) => wishlist.includes(id);

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      setQty,
      clear: () => setItems([]),
      count: items.reduce((s, x) => s + x.qty, 0),
      total: items.reduce((s, x) => s + (x.product.salePrice ?? x.product.price) * x.qty, 0),
      drawer,
      setDrawer,
      wishlist,
      toggleWishlist,
      isWishlisted,
      wishlistCount: wishlist.length,
      toast,
      showToast,
    }),
    [items, drawer, wishlist, toast, add, showToast]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useStore = () => {
  const context = useContext(C);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
