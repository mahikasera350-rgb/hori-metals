'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/components/store';
import { money } from '@/lib/utils';
import { Check, ShieldCheck, Truck, ArrowRight, MessageCircle, Lock } from 'lucide-react';
import { BUSINESS } from '@/lib/config';

export default function CheckoutPage() {
  const { items, total, clear } = useStore();
  const [done, setDone] = useState(false);
  const [method, setMethod] = useState<'COD' | 'UPI'>('COD');
  const [orderId, setOrderId] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length || loading) return;
    setLoading(true);

    const generatedId = `HM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);

    const newOrder = {
      id: generatedId,
      customer: fullName,
      phone,
      address,
      city,
      state,
      pincode,
      items: items.map(i => `${i.product.name} (${i.product.size}) × ${i.qty}`).join(', '),
      total,
      paymentMethod: method,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'placed',
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {
      // ignore
    }

    try {
      const stored = localStorage.getItem('hori-orders');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('hori-orders', JSON.stringify([newOrder, ...existing]));
    } catch {
      // ignore
    }

    clear();
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] text-white">
          <Check size={28} />
        </div>
        <span className="mt-4 inline-block font-mono text-xs font-semibold text-[#8A8A8A]">
          ORDER #{orderId}
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#4A4A4A]">
          Your order has been recorded and will be packed at our Ujjain workshop.
          We&apos;ll dispatch your pure brass/copper pieces within 24–48 hours and send WhatsApp tracking updates.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`${BUSINESS.whatsAppUrl}?text=${encodeURIComponent(
              `Namaste Hori Metals, I just placed order #${orderId}. Please confirm delivery.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0A0A0A] bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:text-white"
          >
            <MessageCircle size={16} /> WhatsApp Us for Confirmation
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#8A8A8A]">
        <Lock size={13} /> Secure Checkout
      </div>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
        Complete Your Order
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="space-y-8">
          {/* Section 1: Address */}
          <section className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0A0A0A]">1. Delivery Address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#4A4A4A]">Full Name *</label>
                <input
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">Phone Number (for WhatsApp updates) *</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98260 XXXXX"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">Pincode *</label>
                <input
                  required
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  placeholder="6-digit pincode"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#4A4A4A]">Street Address & House / Flat No. *</label>
                <input
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House no., building, street, area"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">City *</label>
                <input
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="City"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">State *</label>
                <input
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="State"
                  className="mt-1 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Payment */}
          <section className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-base font-semibold text-[#0A0A0A]">2. Payment Method</h2>
            <div className="mt-5 space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3.5 rounded-lg border p-4 text-sm transition ${
                  method === 'COD' ? 'border-[#0A0A0A] bg-[#F7F7F7]' : 'border-[#E5E5E5] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={method === 'COD'}
                  onChange={() => setMethod('COD')}
                  className="h-4 w-4 accent-black"
                />
                <div>
                  <div className="font-medium text-[#0A0A0A]">Cash on Delivery (COD)</div>
                  <div className="text-xs text-[#8A8A8A]">Pay in cash or UPI when your parcel arrives</div>
                </div>
                <span className="ml-auto rounded bg-neutral-200/60 px-2 py-0.5 text-[10px] font-semibold text-neutral-800">
                  Recommended
                </span>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3.5 rounded-lg border p-4 text-sm transition ${
                  method === 'UPI' ? 'border-[#0A0A0A] bg-[#F7F7F7]' : 'border-[#E5E5E5] bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={method === 'UPI'}
                  onChange={() => setMethod('UPI')}
                  className="h-4 w-4 accent-black"
                />
                <div>
                  <div className="font-medium text-[#0A0A0A]">UPI / Razorpay / Cards</div>
                  <div className="text-xs text-[#8A8A8A]">GPay, PhonePe, Paytm, or Credit/Debit Card</div>
                </div>
                <span className="ml-auto rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Instant
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={!items.length || loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] py-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40"
          >
            {loading ? 'Recording Order...' : `Place Order · ${money(total)}`}
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <aside className="h-fit space-y-5">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-6">
            <h2 className="text-sm font-semibold text-[#0A0A0A]">Order Summary ({items.length} items)</h2>
            <div className="mt-5 divide-y divide-[#E5E5E5]">
              {items.map(x => (
                <div key={x.product.id} className="flex gap-3 py-3.5 text-sm">
                  <img
                    src={x.product.image || '/images/products/thali-1.jpg'}
                    alt=""
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/images/products/thali-1.jpg')) {
                        target.src = '/images/products/thali-1.jpg';
                      }
                    }}
                    className="h-14 w-12 rounded-lg bg-[#F7F7F7] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-[#0A0A0A]">{x.product.name}</div>
                    <div className="text-xs text-[#8A8A8A]">Qty: {x.qty} · {x.product.material}</div>
                  </div>
                  <div className="font-semibold text-[#0A0A0A]">
                    {money((x.product.salePrice ?? x.product.price) * x.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-[#E5E5E5] pt-4 text-xs text-[#4A4A4A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#0A0A0A]">{money(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery across India</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between border-t border-[#E5E5E5] pt-3 text-sm font-semibold text-[#0A0A0A]">
                <span>Total Amount</span>
                <span>{money(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-5 text-xs text-[#4A4A4A] space-y-2.5">
            <div className="flex items-center gap-2 font-medium text-[#0A0A0A]">
              <ShieldCheck size={16} /> Kasera Artisan Guarantee
            </div>
            <p className="leading-5">
              Every utensil and idol is thoroughly checked for finish, weight, and purity before leaving our Ujjain workshop.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
