import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'created_at';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = `SELECT p.*, c.category_name, c.slug as category_slug FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.status = 'active'`;
    const params: any[] = [];

    if (category) { query += ` AND c.slug = ?`; params.push(category); }
    if (brand) { query += ` AND p.brand = ?`; params.push(brand); }
    if (search) { query += ` AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)`; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
    if (minPrice) { query += ` AND p.price >= ?`; params.push(parseFloat(minPrice)); }
    if (maxPrice) { query += ` AND p.price <= ?`; params.push(parseFloat(maxPrice)); }
    if (minRating) { query += ` AND p.rating >= ?`; params.push(parseFloat(minRating)); }
    if (featured) { query += ` AND p.featured = 1`; }

    const sortMap: Record<string, string> = { price_asc: 'p.price ASC', price_desc: 'p.price DESC', rating: 'p.rating DESC', newest: 'p.created_at DESC', popular: 'p.review_count DESC' };
    query += ` ORDER BY ${sortMap[sort] || 'p.created_at DESC'} LIMIT ?`;
    params.push(limit);

    const products = db.prepare(query).all(...params);
    return NextResponse.json({ products });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
