import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const users = db.prepare(`SELECT u.*, COUNT(DISTINCT o.order_id) as order_count, COUNT(DISTINCT w.warranty_id) as warranty_count
      FROM users u LEFT JOIN orders o ON u.user_id = o.user_id LEFT JOIN warranties w ON u.user_id = w.user_id
      WHERE u.role = 'customer' GROUP BY u.user_id ORDER BY u.created_at DESC`).all();
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { userId, isBlocked } = await req.json();
    const db = getDb();
    db.prepare('UPDATE users SET is_blocked = ? WHERE user_id = ?').run(isBlocked ? 1 : 0, userId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
