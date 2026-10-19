import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const messages = db.prepare('SELECT * FROM support_chat WHERE user_id = ? ORDER BY created_at ASC').all(user.userId);
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { message, sender = 'user' } = await req.json();
  const db = getDb();
  const result = db.prepare('INSERT INTO support_chat (user_id, message, sender) VALUES (?,?,?)').run(user.userId, message, sender);

  // Simple AI auto-reply logic
  if (sender === 'user') {
    const lower = message.toLowerCase();
    let reply = '';
    if (lower.includes('battery') || lower.includes('charging')) {
      reply = '🔋 For battery/charging issues: Try a different cable and adapter. If the issue persists, please file a repair request and we\'ll assign a certified technician to inspect it.';
    } else if (lower.includes('screen') || lower.includes('display') || lower.includes('crack')) {
      reply = '📱 Screen damage is covered under our repair program. If your device is under warranty, the repair may be free or discounted. Please visit Repairs > New Request to schedule a pickup.';
    } else if (lower.includes('warranty')) {
      reply = '🛡️ You can check your active warranties in the Warranty Dashboard. If you haven\'t registered your product yet, go to Warranty > Register. Our warranty covers manufacturing defects for the duration specified.';
    } else if (lower.includes('order') || lower.includes('delivery') || lower.includes('shipping')) {
      reply = '📦 You can track your order in real-time at My Orders > Order Details. Typical delivery time is 3-5 business days. For urgent help, I\'m escalating this to a human support agent.';
    } else if (lower.includes('return') || lower.includes('refund')) {
      reply = '💰 We offer returns within 7 days of delivery for undamaged products. Please contact us with your order ID and we\'ll process the refund within 5-7 business days.';
    } else {
      reply = '👋 Thank you for reaching out! A support agent will assist you shortly. For faster resolution, please include your Order ID or Serial Number.';
    }
    if (reply) {
      db.prepare('INSERT INTO support_chat (user_id, message, sender) VALUES (?,?,?)').run(user.userId, reply, 'ai');
    }
  }

  return NextResponse.json({ success: true, chatId: result.lastInsertRowid });
}
