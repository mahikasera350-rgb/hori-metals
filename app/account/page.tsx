'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, User, Package, MapPin, LogOut, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { money } from '@/lib/utils';

type UserSession = {
  email: string;
  name: string;
  role: 'admin' | 'customer';
};

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '';
  const reason = searchParams.get('reason');

  const [user, setUser] = useState<UserSession | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [placedOrders, setPlacedOrders] = useState<{ id: string; items: string; total: number; paymentMethod: string; date: string; status: string }[]>([]);

  // Load user and orders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hori-user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    try {
      const storedOrders = localStorage.getItem('hori-orders');
      if (storedOrders) {
        setPlacedOrders(JSON.parse(storedOrders));
      }
    } catch {
      // ignore
    }

    // Also sync orders from backend API
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        if (d.success && Array.isArray(d.orders)) {
          setPlacedOrders(prev => {
            const combined = [...prev];
            d.orders.forEach((ord: any) => {
              if (!combined.some(o => o.id === ord.id)) {
                combined.push(ord);
              }
            });
            return combined;
          });
        }
      })
      .catch(() => {});
  }, []);

  const fillAdminCredentials = () => {
    setEmail('mahikasera350@gmail.com');
    setPassword('Kaseramahi@123');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setUser(data.user);
      localStorage.setItem('hori-user', JSON.stringify(data.user));

      // If user is admin or requested admin path, redirect
      if (redirectTarget && (data.isAdmin || redirectTarget.startsWith('/admin'))) {
        router.push(redirectTarget);
        router.refresh();
      } else if (data.isAdmin) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('hori-user');
    setUser(null);
    router.refresh();
  };

  // If already logged in, show user dashboard
  if (user) {
    const isAdmin = user.role === 'admin' || user.email === 'mahikasera350@gmail.com';

    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E5E5] pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">My Account</span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0A0A0A] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  <ShieldCheck size={11} /> Admin
                </span>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {user.name}</h1>
            <p className="mt-1 text-sm text-[#8A8A8A]">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Go to Admin Panel <ArrowRight size={15} />
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-[#E5E5E5] px-4 py-2.5 text-sm font-semibold transition hover:border-[#0A0A0A]"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex gap-6 border-b border-[#E5E5E5] text-sm">
          <button
            onClick={() => setActiveTab('profile')}
            className={`border-b-2 pb-3 font-semibold transition ${
              activeTab === 'profile' ? 'border-[#0A0A0A] text-[#0A0A0A]' : 'border-transparent text-[#8A8A8A]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`border-b-2 pb-3 font-semibold transition ${
              activeTab === 'orders' ? 'border-[#0A0A0A] text-[#0A0A0A]' : 'border-transparent text-[#8A8A8A]'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`border-b-2 pb-3 font-semibold transition ${
              activeTab === 'addresses' ? 'border-[#0A0A0A] text-[#0A0A0A]' : 'border-transparent text-[#8A8A8A]'
            }`}
          >
            Saved Addresses
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8A8A8A]">Profile Details</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div><span className="text-[#8A8A8A]">Full Name:</span> <span className="font-medium">{user.name}</span></div>
                <div><span className="text-[#8A8A8A]">Email:</span> <span className="font-medium">{user.email}</span></div>
                <div><span className="text-[#8A8A8A]">Account Type:</span> <span className="font-medium capitalize">{user.role}</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5E5] p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8A8A8A]">Quick Access</h3>
              <div className="mt-4 space-y-3 text-sm">
                {isAdmin ? (
                  <div className="rounded-lg border border-neutral-200 bg-[#F7F7F7] p-4">
                    <p className="text-xs text-[#4A4A4A]">You have administrator permissions enabled.</p>
                    <Link href="/admin" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A0A0A] underline">
                      Manage Products, Orders & Storefront →
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-[#8A8A8A]">Customer account active. Enjoy personalized order tracking.</p>
                )}
                <div className="pt-2">
                  <Link href="/shop" className="text-xs underline text-[#0A0A0A]">
                    Browse Brass & Copper Collection →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="mt-8">
            {placedOrders.length === 0 ? (
              <div className="rounded-xl border border-[#E5E5E5] p-10 text-center">
                <Package size={32} className="mx-auto text-[#E5E5E5]" />
                <p className="mt-3 text-sm text-[#8A8A8A]">No orders yet. Start shopping to see your orders here.</p>
                <Link href="/shop" className="mt-4 inline-flex rounded-full bg-[#0A0A0A] px-5 py-2 text-xs font-semibold text-white">
                  Shop Now
                </Link>
              </div>
            ) : (
              <div className="divide-y rounded-xl border border-[#E5E5E5] bg-white">
                {placedOrders.map(ord => (
                  <div className="p-5" key={ord.id}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs font-semibold text-[#0A0A0A]">{ord.id}</span>
                        <div className="text-xs text-[#8A8A8A]">Placed on {ord.date} · Paid via {ord.paymentMethod}</div>
                      </div>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 capitalize">
                        {ord.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="max-w-md text-[#4A4A4A]">{ord.items}</div>
                      <div className="font-semibold text-[#0A0A0A]">{money(ord.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E5E5E5] p-5 text-center text-xs text-[#8A8A8A]">
              <MapPin size={20} className="mx-auto text-[#E5E5E5]" />
              <p className="mt-2">No saved addresses yet. Add an address during checkout.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not logged in: Show Login / Signup form
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      {reason === 'admin_required' && (
        <div className="mb-6 rounded-lg border border-neutral-300 bg-neutral-50 p-4 text-xs text-[#0A0A0A]">
          <div className="flex items-center gap-1.5 font-semibold">
            <ShieldCheck size={16} /> Admin Access Required
          </div>
          <p className="mt-1 text-[#4A4A4A]">
            Please sign in with administrator credentials to access the admin portal.
          </p>
        </div>
      )}

      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <img src="/images/hori-metals-logo.jpg" alt="Hori Metals" className="h-16 w-auto" />
      </div>

      <h1 className="text-center text-2xl font-semibold tracking-tight">
        {mode === 'login' ? 'Welcome Back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-center text-sm text-[#8A8A8A]">
        {mode === 'login'
          ? 'Sign in to access your orders, wishlist, and account.'
          : 'Save addresses, track shipments, and build your sacred collection.'}
      </p>

      {/* Admin Demo Credentials Callout */}
      <div className="mt-6 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] p-3 text-xs text-[#4A4A4A]">
        <div className="flex items-center justify-between font-semibold text-[#0A0A0A]">
          <span>Demo Login:</span>
          <button
            type="button"
            onClick={fillAdminCredentials}
            className="flex items-center gap-1 text-[11px] text-[#0A0A0A] underline hover:text-black"
          >
            <Sparkles size={12} /> Auto-fill
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
            Email address
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="mt-1 h-12 w-full rounded-lg border border-[#E5E5E5] px-4 text-sm outline-none transition focus:border-[#0A0A0A]"
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
              Full name
            </label>
            <input
              required
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Your full name"
              className="mt-1 h-12 w-full rounded-lg border border-[#E5E5E5] px-4 text-sm outline-none transition focus:border-[#0A0A0A]"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
            Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="mt-1 h-12 w-full rounded-lg border border-[#E5E5E5] px-4 text-sm outline-none transition focus:border-[#0A0A0A]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0A0A0A] py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : mode === 'login' ? 'Continue with Email' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[#8A8A8A]">
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
          className="underline hover:text-[#0A0A0A]"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
        </button>
      </div>

      <div className="mt-8 border-t border-[#E5E5E5] pt-6 text-center text-xs text-[#8A8A8A]">
        Looking for direct store admin login?{' '}
        <Link href="/admin/login" className="underline text-[#0A0A0A] font-semibold">
          Open Admin Portal
        </Link>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-16 text-center text-xs text-[#8A8A8A]">
          Loading account...
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
