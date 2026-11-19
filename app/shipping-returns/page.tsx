import { BUSINESS } from '@/lib/config';

export default function Shipping() {
  return (
    <Policy title="Shipping & Returns">
      <h2 className="text-lg font-semibold text-[#0A0A0A] mt-6">Shipping</h2>
      <p className="mt-2 text-sm leading-7 text-[#4A4A4A]">
        Orders are packed after confirmation and generally delivered within 3–7 business days across India. Delivery timing can vary by destination pincode.
      </p>
      <h2 className="text-lg font-semibold text-[#0A0A0A] mt-6">Returns & Exchanges</h2>
      <p className="mt-2 text-sm leading-7 text-[#4A4A4A]">
        For damaged or incorrect items, contact {BUSINESS.name} within 48 hours of delivery with unboxing photos/videos. Approved returns are reviewed case-by-case and replacements dispatched promptly.
      </p>
      <h2 className="text-lg font-semibold text-[#0A0A0A] mt-6">Patron Support</h2>
      <p className="mt-2 text-sm leading-7 text-[#4A4A4A]">
        For order assistance or transit queries, WhatsApp us at{' '}
        <a href={BUSINESS.whatsAppUrl} className="font-medium underline text-[#0A0A0A]" target="_blank" rel="noopener noreferrer">
          {BUSINESS.phone}
        </a>
        .
      </p>
    </Policy>
  );
}

function Policy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-[#0A0A0A]">{title}</h1>
      <div className="mt-8 space-y-4">{children}</div>
    </div>
  );
}
