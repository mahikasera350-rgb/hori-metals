import './globals.css';
import { Header } from '@/components/header';
import { Footer, WhatsApp } from '@/components/footer';
import { CartDrawer } from '@/components/cart';
import { StoreProvider } from '@/components/store';
import { LocationModal } from '@/components/location-modal';
import { Toast } from '@/components/toast';

export const metadata = {
  title: 'Hori Metals — Brass, Copper & Pooja Articles',
  description:
    'Brass, copper and pooja articles from Hori Metals, Ujjain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsApp />
          <CartDrawer />
          <LocationModal />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
