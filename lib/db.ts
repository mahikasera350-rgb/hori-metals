import fs from 'fs';
import path from 'path';
import { type Product, initialSeedProducts, categories as defaultCategories } from './products';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const BANNERS_FILE = path.join(DATA_DIR, 'banners.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ─── PRODUCTS ────────────────────────────────────────────────────────
export function getStoredProducts(): Product[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(PRODUCTS_FILE)) {
      saveStoredProducts(initialSeedProducts);
      return initialSeedProducts;
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialSeedProducts;
  } catch (error) {
    console.error('Error reading stored products:', error);
    return initialSeedProducts;
  }
}

export function saveStoredProducts(products: Product[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving stored products:', error);
    return false;
  }
}

// ─── CATEGORIES ──────────────────────────────────────────────────────
export type CategoryItem = {
  name: string;
  slug: string;
  description?: string;
  active: boolean;
};

export function getStoredCategories(): CategoryItem[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(CATEGORIES_FILE)) {
      const items: CategoryItem[] = defaultCategories.map(name => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        active: true,
      }));
      saveStoredCategories(items);
      return items;
    }
    const raw = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return defaultCategories.map(name => ({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      active: true,
    }));
  }
}

export function saveStoredCategories(categories: CategoryItem[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

// ─── ORDERS ──────────────────────────────────────────────────────────
export type StoredOrder = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  items: string;
  total: number;
  paymentMethod: string;
  date: string;
  status: 'placed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
};

const defaultSeedOrders: StoredOrder[] = [
  {
    id: 'HM-ORD-841920',
    customer: 'Meera Iyer',
    phone: '+91 97412 33445',
    address: '14, 2nd Cross, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    items: 'Handcrafted Brass Pooja Thali Set (Qty: 1), Brass Diya Set (Qty: 2)',
    total: 2497,
    paymentMethod: 'Prepaid (UPI)',
    date: '18 Nov 2026',
    status: 'delivered',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'HM-ORD-752109',
    customer: 'Rajesh Sharma',
    phone: '+91 98260 11223',
    address: '72, Saket Nagar',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    items: 'Pure Copper Water Bottle 1 Litre (Qty: 2)',
    total: 1498,
    paymentMethod: 'COD',
    date: '19 Nov 2026',
    status: 'shipped',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'HM-ORD-623941',
    customer: 'Ananya Verma',
    phone: '+91 98260 44556',
    address: '28, Mahakal Marg, Freeganj',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    pincode: '456010',
    items: 'Handcrafted Brass Temple Bell with Nandi (Qty: 1)',
    total: 899,
    paymentMethod: 'COD',
    date: '20 Nov 2026',
    status: 'packed',
    createdAt: new Date().toISOString(),
  },
];

export function getStoredOrders(): StoredOrder[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(ORDERS_FILE)) {
      saveStoredOrders(defaultSeedOrders);
      return defaultSeedOrders;
    }
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultSeedOrders;
  } catch {
    return defaultSeedOrders;
  }
}

export function saveStoredOrders(orders: StoredOrder[]): boolean {
  try {
    ensureDataDir();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}
