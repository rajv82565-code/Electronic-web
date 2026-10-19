import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 });

    const db = getDb();
    const existing = db.prepare('SELECT user_id FROM users WHERE email = ?').get(email);
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash, phone, role) VALUES (?,?,?,?,?)').run(name, email, hash, phone || '', 'customer');
    const userId = result.lastInsertRowid as number;

    const token = signToken({ userId, email, role: 'customer', name });
    const res = NextResponse.json({ success: true, user: { id: userId, name, email, role: 'customer' } });
    res.cookies.set('auth_token', token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: '/' });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
