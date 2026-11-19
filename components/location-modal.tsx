'use client';

import { useEffect, useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';

export function LocationModal() {
  const [show, setShow] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('hori-location-seen')) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('hori-location-seen', '1');
    setShow(false);
  };

  const save = () => {
    localStorage.setItem('hori-location-seen', '1');
    if (pin.length === 6) {
      localStorage.setItem('hori-pincode', pin);
    }
    setShow(false);
  };

  const locate = () => {
    navigator.geolocation?.getCurrentPosition(
      () => save(),
      () => {
        /* user declined – just stay on modal */
      }
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/25 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-7 shadow-2xl">
        <button onClick={dismiss} className="absolute right-4 top-4 rounded p-1 hover:bg-neutral-100" aria-label="Close">
          <X size={18} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F7]">
          <MapPin size={20} />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Check delivery to your area</h2>
        <p className="mt-2 text-sm leading-6 text-[#4A4A4A]">
          Share your location so we can show accurate delivery estimates. You can also enter a pincode manually, or skip this step.
        </p>
        <button
          onClick={locate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0A0A0A] py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <Navigation size={15} /> Use My Location
        </button>
        <div className="my-4 text-center text-xs text-[#8A8A8A]">or</div>
        <div className="flex gap-2">
          <input
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            placeholder="Enter Pincode Manually"
            className="h-11 flex-1 rounded-lg border border-[#E5E5E5] px-3 text-sm outline-none focus:border-[#0A0A0A]"
          />
          <button
            onClick={save}
            disabled={pin.length !== 6}
            className="rounded-full border border-[#0A0A0A] px-5 text-sm font-semibold transition hover:bg-[#0A0A0A] hover:text-white disabled:opacity-30"
          >
            Save
          </button>
        </div>
        <button
          onClick={dismiss}
          className="mt-4 w-full text-center text-xs text-[#8A8A8A] underline hover:text-[#0A0A0A]"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
