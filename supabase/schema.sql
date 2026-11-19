create extension if not exists "pgcrypto";
create type order_status as enum ('placed','packed','shipped','delivered','cancelled');
create table if not exists profiles(id uuid primary key references auth.users(id) on delete cascade, full_name text, phone text, role text not null default 'customer' check(role in ('customer','admin')), created_at timestamptz default now());
create table if not exists categories(id uuid primary key default gen_random_uuid(),name text not null unique,slug text not null unique,image_url text,active boolean default true,created_at timestamptz default now());
create table if not exists products(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,description text,price integer not null,sale_price integer,stock integer not null default 0,sku text unique,category_id uuid references categories(id),sub_category text,material text,weight text,size text,tags text[] default '{}',featured boolean default false,active boolean default true,created_at timestamptz default now(),updated_at timestamptz default now());
create table if not exists product_images(id uuid primary key default gen_random_uuid(),product_id uuid references products(id) on delete cascade,image_url text not null,sort_order integer default 0,is_main boolean default false);
create table if not exists addresses(id uuid primary key default gen_random_uuid(),user_id uuid references profiles(id) on delete cascade,full_name text not null,phone text not null,address text not null,city text not null,state text,pincode text not null,created_at timestamptz default now());
create table if not exists orders(id uuid primary key default gen_random_uuid(),user_id uuid references profiles(id),status order_status not null default 'placed',payment_method text not null,subtotal integer not null,shipping integer not null default 0,total integer not null,shipping_address jsonb not null,created_at timestamptz default now());
create table if not exists order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders(id) on delete cascade,product_id uuid references products(id),name text not null,sku text,price integer not null,quantity integer not null);
create table if not exists wishlists(user_id uuid references profiles(id) on delete cascade,product_id uuid references products(id) on delete cascade,created_at timestamptz default now(),primary key(user_id,product_id));
create table if not exists banners(id uuid primary key default gen_random_uuid(),title text,subtitle text,image_url text,link text,active boolean default true,sort_order integer default 0);
create table if not exists contact_messages(id uuid primary key default gen_random_uuid(),name text,email text,message text,created_at timestamptz default now(),status text default 'new');

insert into categories(name,slug) values ('Brass Utensils','brass-utensils'),('Copper Bottles','copper-bottles'),('Pooja Thali Sets','pooja-thali-sets'),('Diyas & Lamps','diyas-lamps'),('Idols','idols'),('Bells','bells'),('Havan Items','havan-items'),('Kalash & Lota','kalash-lota'),('Decor & Gifts','decor-gifts') on conflict do nothing;

alter table profiles enable row level security; alter table categories enable row level security; alter table products enable row level security; alter table product_images enable row level security; alter table orders enable row level security; alter table order_items enable row level security; alter table wishlists enable row level security; alter table addresses enable row level security; alter table banners enable row level security; alter table contact_messages enable row level security;
create policy "public active products" on products for select using(active=true);
create policy "public active categories" on categories for select using(active=true);
create policy "public product images" on product_images for select using(true);
create policy "public active banners" on banners for select using(active=true);
create policy "users own profile" on profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy "users own addresses" on addresses for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "users own wishlist" on wishlists for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "users own orders" on orders for select using(auth.uid()=user_id);
create policy "users own order items" on order_items for select using(exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
-- Admin mutations should be performed through server-side Supabase service-role routes after validating profiles.role='admin'.
