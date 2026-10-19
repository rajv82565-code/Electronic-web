import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const chats = db.prepare(`SELECT s.*, u.name as user_name, u.email as user_email FROM support_chat s
      JOIN users u ON s.user_id = u.user_id ORDER BY s.created_at DESC LIMIT 200`).all();
    const conversations = db.prepare(`SELECT DISTINCT user_id FROM support_chat ORDER BY MAX(created_at) DESC`).all() as { user_id: number }[];
    return NextResponse.json({ chats, conversations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { userId, message } = await req.json();
    const db = getDb();
    db.prepare('INSERT INTO support_chat (user_id, message, sender) VALUES (?,?,?)').run(userId, message, 'admin');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
