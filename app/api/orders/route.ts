import { NextRequest, NextResponse } from 'next/server';
import { getStoredOrders, saveStoredOrders, type StoredOrder } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const list = getStoredOrders();
    return NextResponse.json({ success: true, orders: list });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.items || !body.total || !body.customer) {
      return NextResponse.json(
        { success: false, error: 'Customer details, items and total are required' },
        { status: 400 }
      );
    }

    const current = getStoredOrders();
    const generatedId = body.id || `HM-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: StoredOrder = {
      id: generatedId,
      customer: body.customer,
      phone: body.phone || '',
      address: body.address || '',
      city: body.city || 'Ujjain',
      state: body.state || 'Madhya Pradesh',
      pincode: body.pincode || '456001',
      items: body.items,
      total: Number(body.total),
      paymentMethod: body.paymentMethod || 'COD',
      date: body.date || new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: body.status || 'placed',
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...current];
    saveStoredOrders(updated);

    return NextResponse.json({ success: true, order: newOrder });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to place order' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }

    const current = getStoredOrders();
    const index = current.findIndex(o => o.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    current[index].status = body.status;
    saveStoredOrders(current);

    return NextResponse.json({ success: true, order: current[index] });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Failed to update order status' },
      { status: 500 }
    );
  }
}
