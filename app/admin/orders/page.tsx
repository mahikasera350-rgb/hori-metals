'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, RefreshCw, FileText } from 'lucide-react';
import { money } from '@/lib/utils';
import type { StoredOrder } from '@/lib/db';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();

      let combined: StoredOrder[] = [];
      if (data.success && Array.isArray(data.orders)) {
        combined = [...data.orders];
      }

      // Also read local client storage for any offline orders
      try {
        const local = localStorage.getItem('hori-orders');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            parsed.forEach((lo: StoredOrder) => {
              if (!combined.some(o => o.id === lo.id)) {
                combined.push(lo);
              }
            });
          }
        }
      } catch {
        // ignore
      }

      setOrders(combined);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, newStatus: StoredOrder['status']) => {
    try {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
    } catch {
      fetchOrders();
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Address', 'City', 'Pincode', 'Items', 'Total', 'Payment', 'Date', 'Status'];
    const rows = orders.map(o => [
      o.id,
      `"${o.customer.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.address.replace(/"/g, '""')}"`,
      `"${o.city}"`,
      o.pincode,
      `"${o.items.replace(/"/g, '""')}"`,
      o.total,
      o.paymentMethod,
      o.date,
      o.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hori_metals_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs uppercase tracking-[.18em] text-[#8C6D37]">
            Sales & Dispatch Fulfillment
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
            Customer Orders ({orders.length})
          </h1>
          <p className="mt-1 text-xs text-[#7A746B]">
            Review incoming orders, customer delivery locations, and update fulfillment status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-3.5 py-2 text-xs font-semibold text-[#0A0A0A] hover:border-[#0A0A0A]"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportOrdersCSV}
            className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
          >
            <FileText size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#E5E5E5] bg-white p-4 sm:flex-row sm:items-center shadow-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-3 text-[#8A8A8A]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, phone, or city..."
            className="h-9 w-full rounded-lg border border-[#E5E5E5] pl-9 pr-3 text-xs outline-none focus:border-[#0A0A0A]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 rounded-lg border border-[#E5E5E5] bg-white px-3 text-xs outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="placed">Placed (Pending)</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-[#E5E5E5] bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#FAF8F5] text-xs font-semibold text-[#5A554E] border-b border-[#EAE6DF]">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th>Customer & Address</th>
                <th>Purchased Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-[#8A8A8A]">
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-[#8A8A8A]">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map(o => (
                  <tr key={o.id} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-[#0A0A0A]">{o.id}</div>
                      <div className="text-[11px] text-[#8A8A8A]">{o.date}</div>
                    </td>
                    <td>
                      <div className="font-medium text-xs text-[#0A0A0A]">{o.customer}</div>
                      <div className="text-[11px] text-[#8A8A8A]">{o.phone}</div>
                      <div className="text-[10px] text-[#8A8A8A] max-w-xs truncate">{o.address}, {o.city} - {o.pincode}</div>
                    </td>
                    <td className="text-xs text-[#4A4A4A] max-w-xs">{o.items}</td>
                    <td className="font-semibold text-xs text-[#0A0A0A]">{money(o.total)}</td>
                    <td>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-[#4A4A4A]">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as StoredOrder['status'])}
                        className={`h-7 rounded-full px-2.5 text-[11px] font-semibold outline-none border ${
                          o.status === 'delivered'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : o.status === 'shipped'
                            ? 'border-blue-200 bg-blue-50 text-blue-800'
                            : o.status === 'packed'
                            ? 'border-purple-200 bg-purple-50 text-purple-800'
                            : o.status === 'placed'
                            ? 'border-amber-200 bg-amber-50 text-amber-800'
                            : 'border-red-200 bg-red-50 text-red-800'
                        }`}
                      >
                        <option value="placed">Placed</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
