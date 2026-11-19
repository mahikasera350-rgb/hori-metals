# Hori Metals

A mobile-first, Amazon-style but minimal e-commerce starter for Hori Metals, Ujjain — brass, copper and pooja articles.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth / Postgres / Storage
- Razorpay-ready checkout surface

## Phases included
1. Design system — strict grayscale UI, Inter, responsive tokens and reduced-motion support.
2. Storefront — home, shop/search/filter/sort, product pages, related products.
3. Auth surface — email/password + Google UI; wire to Supabase Auth.
4. Cart & checkout — local cart persistence, drawer, address form, COD/UPI-Razorpay choice, success state.
5. Admin — protected route shell, dashboard, product inventory table and management sections.
6. Polish — lazy images, accessibility labels, SEO metadata, location/pincode modal, WhatsApp CTA.

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

Run `supabase/schema.sql` in the Supabase SQL editor. Create a public Storage bucket named `product-images` and apply upload policies appropriate for your admin role.

### Supabase
Set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Enable Email and Google providers in Supabase Auth. For production, replace the demo admin cookie gate in `middleware.ts` with a server-side Supabase session + `profiles.role = 'admin'` check. Admin CRUD routes should use the service role only on the server after role validation.

### Razorpay
Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`, then add a server route that creates Razorpay orders and verifies the payment signature before marking an order paid.

## Seed products
The storefront ships with 12 demo products in `lib/products.ts` so the UI is immediately populated. For production, import these into Supabase products/product_images, then make the storefront query Supabase rather than the local seed array.

## Admin workflow
1. Create an admin profile in Supabase and set `role = 'admin'`.
2. Open `/admin`.
3. Add categories first.
4. Add a product with SKU, pricing, material, weight, size, stock and tags.
5. Upload multiple images to Storage, assign sort order and mark one `is_main=true`.
6. Product queries on the storefront should use active rows, so admin changes can appear immediately without a deployment.

## Vercel
Import the repo into Vercel, add the `.env.local` values as Vercel environment variables, deploy, then add the Vercel URL to Supabase Auth redirect URLs. Set `NEXT_PUBLIC_SITE_URL` to the production domain.

## Assumptions
- Hori Metals is based in Ujjain, Madhya Pradesh.
- WhatsApp/phone used by default: +91 91119 34531.
- Instagram is left configurable via `NEXT_PUBLIC_INSTAGRAM_URL` because no exact account URL was supplied.
- COD is the default payment option; Razorpay is intentionally wired as a production-ready integration point rather than pretending a live merchant key exists.
- Product imagery uses Unsplash demo assets until Hori Metals' own product photography is uploaded to Supabase Storage.
