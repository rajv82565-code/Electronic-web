import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE order_id = ? AND (user_id = ? OR ? = \'admin\')').get(id, user.userId, user.role) as any;
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  const items = db.prepare(`SELECT oi.*, p.name, p.brand, p.images FROM order_items oi JOIN products p ON oi.product_id = p.product_id WHERE oi.order_id = ?`).all(id);
  return NextResponse.json({ order, items });
}
