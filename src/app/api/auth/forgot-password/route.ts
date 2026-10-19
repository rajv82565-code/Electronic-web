import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const db = getDb();
    const user = db.prepare('SELECT user_id, email, name FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      // For security, still return success or user not found with hint
      return NextResponse.json({ error: 'No account found with this email address' }, { status: 404 });
    }

    // Generate simulated 6-digit OTP
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    return NextResponse.json({
      success: true,
      message: 'Password reset code generated. Use the demo verification code below to reset your password.',
      demoCode: resetCode,
      email: user.email,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
