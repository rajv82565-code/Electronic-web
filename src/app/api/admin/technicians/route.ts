import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const technicians = db.prepare(`SELECT t.*, COUNT(r.repair_id) as active_repairs FROM technicians t
      LEFT JOIN repairs r ON t.technician_id = r.technician_id AND r.repair_status NOT IN ('completed')
      GROUP BY t.technician_id ORDER BY t.name`).all();
    return NextResponse.json({ technicians });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getDb();
    const body = await req.json();
    const result = db.prepare(`INSERT INTO technicians (name, phone, email, specialization, experience_years, availability, avatar) VALUES (?,?,?,?,?,?,?)`).run(body.name, body.phone, body.email, body.specialization, body.experience_years || 1, body.availability || 'available', body.avatar || '👨‍🔧');
    return NextResponse.json({ success: true, technicianId: result.lastInsertRowid });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getDb();
    const body = await req.json();
    db.prepare(`UPDATE technicians SET name=?, phone=?, email=?, specialization=?, experience_years=?, availability=? WHERE technician_id=?`).run(body.name, body.phone, body.email, body.specialization, body.experience_years, body.availability, body.technician_id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { technicianId } = await req.json();
    const db = getDb();
    db.prepare('DELETE FROM technicians WHERE technician_id = ?').run(technicianId);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
