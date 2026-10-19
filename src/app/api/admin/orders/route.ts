import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const orders = db.prepare(`SELECT o.*, u.name as customer_name, u.email as customer_email, COUNT(oi.order_item_id) as item_count
      FROM orders o JOIN users u ON o.user_id = u.user_id LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id ORDER BY o.created_at DESC`).all();
    return NextResponse.json({ orders });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { orderId, status } = await req.json();
    const db = getDb();
    db.prepare('UPDATE orders SET order_status = ? WHERE order_id = ?').run(status, orderId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
