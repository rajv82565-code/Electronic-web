import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getDb();
    const products = db.prepare(`SELECT p.*, c.category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id ORDER BY p.created_at DESC`).all();
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getDb();
    const body = await req.json();
    const result = db.prepare(`INSERT INTO products (name, brand, category_id, description, specifications, price, discount, stock, warranty_period_months, supplier_id, images, featured, status)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(body.name, body.brand, body.category_id, body.description, JSON.stringify(body.specifications || {}), body.price, body.discount || 0, body.stock, body.warranty_period_months || 12, body.supplier_id || null, JSON.stringify(body.images || []), body.featured ? 1 : 0, body.status || 'active');
    return NextResponse.json({ success: true, productId: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
