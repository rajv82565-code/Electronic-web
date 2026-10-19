import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const repairs = db.prepare(`SELECT r.*, u.name as customer_name, u.email as customer_email, p.name as product_name, p.brand, t.name as technician_name, t.availability
      FROM repairs r JOIN users u ON r.user_id = u.user_id JOIN products p ON r.product_id = p.product_id
      LEFT JOIN technicians t ON r.technician_id = t.technician_id ORDER BY r.created_at DESC`).all();
    return NextResponse.json({ repairs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { repairId, status, technicianId, technicianNotes, repairCost } = await req.json();
    const db = getDb();
    db.prepare(`UPDATE repairs SET repair_status=?, technician_id=COALESCE(?,technician_id), technician_notes=COALESCE(?,technician_notes), repair_cost=COALESCE(?,repair_cost), updated_at=datetime('now') WHERE repair_id=?`)
      .run(status, technicianId || null, technicianNotes || null, repairCost || null, repairId);
    if (technicianId && status === 'technician_assigned') {
      db.prepare("UPDATE technicians SET availability='busy' WHERE technician_id=?").run(technicianId);
    }
    if (status === 'completed') {
      const repair = db.prepare('SELECT technician_id FROM repairs WHERE repair_id=?').get(repairId) as any;
      if (repair?.technician_id) {
        db.prepare("UPDATE technicians SET availability='available' WHERE technician_id=?").run(repair.technician_id);
      }
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
