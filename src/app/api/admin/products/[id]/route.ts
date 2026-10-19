import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = getDb();
    const body = await req.json();
    db.prepare(`UPDATE products SET name=?, brand=?, category_id=?, description=?, specifications=?, price=?, discount=?, stock=?, warranty_period_months=?, featured=?, status=? WHERE product_id=?`).run(body.name, body.brand, body.category_id, body.description, JSON.stringify(body.specifications || {}), body.price, body.discount || 0, body.stock, body.warranty_period_months || 12, body.featured ? 1 : 0, body.status || 'active', id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const db = getDb();
    db.prepare("UPDATE products SET status='inactive' WHERE product_id=?").run(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
