'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('mahikasera350@gmail.com');
  const [password, setPassword] = useState('Kaseramahi@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillCredentials = () => {
    setEmail('mahikasera350@gmail.com');
    setPassword('Kaseramahi@123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      if (!data.isAdmin) {
        throw new Error('This account does not have administrator privileges.');
      }

      // Save user session in localStorage as well
      localStorage.setItem('hori-user', JSON.stringify(data.user));

      // Redirect directly to admin dashboard
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-[#E5E5E5] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#8A8A8A]">
          <ShieldCheck size={16} className="text-[#0A0A0A]" />
          Admin Portal
        </div>
        <div className="mt-3">
          <img src="/images/hori-metals-logo.jpg" alt="Hori Metals" className="h-12 w-auto" />
        </div>
        <p className="mt-2 text-sm text-[#4A4A4A]">
          Sign in to manage inventory, catalog categories, customer orders, and shop banners.
        </p>

        {/* Credentials Info Badge */}
        <div className="mt-6 rounded-md border border-[#E5E5E5] bg-[#F7F7F7] p-3 text-xs leading-5 text-[#4A4A4A]">
          <div className="flex items-center justify-between font-semibold text-[#0A0A0A]">
            <span>Admin Credentials</span>
            <button
              type="button"
              onClick={fillCredentials}
              className="flex items-center gap-1 text-[11px] text-[#0A0A0A] underline hover:text-black"
            >
              <Sparkles size={12} /> Auto-fill
            </button>
          </div>
          <div className="mt-1 font-mono text-[11px]">
            Email: <span className="text-[#0A0A0A]">mahikasera350@gmail.com</span><br/>
            Password: <span className="text-[#0A0A0A]">Kaseramahi@123</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1.5 h-11 w-full border border-[#E5E5E5] px-3 text-sm outline-none transition focus:border-[#0A0A0A]"
              placeholder="mahikasera350@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mt-1.5 h-11 w-full border border-[#E5E5E5] px-3 text-sm outline-none transition focus:border-[#0A0A0A]"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign in to Admin Panel'}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 border-t border-[#E5E5E5] pt-5 text-center text-xs text-[#8A8A8A]">
          <Link href="/" className="underline hover:text-[#0A0A0A]">
            ← Return to Storefront
          </Link>
          <span className="mx-2">·</span>
          <Link href="/account" className="underline hover:text-[#0A0A0A]">
            Customer Account
          </Link>
        </div>
      </div>
    </div>
  );
}
