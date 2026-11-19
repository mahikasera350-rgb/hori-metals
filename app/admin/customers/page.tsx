'use client';

import { useState, useEffect } from 'react';
import { Search, UserCheck, Mail, Phone, MapPin } from 'lucide-react';
import { money } from '@/lib/utils';
import type { StoredOrder } from '@/lib/db';

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joined: string;
};

const initialCustomers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    phone: '+91 98260 44556',
    city: 'Ujjain, MP',
    ordersCount: 4,
    totalSpent: 8796,
    joined: 'Jan 2026',
  },
  {
    id: 'CUST-002',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    phone: '+91 98260 11223',
    city: 'Indore, MP',
    ordersCount: 2,
    totalSpent: 3198,
    joined: 'Sep 2026',
  },
  {
    id: 'CUST-003',
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    phone: '+91 97412 33445',
    city: 'Bengaluru, KA',
    ordersCount: 3,
    totalSpent: 5697,
    joined: 'Aug 2026',
  },
  {
    id: 'CUST-004',
    name: 'Deepak Joshi',
    email: 'd.joshi@example.com',
    phone: '+91 91119 55443',
    city: 'Bhopal, MP',
    ordersCount: 1,
    totalSpent: 2499,
    joined: 'Oct 2026',
  },
  {
    id: 'CUST-005',
    name: 'Vikas Agarwal',
    email: 'vikas.ag@example.com',
    phone: '+91 98110 99887',
    city: 'New Delhi, DL',
    ordersCount: 2,
    totalSpent: 4396,
    joined: 'Oct 2026',
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.orders)) {
          const list: Customer[] = [...initialCustomers];
          data.orders.forEach((o: StoredOrder) => {
            const existing = list.find(c => c.name.toLowerCase() === o.customer.toLowerCase());
            if (existing) {
              existing.ordersCount += 1;
              existing.totalSpent += o.total;
            } else {
              list.unshift({
                id: `CUST-${o.id.replace(/[^0-9]/g, '').slice(-3) || '999'}`,
                name: o.customer,
                email: `${o.customer.toLowerCase().replace(/\s+/g, '.')}@client.in`,
                phone: o.phone || '+91 9111934512',
                city: `${o.city || 'Ujjain'}, ${o.state || 'MP'}`,
                ordersCount: 1,
                totalSpent: o.total,
                joined: o.date || 'Recent',
              });
            }
          });
          setCustomers(list);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">
          Client Relationship
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
          Customers ({customers.length})
        </h1>
      </div>

      <div className="rounded-lg border border-[#E5E5E5] bg-white p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-[#8A8A8A]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by customer name, email address or city..."
            className="h-9 w-full rounded border border-[#E5E5E5] pl-9 pr-3 text-xs outline-none focus:border-[#0A0A0A]"
          />
        </div>
      </div>

      <div className="border border-[#E5E5E5] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-[#F7F7F7] text-xs text-[#4A4A4A]">
              <tr>
                <th className="p-4">Customer</th>
                <th>Contact</th>
                <th>City</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50/50 transition">
                  <td className="p-4">
                    <div className="font-medium text-xs text-[#0A0A0A]">{c.name}</div>
                    <div className="text-[11px] font-mono text-[#8A8A8A]">{c.id}</div>
                  </td>
                  <td>
                    <div className="text-xs text-[#4A4A4A]">{c.email}</div>
                    <div className="text-[11px] text-[#8A8A8A]">{c.phone}</div>
                  </td>
                  <td className="text-xs text-[#4A4A4A]">{c.city}</td>
                  <td className="text-xs font-semibold">{c.ordersCount} orders</td>
                  <td className="text-xs font-semibold text-[#0A0A0A]">{money(c.totalSpent)}</td>
                  <td className="text-xs text-[#8A8A8A]">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
