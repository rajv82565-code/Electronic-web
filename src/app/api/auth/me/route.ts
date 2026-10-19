import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, signToken } from '@/lib/auth';
import getDb from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null });
  const db = getDb();
  const u = db.prepare('SELECT user_id, name, email, phone, address, role, created_at FROM users WHERE user_id = ?').get(user.userId) as any;
  return NextResponse.json({ user: u });
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const db = getDb();
    const body = await req.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    const currentUser = db.prepare('SELECT * FROM users WHERE user_id = ?').get(session.userId) as any;
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, currentUser.password_hash);
      if (!valid) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
      }
      const newHash = await bcrypt.hash(newPassword, 10);
      db.prepare('UPDATE users SET name = ?, phone = ?, address = ?, password_hash = ? WHERE user_id = ?')
        .run(name || currentUser.name, phone || currentUser.phone, address || currentUser.address, newHash, session.userId);
    } else {
      db.prepare('UPDATE users SET name = ?, phone = ?, address = ? WHERE user_id = ?')
        .run(name || currentUser.name, phone || currentUser.phone, address || currentUser.address, session.userId);
    }

    const updated = db.prepare('SELECT user_id, name, email, phone, address, role, created_at FROM users WHERE user_id = ?').get(session.userId) as any;
    
    const token = signToken({ userId: updated.user_id, email: updated.email, role: updated.role, name: updated.name });
    const res = NextResponse.json({ success: true, user: updated });
    res.cookies.set('auth_token', token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: '/' });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
  return res;
}
