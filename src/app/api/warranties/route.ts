import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const warranties = db.prepare(`SELECT w.*, p.name as product_name, p.brand, p.images FROM warranties w
    JOIN products p ON w.product_id = p.product_id WHERE w.user_id = ? ORDER BY w.created_at DESC`).all(user.userId);
  return NextResponse.json({ warranties });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { productId, orderId, serialNumber, invoiceNumber, purchaseDate, warrantyMonths } = await req.json();
    const db = getDb();
    const expiry = new Date(purchaseDate);
    expiry.setMonth(expiry.getMonth() + (warrantyMonths || 12));
    const result = db.prepare(`INSERT INTO warranties (user_id, product_id, order_id, serial_number, invoice_number, purchase_date, expiry_date, status)
      VALUES (?,?,?,?,?,?,?,?)`).run(user.userId, productId, orderId || null, serialNumber, invoiceNumber || null, purchaseDate, expiry.toISOString().split('T')[0], 'active');
    return NextResponse.json({ success: true, warrantyId: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
