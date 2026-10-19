import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();

    const totalSales = (db.prepare("SELECT SUM(final_amount) as total FROM orders WHERE payment_status='paid'").get() as any)?.total || 0;
    const totalOrders = (db.prepare("SELECT COUNT(*) as cnt FROM orders").get() as any)?.cnt || 0;
    const totalUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role='customer'").get() as any)?.cnt || 0;
    const totalProducts = (db.prepare("SELECT COUNT(*) as cnt FROM products").get() as any)?.cnt || 0;
    const pendingOrders = (db.prepare("SELECT COUNT(*) as cnt FROM orders WHERE order_status='placed'").get() as any)?.cnt || 0;
    const activeWarranties = (db.prepare("SELECT COUNT(*) as cnt FROM warranties WHERE status='active'").get() as any)?.cnt || 0;
    const pendingRepairs = (db.prepare("SELECT COUNT(*) as cnt FROM repairs WHERE repair_status NOT IN ('completed')").get() as any)?.cnt || 0;
    const availableTechs = (db.prepare("SELECT COUNT(*) as cnt FROM technicians WHERE availability='available'").get() as any)?.cnt || 0;
    const lowStock = db.prepare("SELECT * FROM products WHERE stock <= 5 ORDER BY stock ASC LIMIT 10").all();

    const monthlySales = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, SUM(final_amount) as revenue, COUNT(*) as orders
      FROM orders WHERE payment_status='paid' GROUP BY month ORDER BY month DESC LIMIT 12
    `).all();

    const categoryRevenue = db.prepare(`
      SELECT c.category_name, SUM(oi.price * oi.quantity) as revenue FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id JOIN categories c ON p.category_id = c.category_id
      GROUP BY c.category_id ORDER BY revenue DESC
    `).all();

    const repairStats = db.prepare(`SELECT repair_status, COUNT(*) as count FROM repairs GROUP BY repair_status`).all();
    const techWorkload = db.prepare(`SELECT t.name, t.availability, t.specialization, COUNT(r.repair_id) as active_repairs
      FROM technicians t LEFT JOIN repairs r ON t.technician_id = r.technician_id AND r.repair_status NOT IN ('completed')
      GROUP BY t.technician_id`).all();

    return NextResponse.json({ totalSales, totalOrders, totalUsers, totalProducts, pendingOrders, activeWarranties, pendingRepairs, availableTechs, lowStock, monthlySales, categoryRevenue, repairStats, techWorkload });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}
