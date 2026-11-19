import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake, MapPin, Flame, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pb-20">
      {/* Hero */}
      <section className="border-b border-[#E5E5E5] bg-[#F7F7F7]/60 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-medium text-[#4A4A4A]">
            <MapPin size={13} className="text-[#0A0A0A]" />
            <span>Rooted in Ujjain, Madhya Pradesh</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#0A0A0A] sm:text-5xl">
            A modern home for sacred Indian metalcraft.
          </h1>
          <p className="mt-6 text-base leading-8 text-[#4A4A4A] sm:text-lg">
            Hori Metals is a traditional Kasera family enterprise from the sacred city of Mahakal,
            bringing generations of brass casting, hammered copperware, and handcrafted pooja essentials
            directly to homes and temples across India.
          </p>
        </div>
      </section>

      {/* Story Sections */}
      <div className="mx-auto max-w-4xl space-y-16 px-4 pt-16 sm:px-6">
        {/* Heritage Section */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">The Kasera Heritage</span>
            <h2 className="mt-2 text-2xl font-semibold text-[#0A0A0A]">
              Centuries of casting, beating, and finishing sacred alloys.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#4A4A4A]">
              In Sanskrit, brass (Pittal) and copper (Taamba) carry deep ritual significance.
              For generations, our family artisans in Ujjain have cast temple bells with balanced acoustics,
              hand-hammered therapeutic water vessels, and spun ceremonial thalis used in worship.
            </p>
            <p className="mt-3 text-sm leading-7 text-[#4A4A4A]">
              We adhere strictly to non-leaded brass formulations, ensuring each vessel is heavy, durable,
              and naturally lustrous without synthetic coatings.
            </p>
          </div>
          <div className="overflow-hidden border border-[#E5E5E5] bg-[#F7F7F7] aspect-[4/3]">
            <img
              src="/images/hero/hero-pooja-banner.jpg"
              alt="Artisanal metal vessels"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="border-t border-[#E5E5E5] pt-14">
          <span className="text-xs uppercase tracking-[.18em] text-[#8A8A8A]">Our Commitment</span>
          <h2 className="mt-2 text-2xl font-semibold text-[#0A0A0A]">Why patrons choose Hori Metals</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="border border-[#E5E5E5] bg-white p-6">
              <ShieldCheck size={22} className="text-[#0A0A0A]" />
              <h3 className="mt-4 font-semibold text-[#0A0A0A]">Purity & Weight</h3>
              <p className="mt-2 text-xs leading-5 text-[#8A8A8A]">
                We transparently disclose exact weights and dimensions for every piece. No thin sheet stampings.
              </p>
            </div>

            <div className="border border-[#E5E5E5] bg-white p-6">
              <Flame size={22} className="text-[#0A0A0A]" />
              <h3 className="mt-4 font-semibold text-[#0A0A0A]">Vedic Craftsmanship</h3>
              <p className="mt-2 text-xs leading-5 text-[#8A8A8A]">
                Idols and diyas cast according to traditional proportions that honor ritual sanctity.
              </p>
            </div>

            <div className="border border-[#E5E5E5] bg-white p-6">
              <HeartHandshake size={22} className="text-[#0A0A0A]" />
              <h3 className="mt-4 font-semibold text-[#0A0A0A]">Direct from Artisans</h3>
              <p className="mt-2 text-xs leading-5 text-[#8A8A8A]">
                Dispatched straight from our workshop in Freeganj, Ujjain, with insured door-to-door delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-semibold text-[#0A0A0A]">Experience the touch of authentic metalcraft</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[#4A4A4A]">
            Discover hand-finished brass pooja sets, ayurvedic copper carafes, and handcrafted urli centerpieces.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Shop All Products <ArrowRight size={15} />
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#E5E5E5] bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] transition hover:border-[#0A0A0A]"
            >
              Contact Workshop
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
