import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const warranties = db.prepare(`SELECT w.*, u.name as customer_name, u.email as customer_email, p.name as product_name, p.brand
      FROM warranties w JOIN users u ON w.user_id = u.user_id JOIN products p ON w.product_id = p.product_id
      ORDER BY w.created_at DESC`).all();
    return NextResponse.json({ warranties });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { warrantyId, status } = await req.json();
    const db = getDb();
    db.prepare('UPDATE warranties SET status = ? WHERE warranty_id = ?').run(status, warrantyId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
