import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET() {
  const db = getDb();
  const categories = db.prepare(`
    SELECT c.*, 
           COUNT(p.product_id) as product_count, 
           MIN(p.price) as min_price 
    FROM categories c 
    LEFT JOIN products p ON c.category_id = p.category_id 
    GROUP BY c.category_id 
    ORDER BY c.category_name
  `).all();
  return NextResponse.json({ categories });
}
