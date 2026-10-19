import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const repairs = db.prepare(`SELECT r.*, p.name as product_name, p.brand, p.images, t.name as technician_name FROM repairs r
    JOIN products p ON r.product_id = p.product_id LEFT JOIN technicians t ON r.technician_id = t.technician_id
    WHERE r.user_id = ? ORDER BY r.created_at DESC`).all(user.userId);
  return NextResponse.json({ repairs });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const db = getDb();
    const result = db.prepare(`INSERT INTO repairs (user_id, product_id, warranty_id, serial_number, issue_category, description, pickup_date, pickup_address, contact_phone, repair_status)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(user.userId, body.productId, body.warrantyId || null, body.serialNumber, body.issueCategory, body.description, body.pickupDate, body.pickupAddress, body.contactPhone, 'submitted');
    return NextResponse.json({ success: true, repairId: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
