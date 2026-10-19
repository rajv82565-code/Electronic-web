import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const db = getDb();
  const repair = db.prepare(`SELECT r.*, p.name as product_name, p.brand, p.images, t.name as technician_name, t.phone as technician_phone, t.specialization FROM repairs r
    JOIN products p ON r.product_id = p.product_id LEFT JOIN technicians t ON r.technician_id = t.technician_id
    WHERE r.repair_id = ? AND (r.user_id = ? OR ? = 'admin')`).get(id, user.userId, user.role);
  if (!repair) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ repair });
}
