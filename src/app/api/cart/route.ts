import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ items: [] });
  const db = getDb();
  const items = db.prepare(`SELECT c.*, p.name, p.brand, p.price, p.discount, p.images, p.stock, p.warranty_period_months
    FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?`).all(user.userId);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId, quantity = 1 } = await req.json();
  const db = getDb();
  db.prepare(`INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?) ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + ?`).run(user.userId, productId, quantity, quantity);
  return NextResponse.json({ success: true });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId, quantity } = await req.json();
  const db = getDb();
  if (quantity <= 0) {
    db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?').run(user.userId, productId);
  } else {
    db.prepare('UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?').run(quantity, user.userId, productId);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await req.json();
  const db = getDb();
  db.prepare('DELETE FROM cart WHERE user_id = ? AND product_id = ?').run(user.userId, productId);
  return NextResponse.json({ success: true });
}
