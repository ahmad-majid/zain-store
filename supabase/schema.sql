-- ============================================================
-- Thrift Aura — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;

create policy "Anyone can view categories" on public.categories
  for select using (true);

create policy "Only admins can manage categories" on public.categories
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  original_price decimal(10,2),
  category_id uuid references public.categories(id) on delete set null,
  sizes text[] default '{}',
  condition text default 'Good' check (condition in ('Like New', 'Excellent', 'Good', 'Fair')),
  images text[] default '{}',
  featured boolean default false,
  stock_count integer default 1,
  created_at timestamptz default now()
);
alter table public.products enable row level security;

create policy "Anyone can view products" on public.products
  for select using (true);

create policy "Only admins can manage products" on public.products
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  total decimal(10,2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz default now()
);
alter table public.orders enable row level security;

create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer default 1,
  size text,
  price decimal(10,2) not null,
  created_at timestamptz default now()
);
alter table public.order_items enable row level security;

create policy "Users can view own order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "Users can insert own order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

-- ============================================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================================
-- Run in Supabase Dashboard > Storage > New Bucket
-- Name: product-images, Public: true

-- ============================================================
-- SEED CATEGORIES
-- ============================================================
insert into public.categories (name, slug, description) values
  ('Tops', 'tops', 'Shirts, blouses, t-shirts and more'),
  ('Bottoms', 'bottoms', 'Jeans, trousers, skirts and more'),
  ('Dresses', 'dresses', 'Casual and formal dresses'),
  ('Outerwear', 'outerwear', 'Jackets, coats, blazers'),
  ('Accessories', 'accessories', 'Bags, belts, scarves and more');
