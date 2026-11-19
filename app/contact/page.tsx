'use client';

import { useState } from 'react';
import { Phone, MessageCircle, MapPin, Mail, CheckCircle2, Send, Clock } from 'lucide-react';
import { BUSINESS } from '@/lib/config';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">Get in Touch</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[#0A0A0A]">
          Contact {BUSINESS.name}
        </h1>
        <p className="mt-3 text-base text-[#4A4A4A]">
          Have questions about ceremonial temple bells, wholesale inquiries, or customized pooja thalis?
          Our artisans and customer support team in {BUSINESS.city} are here to assist you.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-xl border border-[#E5E5E5] bg-white p-8">
          <h2 className="text-lg font-semibold text-[#0A0A0A]">Send an Inquiry</h2>
          <p className="mt-1 text-xs text-[#8A8A8A]">
            Fill out the form below and we will get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-lg border border-neutral-200 bg-[#F7F7F7] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] text-white">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0A0A0A]">Message Sent</h3>
              <p className="mt-2 text-xs leading-5 text-[#4A4A4A]">
                Thank you, <b>{name}</b>. We have received your inquiry and will contact you at <b>{email || phone}</b> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setPhone('');
                  setMessage('');
                }}
                className="mt-5 rounded-full border border-[#0A0A0A] px-5 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#0A0A0A] hover:text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">Full Name *</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A]">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A]">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98260 XXXXX"
                    className="mt-1.5 h-11 w-full rounded-lg border border-[#E5E5E5] px-3.5 text-sm outline-none transition focus:border-[#0A0A0A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A4A4A]">How can we help? *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about the items you require, custom requirements, or shipping questions..."
                  className="mt-1.5 w-full rounded-lg border border-[#E5E5E5] p-3 text-sm outline-none transition focus:border-[#0A0A0A]"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                <Send size={15} /> Send message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-8">
            <h2 className="text-lg font-semibold text-[#0A0A0A]">Store & Workshop</h2>
            <div className="mt-6 space-y-5 text-sm text-[#4A4A4A]">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#0A0A0A]" />
                <div>
                  <div className="font-medium text-[#0A0A0A]">{BUSINESS.name} Workshop & Retail</div>
                  <div className="mt-0.5 text-xs text-[#8A8A8A]">{BUSINESS.address}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-[#0A0A0A]" />
                <div>
                  <div className="font-medium text-[#0A0A0A]">Phone Support</div>
                  <a href={`tel:+${BUSINESS.phoneRaw}`} className="mt-0.5 block text-xs underline text-[#0A0A0A]">
                    {BUSINESS.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-[#0A0A0A]" />
                <div>
                  <div className="font-medium text-[#0A0A0A]">WhatsApp Chat</div>
                  <a
                    href={BUSINESS.whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs underline text-[#0A0A0A]"
                  >
                    Chat directly with our metal artisans ({BUSINESS.phone})
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-sm font-bold">@</span>
                <div>
                  <div className="font-medium text-[#0A0A0A]">Instagram</div>
                  <a
                    href={BUSINESS.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block text-xs underline text-[#0A0A0A]"
                  >
                    Follow {BUSINESS.instagramHandle} for live workshop updates
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-[#0A0A0A]" />
                <div>
                  <div className="font-medium text-[#0A0A0A]">Business Hours</div>
                  <div className="mt-0.5 text-xs text-[#8A8A8A]">{BUSINESS.hours}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-6">
            <h3 className="text-sm font-semibold text-[#0A0A0A]">Wholesale & Custom Temple Casting</h3>
            <p className="mt-2 text-xs leading-5 text-[#4A4A4A]">
              We supply traditional brass vessels, heavy copperware, and carved bells to ashrams, temples, and gift distributors across India. Call or WhatsApp us directly for quotation requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
