import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = getDb();
  const orders = db.prepare(`SELECT o.*, COUNT(oi.order_item_id) as item_count FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = ? GROUP BY o.order_id ORDER BY o.created_at DESC`).all(user.userId);
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { items, shippingAddress, paymentMethod, couponCode, totalAmount, discountAmount, deliveryFee, finalAmount } = await req.json();
    const db = getDb();

    const orderResult = db.prepare(`INSERT INTO orders (user_id, total_amount, discount_amount, delivery_fee, final_amount, payment_method, payment_status, order_status, shipping_address, coupon_code)
      VALUES (?,?,?,?,?,?,?,?,?,?)`).run(user.userId, totalAmount, discountAmount, deliveryFee, finalAmount, paymentMethod, 'paid', 'placed', JSON.stringify(shippingAddress), couponCode || null);

    const orderId = orderResult.lastInsertRowid as number;
    const itemStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)');
    for (const item of items) {
      itemStmt.run(orderId, item.product_id, item.quantity, item.price);
      db.prepare('UPDATE products SET stock = stock - ? WHERE product_id = ?').run(item.quantity, item.product_id);
    }
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(user.userId);

    return NextResponse.json({ success: true, orderId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
