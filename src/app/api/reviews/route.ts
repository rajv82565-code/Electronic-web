import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const db = getDb();
  let reviews;
  if (productId) {
    reviews = db.prepare(`SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.user_id WHERE r.product_id = ? ORDER BY r.created_at DESC`).all(productId);
  } else {
    reviews = db.prepare(`SELECT r.*, u.name as user_name, p.name as product_name FROM reviews r JOIN users u ON r.user_id = u.user_id JOIN products p ON r.product_id = p.product_id WHERE r.user_id = ? ORDER BY r.created_at DESC`).all(user.userId);
  }
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { productId, rating, review } = await req.json();
    const db = getDb();
    const verified = db.prepare(`SELECT 1 FROM order_items oi JOIN orders o ON oi.order_id = o.order_id WHERE o.user_id = ? AND oi.product_id = ? AND o.order_status = 'delivered'`).get(user.userId, productId);
    db.prepare(`INSERT INTO reviews (user_id, product_id, rating, review, verified_purchase) VALUES (?,?,?,?,?)
      ON CONFLICT(user_id, product_id) DO UPDATE SET rating=?, review=?, verified_purchase=?`).run(user.userId, productId, rating, review, verified ? 1 : 0, rating, review, verified ? 1 : 0);
    const avg = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE product_id = ?').get(productId) as any;
    db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE product_id = ?').run(Math.round(avg.avg * 10) / 10, avg.cnt, productId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
