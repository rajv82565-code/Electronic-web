import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const product = db.prepare(`SELECT p.*, c.category_name, c.slug as category_slug FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.product_id = ?`).get(id) as any;
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const reviews = db.prepare(`SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? ORDER BY r.created_at DESC`).all(id);
    const related = db.prepare(`SELECT * FROM products WHERE category_id = ? AND product_id != ? AND status = 'active' LIMIT 6`).all(product.category_id, id);

    return NextResponse.json({ product, reviews, related });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
