import { NextRequest, NextResponse } from 'next/server';
import { getStoredProducts, saveStoredProducts } from '@/lib/db';
import type { Product } from '@/lib/products';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    let list = getStoredProducts();

    if (slug) {
      const match = list.find(p => p.slug === slug);
      if (!match) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true, product: match });
    }

    if (id) {
      const match = list.find(p => p.id === id);
      if (!match) return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      return NextResponse.json({ success: true, product: match });
    }

    if (activeOnly) {
      list = list.filter(p => p.active !== false);
    }

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    return NextResponse.json({ success: true, products: list, count: list.length });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Product name and price are required' },
        { status: 400 }
      );
    }

    const current = getStoredProducts();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = body.id || `HM${Date.now().toString().slice(-4)}`;

    const newProd: Product = {
      id,
      name: body.name.trim(),
      slug,
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      material: body.material || 'Brass',
      category: body.category || 'Brass Utensils',
      weight: body.weight || '500 g',
      size: body.size || '8 in',
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      sku: body.sku || `HM-BR-${Date.now().toString().slice(-3)}`,
      description: body.description || 'Authentic handcrafted metal piece from Hori Metals, Ujjain.',
      image: body.image || (body.images && body.images[0]) || '/images/hori-metals-logo.jpg',
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.image || '/images/hori-metals-logo.jpg'],
      featured: Boolean(body.featured),
      bestSeller: Boolean(body.bestSeller),
      active: body.active !== undefined ? Boolean(body.active) : true,
      tags: Array.isArray(body.tags) ? body.tags : [body.material?.toLowerCase() || 'brass', body.category?.toLowerCase() || 'utensils'],
      rating: body.rating ? Number(body.rating) : 5.0,
      reviewsCount: body.reviewsCount ? Number(body.reviewsCount) : 1,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [newProd, ...current];
    const saved = saveStoredProducts(updatedList);

    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to write product to database.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: newProd });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Product ID is required for updating.' }, { status: 400 });
    }

    const current = getStoredProducts();
    const index = current.findIndex(p => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    const existing = current[index];
    const updatedProd: Product = {
      ...existing,
      ...body,
      price: Number(body.price ?? existing.price),
      salePrice: body.salePrice !== undefined ? (body.salePrice ? Number(body.salePrice) : undefined) : existing.salePrice,
      stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
      image: body.image || (body.images && body.images[0]) || existing.image,
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : existing.images,
      featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
      bestSeller: body.bestSeller !== undefined ? Boolean(body.bestSeller) : existing.bestSeller,
      active: body.active !== undefined ? Boolean(body.active) : existing.active,
    };

    current[index] = updatedProd;
    const saved = saveStoredProducts(current);

    if (!saved) {
      return NextResponse.json({ success: false, error: 'Failed to save updated product.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: updatedProd });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const current = getStoredProducts();
    const filtered = current.filter(p => p.id !== id);

    if (filtered.length === current.length) {
      return NextResponse.json({ success: false, error: 'Product not found.' }, { status: 404 });
    }

    saveStoredProducts(filtered);
    return NextResponse.json({ success: true, message: 'Product deleted successfully', id });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}
