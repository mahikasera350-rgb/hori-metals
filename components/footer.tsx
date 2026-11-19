import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { BUSINESS } from '@/lib/config';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[#EAE6DF] bg-[#FAF8F5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <Link href="/">
            <img
              src="/images/hori-metals-logo.jpg"
              alt="Hori Metals"
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-[#5A554E]">
            Authentic handcrafted brass, therapeutic hammered copperware, and sacred pooja essentials from the historic city of {BUSINESS.city}. Hand-finished with generational Kasera metalworking mastery.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 text-xs text-[#5A554E]">
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="text-[#8C6D37]" />
              <span>{BUSINESS.address}</span>
            </div>
            <a
              href={`tel:+${BUSINESS.phoneRaw}`}
              className="flex items-center gap-2.5 font-medium text-[#1A1A1A] hover:text-[#8C6D37] transition"
            >
              <Phone size={15} className="text-[#8C6D37]" />
              <span>{BUSINESS.phone}</span>
            </a>
            <a
              href={BUSINESS.whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-medium text-[#1A1A1A] hover:text-[#8C6D37] transition"
            >
              <MessageCircle size={15} className="text-[#8C6D37]" />
              <span>WhatsApp Support ({BUSINESS.phone})</span>
            </a>
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 font-medium text-[#1A1A1A] hover:text-[#8C6D37] transition"
            >
              <InstagramIcon size={15} />
              <span>Instagram: {BUSINESS.instagramHandle}</span>
              <ArrowUpRight size={13} className="text-[#8A8A8A]" />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6D37]">
            Artisan Collections
          </div>
          <div className="mt-4 grid gap-2.5 text-xs text-[#5A554E]">
            <Link href="/shop" className="hover:text-[#1A1A1A] transition">All Metalcraft</Link>
            <Link href="/shop?category=Pooja+Thali+Sets" className="hover:text-[#1A1A1A] transition">Pooja Thali Sets</Link>
            <Link href="/shop?category=Copper+Bottles" className="hover:text-[#1A1A1A] transition">Copper Bottles</Link>
            <Link href="/shop?category=Diyas+%26+Lamps" className="hover:text-[#1A1A1A] transition">Diyas & Deepams</Link>
            <Link href="/shop?category=Idols" className="hover:text-[#1A1A1A] transition">Sacred Idols</Link>
            <Link href="/shop?category=Bells" className="hover:text-[#1A1A1A] transition">Temple Bells</Link>
            <Link href="/about" className="hover:text-[#1A1A1A] transition">Kasera Heritage Story</Link>
            <Link href="/contact" className="hover:text-[#1A1A1A] transition">Workshop & Wholesale</Link>
          </div>
        </div>

        {/* Customer Care & Policies */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#8C6D37]">
            Trust & Support
          </div>
          <div className="mt-4 grid gap-2.5 text-xs text-[#5A554E]">
            <Link href="/shipping-returns" className="hover:text-[#1A1A1A] transition">Pan-India Delivery</Link>
            <Link href="/shipping-returns" className="hover:text-[#1A1A1A] transition">Returns & Exchanges</Link>
            <Link href="/faq" className="hover:text-[#1A1A1A] transition">Care Guidelines & FAQ</Link>
            <Link href="/privacy" className="hover:text-[#1A1A1A] transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#1A1A1A] transition">Terms of Service</Link>
            <Link href="/account" className="hover:text-[#1A1A1A] transition">My Account</Link>
            <Link href="/admin/login" className="hover:text-[#1A1A1A] transition font-medium text-[#1A1A1A]">Admin Portal</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-[#EAE6DF] bg-[#F5F1EB] py-5 text-center text-xs text-[#7A746B]">
        © {new Date().getFullYear()} {BUSINESS.name} · Ujjain, Madhya Pradesh · Crafted with Vedic Devotion in India
      </div>
    </footer>
  );
}

export function WhatsApp() {
  return (
    <a
      aria-label="Chat with Hori Metals on WhatsApp"
      href={BUSINESS.whatsAppUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95"
      title="Chat on WhatsApp (+91 9111934512)"
    >
      <MessageCircle size={26} />
    </a>
  );
}
