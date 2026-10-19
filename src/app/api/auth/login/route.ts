import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    if (user.is_blocked) return NextResponse.json({ error: 'Account is blocked' }, { status: 403 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = signToken({ userId: user.user_id, email: user.email, role: user.role, name: user.name });

    const res = NextResponse.json({
      success: true,
      user: { id: user.user_id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
    res.cookies.set('auth_token', token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: '/' });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
