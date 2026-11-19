'use client';

import { useState } from 'react';
import { Search, Mail, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'replied';
};

const initialMessages: Message[] = [
  {
    id: 'MSG-01',
    name: 'Suresh Patel',
    email: 'suresh.p@example.com',
    subject: 'Bulk brass urli order for wedding',
    message: 'Hello Hori Metals team, we are planning a wedding in Ahmedabad and need 50 pieces of the 14-inch Brass Decorative Urli. Do you offer wholesale bulk pricing and customized box packaging?',
    date: 'Today, 09:40 AM',
    status: 'new',
  },
  {
    id: 'MSG-02',
    name: 'Ananya Gupta',
    email: 'ananya.g@example.com',
    subject: 'Copper bottle maintenance question',
    message: 'How should I clean the pure copper bottle to maintain its shine without scratching the hammered surface? Is pitambari or tamarind recommended?',
    date: 'Yesterday, 04:15 PM',
    status: 'replied',
  },
  {
    id: 'MSG-03',
    name: 'Pandit Rameshwar Shastri',
    email: 'rameshwar.ujjain@example.com',
    subject: 'Custom temple bell carving',
    message: 'We require a heavy ceremonial brass temple bell (15 kg+) with Gayatri mantra engraving for our ashram near Ram Ghat. Can you cast this?',
    date: 'Oct 22, 2026',
    status: 'replied',
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [query, setQuery] = useState('');

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.subject.toLowerCase().includes(query.toLowerCase()) ||
    m.message.toLowerCase().includes(query.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id ? { ...m, status: m.status === 'new' ? 'replied' : 'new' } : m
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">
          Customer Support & Inquiries
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0A0A0A]">
          Messages ({messages.length})
        </h1>
      </div>

      <div className="rounded-lg border border-[#E5E5E5] bg-white p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-3 text-[#8A8A8A]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search inquiries by sender name, subject or keyword..."
            className="h-9 w-full rounded border border-[#E5E5E5] pl-9 pr-3 text-xs outline-none focus:border-[#0A0A0A]"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(m => (
          <div key={m.id} className="border border-[#E5E5E5] bg-white p-5 transition">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E5E5] pb-3">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-xs text-[#0A0A0A]">{m.name}</span>
                <span className="text-xs text-[#8A8A8A]">({m.email})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#8A8A8A]">{m.date}</span>
                <button
                  onClick={() => toggleStatus(m.id)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition ${
                    m.status === 'replied'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {m.status === 'replied' ? 'Replied' : 'New Inquiry'}
                </button>
              </div>
            </div>

            <div className="mt-3">
              <div className="text-xs font-semibold text-[#0A0A0A]">{m.subject}</div>
              <p className="mt-2 text-xs leading-6 text-[#4A4A4A]">{m.message}</p>
            </div>

            <div className="mt-4 flex gap-3 text-xs">
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                className="font-semibold underline text-[#0A0A0A]"
              >
                Reply via Email →
              </a>
              <button
                onClick={() => toggleStatus(m.id)}
                className="text-[#8A8A8A] underline hover:text-[#0A0A0A]"
              >
                Mark as {m.status === 'new' ? 'Replied' : 'Unread'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
