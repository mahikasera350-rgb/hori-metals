'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  Layers,
  Users,
  MessageSquare,
  Image as ImageIcon,
  LayoutDashboard,
  ExternalLink,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Categories', icon: Layers },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on admin login page, don't show the admin shell layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    localStorage.removeItem('hori-user');
    router.push('/account');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top Admin Header Bar */}
      <header className="border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <img src="/images/hori-metals-logo.jpg" alt="Hori Metals" className="h-8 w-auto" />
              <span className="rounded bg-[#0A0A0A] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#4A4A4A]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-mono">Admin</span>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-[#4A4A4A] hover:text-[#0A0A0A] transition"
            >
              <span>Storefront</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1.5 text-xs font-semibold text-[#4A4A4A] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav className="flex space-x-1 overflow-x-auto py-2 text-xs font-medium">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3.5 py-2 transition ${
                    isActive
                      ? 'bg-[#0A0A0A] text-white'
                      : 'text-[#4A4A4A] hover:bg-neutral-100 hover:text-[#0A0A0A]'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
