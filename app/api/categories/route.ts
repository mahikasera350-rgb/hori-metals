import { NextRequest, NextResponse } from 'next/server';
import { getStoredCategories, saveStoredCategories, type CategoryItem } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const list = getStoredCategories();
    return NextResponse.json({ success: true, categories: list });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const current = getStoredCategories();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (current.some(c => c.slug === slug)) {
      return NextResponse.json({ success: false, error: 'Category with this slug already exists' }, { status: 400 });
    }

    const newItem: CategoryItem = {
      name: body.name.trim(),
      slug,
      description: body.description || '',
      active: body.active !== undefined ? Boolean(body.active) : true,
    };

    const updated = [...current, newItem];
    saveStoredCategories(updated);

    return NextResponse.json({ success: true, category: newItem });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to save category' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.slug) {
      return NextResponse.json({ success: false, error: 'Category slug is required' }, { status: 400 });
    }

    const current = getStoredCategories();
    const index = current.findIndex(c => c.slug === body.slug);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    current[index] = {
      ...current[index],
      ...body,
    };
    saveStoredCategories(current);

    return NextResponse.json({ success: true, category: current[index] });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update category' },
      { status: 500 }
    );
  }
}
