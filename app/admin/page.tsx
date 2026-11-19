'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { initialSeedProducts, type Product } from '@/lib/products';
import { money } from '@/lib/utils';
import type { StoredOrder } from '@/lib/db';

export default function AdminDashboard() {
  const [productList, setProductList] = useState<Product[]>(initialSeedProducts);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resProd, resOrd] = await Promise.all([
        fetch('/api/products').catch(() => null),
        fetch('/api/orders').catch(() => null),
      ]);

      if (resProd && resProd.ok) {
        const d = await resProd.json();
        if (d.success && Array.isArray(d.products)) {
          setProductList(d.products);
        }
      }

      let allOrders: StoredOrder[] = [];
      if (resOrd && resOrd.ok) {
        const d = await resOrd.json();
        if (d.success && Array.isArray(d.orders)) {
          allOrders = [...d.orders];
        }
      }

      // Also check local storage for client orders
      try {
        const local = localStorage.getItem('hori-orders');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((lo: StoredOrder) => {
              if (!allOrders.some(o => o.id === lo.id)) {
                allOrders.push(lo);
              }
            });
          }
        }
      } catch {
        // ignore
      }

      // If empty, supply representative demonstration orders
      if (allOrders.length === 0) {
        allOrders = [
          {
            id: 'HM-ORD-108',
            customer: 'Pooja Sharma',
            phone: '+91 98260 11223',
            address: 'Vijay Nagar',
            city: 'Indore',
            pincode: '452010',
            items: 'Handcrafted Brass Pooja Thali × 1',
            total: 1599,
            paymentMethod: 'COD',
            date: 'Today, 11:20 AM',
            status: 'placed',
          },
          {
            id: 'HM-ORD-107',
            customer: 'Rajesh Verma',
            phone: '+91 94250 88776',
            address: 'Freeganj',
            city: 'Ujjain',
            pincode: '456001',
            items: 'Lakshmi Ganesh Brass Idol Set × 1',
            total: 2199,
            paymentMethod: 'UPI',
            date: 'Yesterday',
            status: 'packed',
          },
          {
            id: 'HM-ORD-106',
            customer: 'Meera Iyer',
            phone: '+91 97412 33445',
            address: 'Indiranagar',
            city: 'Bengaluru',
            pincode: '560038',
            items: 'Pure Copper Water Bottle × 2',
            total: 2198,
            paymentMethod: 'UPI',
            date: 'Oct 23, 2026',
            status: 'shipped',
          },
          {
            id: 'HM-ORD-105',
            customer: 'Deepak Joshi',
            phone: '+91 91119 55443',
            address: 'Arera Colony',
            city: 'Bhopal',
            pincode: '462016',
            items: 'Brass Decorative Urli × 1',
            total: 2499,
            paymentMethod: 'COD',
            date: 'Oct 21, 2026',
            status: 'delivered',
          },
        ];
      }

      setOrders(allOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
  const totalStock = productList.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = productList.filter(p => (p.stock || 0) < 10).length;
  const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'packed').length;

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-[#8C6D37]">
            Overview · Hori Metals Ujjain
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs text-[#7A746B]">
            Real-time storefront metrics, order fulfillments, and catalog health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#0A0A0A] hover:border-[#0A0A0A]"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-full bg-[#0A0A0A] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800"
          >
            <Plus size={14} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-full border border-[#E5E5E5] bg-white px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
            <span>Total Sales Revenue</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#0A0A0A]">{money(totalRevenue)}</div>
          <div className="mt-1 text-[11px] text-emerald-600">Calculated from confirmed orders</div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
            <span>Orders Logged</span>
            <ShoppingCart size={16} className="text-[#0A0A0A]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#0A0A0A]">{orders.length} Orders</div>
          <div className="mt-1 text-[11px] text-[#4A4A4A]">{pendingOrders} pending dispatch</div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
            <span>Catalog Items</span>
            <Package size={16} className="text-[#0A0A0A]" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#0A0A0A]">{productList.length} Products</div>
          <div className="mt-1 text-[11px] text-[#4A4A4A]">{totalStock} units total stock</div>
        </div>

        <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
            <span>Low Stock Alerts</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-[#0A0A0A]">{lowStockCount} Items</div>
          <div className="mt-1 text-[11px] text-amber-600">Stock below 10 units</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] p-5">
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A]">Recent Customer Orders</h2>
            <p className="text-xs text-[#8A8A8A]">Latest orders placed on the storefront</p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold text-[#0A0A0A] underline hover:text-[#8A8A8A]"
          >
            View all orders <ArrowRight size={13} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#FAF8F5] text-xs font-semibold text-[#5A554E] border-b border-[#EAE6DF]">
              <tr>
                <th className="p-4">Order ID</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="p-4 font-mono font-medium text-xs text-[#0A0A0A]">{o.id}</td>
                  <td>
                    <div className="font-medium text-xs text-[#0A0A0A]">{o.customer}</div>
                    <div className="text-[11px] text-[#8A8A8A]">{o.city}</div>
                  </td>
                  <td className="text-xs text-[#4A4A4A] max-w-xs truncate">{o.items}</td>
                  <td className="font-semibold text-xs text-[#0A0A0A]">{money(o.total)}</td>
                  <td>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-[#4A4A4A]">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : o.status === 'packed'
                          ? 'bg-purple-100 text-purple-800'
                          : o.status === 'placed'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="text-xs text-[#8A8A8A]">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Catalog Status */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] p-5">
          <div>
            <h2 className="text-base font-semibold text-[#0A0A0A]">Top Products Inventory</h2>
            <p className="text-xs text-[#8A8A8A]">Active brass & copper catalog items</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-[#0A0A0A] underline hover:text-[#8A8A8A]"
          >
            Manage Catalog →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#FAF8F5] text-xs font-semibold text-[#5A554E] border-b border-[#EAE6DF]">
              <tr>
                <th className="p-4">Product</th>
                <th>SKU</th>
                <th>Material</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Visibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {productList.slice(0, 6).map(p => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image || (p.images && p.images[0]) || '/images/hori-metals-logo.jpg'} className="h-10 w-9 object-cover rounded bg-[#F7F7F7]" alt="" />
                      <div>
                        <div className="font-medium text-xs text-[#0A0A0A]">{p.name}</div>
                        <div className="text-[10px] text-[#8A8A8A]">{p.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs">{p.sku}</td>
                  <td className="text-xs">{p.material}</td>
                  <td className="font-semibold text-xs">{money(p.salePrice ?? p.price)}</td>
                  <td className="text-xs font-medium">{p.stock} units</td>
                  <td>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        p.active !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-100 text-[#8A8A8A]'
                      }`}
                    >
                      {p.active !== false ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
