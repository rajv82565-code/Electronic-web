import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = process.env.VERCEL
  ? path.join('/tmp', 'electronics.db')
  : path.join(process.cwd(), 'electronics.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema();
    seedData();
  }
  return db;
}

function initializeSchema() {
  const d = db;
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT DEFAULT 'customer',
      is_blocked INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT DEFAULT '📱'
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      supplier_id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_name TEXT NOT NULL,
      contact TEXT,
      address TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category_id INTEGER,
      description TEXT,
      specifications TEXT DEFAULT '{}',
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      warranty_period_months INTEGER DEFAULT 12,
      supplier_id INTEGER,
      images TEXT DEFAULT '[]',
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(category_id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
    );

    CREATE TABLE IF NOT EXISTS cart (
      cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      delivery_fee REAL DEFAULT 0,
      final_amount REAL NOT NULL,
      payment_method TEXT,
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'placed',
      shipping_address TEXT DEFAULT '{}',
      coupon_code TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );

    CREATE TABLE IF NOT EXISTS warranties (
      warranty_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      order_id INTEGER,
      serial_number TEXT NOT NULL,
      invoice_number TEXT,
      purchase_date TEXT NOT NULL,
      expiry_date TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );

    CREATE TABLE IF NOT EXISTS technicians (
      technician_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      specialization TEXT,
      experience_years INTEGER DEFAULT 1,
      availability TEXT DEFAULT 'available',
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS repairs (
      repair_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      warranty_id INTEGER,
      serial_number TEXT,
      issue_category TEXT NOT NULL,
      description TEXT,
      attachments TEXT DEFAULT '[]',
      pickup_date TEXT,
      pickup_address TEXT,
      contact_phone TEXT,
      repair_status TEXT DEFAULT 'submitted',
      technician_id INTEGER,
      technician_notes TEXT,
      repair_cost REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      FOREIGN KEY (technician_id) REFERENCES technicians(technician_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      review_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      review TEXT,
      verified_purchase INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(user_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS support_chat (
      chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      sender TEXT DEFAULT 'user',
      attachment TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    );

    CREATE TABLE IF NOT EXISTS seed_done (
      id INTEGER PRIMARY KEY,
      done INTEGER DEFAULT 0
    );
  `);
}

function seedData() {
  const d = db;
  const seedCheck = d.prepare('SELECT done FROM seed_done WHERE id = 1').get() as { done: number } | undefined;
  if (seedCheck?.done) {
    // Check if products need image path migration
    const oldImg = d.prepare("SELECT product_id FROM products WHERE images LIKE '%/products/%' LIMIT 1").get();
    if (!oldImg) return;
  }

  const pw = bcrypt.hashSync('password123', 10);
  const adminPw = bcrypt.hashSync('admin123', 10);

  // Users
  d.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash, phone, address, role) VALUES (?,?,?,?,?,?)`).run(
    'John Doe', 'john@example.com', pw, '+91-9876543210',
    JSON.stringify({ street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001' }),
    'customer'
  );
  d.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash, phone, address, role) VALUES (?,?,?,?,?,?)`).run(
    'Priya Sharma', 'priya@example.com', pw, '+91-9123456789',
    JSON.stringify({ street: '45, Linking Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' }),
    'customer'
  );
  d.prepare(`INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (?,?,?,?)`).run(
    'Admin User', 'admin@techvolt.com', adminPw, 'admin'
  );

  // Categories
  const cats = [
    ['Smartphones', 'smartphones', '📱'],
    ['Laptops', 'laptops', '💻'],
    ['Tablets', 'tablets', '⬛'],
    ['Smart Watches', 'smart-watches', '⌚'],
    ['Headphones', 'headphones', '🎧'],
    ['Earbuds', 'earbuds', '🎵'],
    ['Cameras', 'cameras', '📷'],
    ['Gaming Devices', 'gaming-devices', '🎮'],
    ['Computer Accessories', 'computer-accessories', '🖱️'],
    ['Chargers', 'chargers', '🔌'],
    ['Power Banks', 'power-banks', '🔋'],
    ['Smart Home', 'smart-home', '🏠'],
  ];
  const catStmt = d.prepare(`INSERT OR IGNORE INTO categories (category_name, slug, icon) VALUES (?,?,?)`);
  cats.forEach(([n, s, i]) => catStmt.run(n, s, i));

  // Suppliers
  d.prepare(`INSERT OR IGNORE INTO suppliers (supplier_name, contact, address) VALUES (?,?,?)`).run('TechSource India', '+91-9000011111', 'Delhi, India');
  d.prepare(`INSERT OR IGNORE INTO suppliers (supplier_name, contact, address) VALUES (?,?,?)`).run('GadgetHub', '+91-8000022222', 'Mumbai, India');

  // Products with high-res photography
  const products = [
    {
      name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung', cat: 1,
      desc: 'The ultimate Samsung smartphone with S Pen, titanium frame, and 200MP camera system.',
      specs: { Display: '6.9" QHD+ AMOLED 120Hz', Processor: 'Snapdragon 8 Elite', RAM: '12GB', Storage: '256GB', Camera: '200MP + 50MP + 10MP', Battery: '5000mAh', OS: 'Android 15', 'S Pen': 'Yes' },
      price: 124999, discount: 8, stock: 15, warranty: 12, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80', 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=700&q=80'], rating: 4.7, reviews: 324, featured: 1
    },
    {
      name: 'Apple iPhone 17 Pro', brand: 'Apple', cat: 1,
      desc: 'Apple\'s flagship iPhone with A19 Pro chip, titanium design, and advanced camera system.',
      specs: { Display: '6.3" Super Retina XDR', Processor: 'A19 Pro', RAM: '8GB', Storage: '256GB', Camera: '48MP Main + 12MP Ultra Wide', Battery: '3274mAh', OS: 'iOS 18' },
      price: 134999, discount: 5, stock: 3, warranty: 12, images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=700&q=80', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=700&q=80'], rating: 4.8, reviews: 512, featured: 1
    },
    {
      name: 'OnePlus 13', brand: 'OnePlus', cat: 1,
      desc: 'Flagship killer with Snapdragon 8 Elite, 50W wireless charging and Hasselblad cameras.',
      specs: { Display: '6.82" LTPO AMOLED 120Hz', Processor: 'Snapdragon 8 Elite', RAM: '16GB', Storage: '512GB', Camera: '50MP Triple Camera', Battery: '6000mAh', OS: 'OxygenOS 15' },
      price: 69999, discount: 12, stock: 25, warranty: 12, images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=700&q=80'], rating: 4.5, reviews: 218, featured: 0
    },
    {
      name: 'Apple MacBook Pro 16" M4', brand: 'Apple', cat: 2,
      desc: 'The most powerful MacBook ever with M4 Pro chip, Liquid Retina XDR display, and all-day battery life.',
      specs: { Display: '16.2" Liquid Retina XDR', Processor: 'Apple M4 Pro', RAM: '24GB', Storage: '512GB SSD', Battery: '22 Hours', Ports: 'Thunderbolt 4, HDMI, SD Card', OS: 'macOS Sequoia' },
      price: 249999, discount: 3, stock: 8, warranty: 12, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=700&q=80'], rating: 4.9, reviews: 189, featured: 1
    },
    {
      name: 'Dell XPS 15 (2025)', brand: 'Dell', cat: 2,
      desc: 'Premium Windows laptop with Intel Core Ultra 9, OLED display, and NVIDIA RTX 4080.',
      specs: { Display: '15.6" 4K OLED Touch', Processor: 'Intel Core Ultra 9 275H', RAM: '32GB DDR5', Storage: '1TB NVMe SSD', GPU: 'NVIDIA RTX 4080 12GB', Battery: '86Wh', OS: 'Windows 11 Pro' },
      price: 189999, discount: 10, stock: 12, warranty: 24, images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=700&q=80'], rating: 4.6, reviews: 143, featured: 0
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 13', brand: 'Lenovo', cat: 2,
      desc: 'Business ultrabook with Intel Core Ultra 7, military-grade durability, and 15-hour battery.',
      specs: { Display: '14" 2.8K OLED', Processor: 'Intel Core Ultra 7 165H', RAM: '32GB LPDDR5X', Storage: '1TB SSD', Weight: '1.12 kg', Battery: '57Wh', OS: 'Windows 11 Pro' },
      price: 159999, discount: 7, stock: 20, warranty: 24, images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&q=80'], rating: 4.7, reviews: 98, featured: 0
    },
    {
      name: 'iPad Pro 13" M4', brand: 'Apple', cat: 3,
      desc: 'The ultimate iPad with M4 chip, Ultra Retina XDR display, and Apple Pencil Pro support.',
      specs: { Display: '13" Ultra Retina XDR OLED', Processor: 'Apple M4', RAM: '16GB', Storage: '512GB', Camera: '12MP + 10MP Ultra Wide', Pencil: 'Apple Pencil Pro', OS: 'iPadOS 18' },
      price: 129900, discount: 0, stock: 18, warranty: 12, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=700&q=80'], rating: 4.8, reviews: 276, featured: 1
    },
    {
      name: 'Samsung Galaxy Tab S10 Ultra', brand: 'Samsung', cat: 3,
      desc: 'Samsung\'s premium tablet with 14.6" Super AMOLED display and S Pen included.',
      specs: { Display: '14.6" Dynamic AMOLED 120Hz', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Camera: '13MP', 'S Pen': 'Included', OS: 'Android 14' },
      price: 99999, discount: 15, stock: 10, warranty: 12, images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=700&q=80'], rating: 4.6, reviews: 201, featured: 0
    },
    {
      name: 'Apple Watch Ultra 2', brand: 'Apple', cat: 4,
      desc: 'The most rugged Apple Watch with titanium case, dual-frequency GPS, and 60-hour battery.',
      specs: { Display: '49mm Always-On Retina', Processor: 'S9 SiP', GPS: 'Dual-frequency L1+L5', Battery: '60 Hours', Water: '100m', Material: 'Titanium', OS: 'watchOS 11' },
      price: 89900, discount: 0, stock: 7, warranty: 12, images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=700&q=80'], rating: 4.8, reviews: 312, featured: 1
    },
    {
      name: 'Samsung Galaxy Watch 7', brand: 'Samsung', cat: 4,
      desc: 'AI-powered health watch with advanced sleep tracking and energy score.',
      specs: { Display: '1.5" Super AMOLED', Processor: 'Exynos W1000', Battery: '40 Hours', Sensors: 'BioActive, Temperature', Water: '5ATM + IP68', OS: 'Wear OS 5' },
      price: 34999, discount: 20, stock: 30, warranty: 12, images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80'], rating: 4.4, reviews: 187, featured: 0
    },
    {
      name: 'Sony WH-1000XM6', brand: 'Sony', cat: 5,
      desc: 'Industry-leading noise cancelling headphones with 30-hour battery and LDAC support.',
      specs: { Driver: '40mm Dynamic', ANC: 'Adaptive', Battery: '30 Hours', Codec: 'LDAC, AAC, SBC', Multipoint: '2 Devices', Weight: '254g', Mic: '5 Microphones' },
      price: 34999, discount: 18, stock: 40, warranty: 12, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80'], rating: 4.9, reviews: 543, featured: 1
    },
    {
      name: 'Bose QuietComfort 45', brand: 'Bose', cat: 5,
      desc: 'World-class noise cancellation with high-fidelity audio and comfortable design.',
      specs: { Driver: '40mm Proprietary', ANC: 'Quiet & Aware Mode', Battery: '24 Hours', Codec: 'AAC, SBC', Mic: 'Adjustable', Weight: '238g' },
      price: 29900, discount: 10, stock: 22, warranty: 12, images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80'], rating: 4.7, reviews: 421, featured: 0
    },
    {
      name: 'Apple AirPods Pro 3', brand: 'Apple', cat: 6,
      desc: 'Third-generation AirPods Pro with H3 chip, Vision Pro integration, and hearing health features.',
      specs: { ANC: 'Adaptive Transparency', Chip: 'H3', Battery: '6h + 30h case', Codec: 'AAC, LC3', Water: 'IPX4', Fit: 'In-ear silicone tips' },
      price: 26900, discount: 5, stock: 50, warranty: 6, images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=700&q=80'], rating: 4.8, reviews: 689, featured: 1
    },
    {
      name: 'Sony WF-1000XM6', brand: 'Sony', cat: 6,
      desc: 'Premium truly wireless earbuds with dual-chip ANC and 12-hour battery.',
      specs: { Driver: '6mm Dynamic', ANC: 'Dual-chip AI', Battery: '12h + 36h case', Codec: 'LDAC, LC3', Water: 'IPX4', Mic: '4 Mics per side' },
      price: 22999, discount: 15, stock: 35, warranty: 12, images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80'], rating: 4.7, reviews: 298, featured: 0
    },
    {
      name: 'Sony Alpha A7R VI', brand: 'Sony', cat: 7,
      desc: 'Full-frame mirrorless camera with 61MP BSI CMOS sensor and 120fps 4K video.',
      specs: { Sensor: '61MP Full-Frame BSI CMOS', Video: '4K 120fps', ISO: '100-32000', AF: '693-point Phase-Detect', Stabilization: '5-axis IBIS', Mount: 'Sony E' },
      price: 279900, discount: 0, stock: 5, warranty: 24, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80'], rating: 4.9, reviews: 87, featured: 0
    },
    {
      name: 'Sony PlayStation 5 Pro', brand: 'Sony', cat: 8,
      desc: 'PlayStation 5 Pro with PS5 Pro Custom GPU, 45% faster rendering, and 8K gaming support.',
      specs: { CPU: 'Custom AMD Zen 2 8-core', GPU: 'PS5 Pro Custom RDNA', RAM: '16GB GDDR6', Storage: '2TB SSD', Resolution: '4K / 8K', Controller: 'DualSense' },
      price: 62990, discount: 0, stock: 12, warranty: 12, images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=700&q=80'], rating: 4.9, reviews: 834, featured: 1
    },
    {
      name: 'Xbox Series X', brand: 'Microsoft', cat: 8,
      desc: '12 teraflops of performance, 4K gaming at up to 120fps, and 1TB custom NVMe SSD.',
      specs: { CPU: 'Custom AMD Zen 2 8-core', GPU: '12 TFLOPs RDNA 2', RAM: '16GB GDDR6', Storage: '1TB NVMe SSD', Resolution: '4K 120fps', Controller: 'Xbox Wireless' },
      price: 49990, discount: 5, stock: 20, warranty: 12, images: ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=700&q=80'], rating: 4.7, reviews: 612, featured: 0
    },
    {
      name: 'Logitech MX Master 3S', brand: 'Logitech', cat: 9,
      desc: 'Advanced wireless mouse with MagSpeed scroll, 8K DPI, and multi-device support.',
      specs: { DPI: '200-8000', Buttons: '7', Battery: '70 Days', Connectivity: 'Bluetooth + Logi Bolt', Weight: '141g', Scroll: 'MagSpeed Electromagnetic' },
      price: 9495, discount: 15, stock: 60, warranty: 24, images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=700&q=80'], rating: 4.8, reviews: 1243, featured: 0
    },
    {
      name: 'Anker 240W GaN Charger', brand: 'Anker', cat: 10,
      desc: 'Compact 240W 4-port GaN charger supporting USB-C PD 3.1 and USB-A.',
      specs: { Power: '240W Total', Ports: '3x USB-C + 1x USB-A', Tech: 'GaN II, PD 3.1', Foldable: 'Yes', Weight: '280g', Safety: 'Multi-protection' },
      price: 5999, discount: 10, stock: 80, warranty: 18, images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&q=80'], rating: 4.6, reviews: 892, featured: 0
    },
    {
      name: 'Mi Power Bank 50000mAh', brand: 'Xiaomi', cat: 11,
      desc: 'High-capacity power bank with 65W fast charging and dual output ports.',
      specs: { Capacity: '50000mAh', Input: '65W USB-C', Output: '65W USB-C + 22.5W USB-A', Cells: 'Li-Polymer', Weight: '1.1kg', Safety: 'Multiple protections' },
      price: 4999, discount: 20, stock: 45, warranty: 6, images: ['https://images.unsplash.com/photo-1609592424364-539bbfa199ea?w=700&q=80'], rating: 4.5, reviews: 567, featured: 0
    },
    {
      name: 'Amazon Echo Hub', brand: 'Amazon', cat: 12,
      desc: '8" smart home control panel with Alexa built-in and Zigbee hub integration.',
      specs: { Display: '8" Touchscreen', Processor: 'Quad-core 1.7GHz', Connectivity: 'Wi-Fi 6, Bluetooth 5.0, Zigbee', Smart: 'Alexa, Matter', Power: 'PoE or Adapter' },
      price: 19999, discount: 25, stock: 28, warranty: 12, images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?w=700&q=80'], rating: 4.3, reviews: 341, featured: 0
    },
  ];

  const prodStmt = d.prepare(`INSERT OR IGNORE INTO products (name, brand, category_id, description, specifications, price, discount, stock, warranty_period_months, supplier_id, images, rating, review_count, featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const updateImgStmt = d.prepare(`UPDATE products SET images = ? WHERE name = ?`);

  products.forEach((p, idx) => {
    prodStmt.run(p.name, p.brand, p.cat, p.desc, JSON.stringify(p.specs), p.price, p.discount, p.stock, p.warranty, (idx % 2) + 1, JSON.stringify(p.images), p.rating, p.reviews, p.featured);
    // Ensure existing products get upgraded to high quality images
    updateImgStmt.run(JSON.stringify(p.images), p.name);
  });

  // Technicians
  const techs = [
    ['Raj Kumar', '+91-9001100110', 'raj@techvolt.com', 'Smartphones & Display', 5, 'available', '👨‍🔧'],
    ['Anita Singh', '+91-9002200220', 'anita@techvolt.com', 'Laptops & Motherboard', 8, 'busy', '👩‍🔧'],
    ['Vikram Patel', '+91-9003300330', 'vikram@techvolt.com', 'Apple Certified Specialist', 6, 'available', '🧑‍🔧'],
    ['Meena Joshi', '+91-9004400440', 'meena@techvolt.com', 'Gaming Devices & Consoles', 4, 'available', '👩‍💻'],
    ['Suresh Nair', '+91-9005500550', 'suresh@techvolt.com', 'Audio & Peripherals', 3, 'unavailable', '👨‍💻'],
  ];
  const techStmt = d.prepare(`INSERT OR IGNORE INTO technicians (name, phone, email, specialization, experience_years, availability, avatar) VALUES (?,?,?,?,?,?,?)`);
  techs.forEach(t => techStmt.run(...t));

  // Sample orders
  d.prepare(`INSERT OR IGNORE INTO orders (user_id, total_amount, discount_amount, delivery_fee, final_amount, payment_method, payment_status, order_status, shipping_address, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
    1, 124999, 10000, 0, 114999, 'upi', 'paid', 'delivered',
    JSON.stringify({ name: 'John Doe', street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '+91-9876543210' }),
    '2026-08-15T10:00:00'
  );
  d.prepare(`INSERT OR IGNORE INTO orders (user_id, total_amount, discount_amount, delivery_fee, final_amount, payment_method, payment_status, order_status, shipping_address, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)`).run(
    1, 34999, 6300, 0, 28699, 'credit_card', 'paid', 'delivered',
    JSON.stringify({ name: 'John Doe', street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', phone: '+91-9876543210' }),
    '2026-09-01T14:30:00'
  );

  d.prepare(`INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)`).run(1, 1, 1, 114999);
  d.prepare(`INSERT OR IGNORE INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)`).run(2, 11, 1, 28699);

  // Warranties
  d.prepare(`INSERT OR IGNORE INTO warranties (user_id, product_id, order_id, serial_number, invoice_number, purchase_date, expiry_date, status) VALUES (?,?,?,?,?,?,?,?)`).run(
    1, 1, 1, 'SN-SGS25-2026-001', 'INV-2026-0001', '2026-08-15', '2027-08-15', 'active'
  );
  d.prepare(`INSERT OR IGNORE INTO warranties (user_id, product_id, order_id, serial_number, invoice_number, purchase_date, expiry_date, status) VALUES (?,?,?,?,?,?,?,?)`).run(
    1, 11, 2, 'SN-SNYWH-2026-001', 'INV-2026-0002', '2026-09-01', '2027-09-01', 'active'
  );

  // Repair requests
  d.prepare(`INSERT OR IGNORE INTO repairs (user_id, product_id, warranty_id, serial_number, issue_category, description, pickup_date, pickup_address, contact_phone, repair_status, technician_id, technician_notes, repair_cost) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    1, 1, 1, 'SN-SGS25-2026-001', 'Screen Damage', 'The screen has cracks after accidental drop. Touch not working properly on left side.', '2026-09-25', '12, MG Road, Bangalore - 560001', '+91-9876543210', 'diagnosis', 1, 'Screen panel cracked. Need replacement display assembly. Part ordered.', 4999
  );

  // Reviews
  const reviewStmt = d.prepare(`INSERT OR IGNORE INTO reviews (user_id, product_id, rating, review, verified_purchase) VALUES (?,?,?,?,?)`);
  reviewStmt.run(1, 1, 5, 'Amazing phone! The camera quality is exceptional and S Pen is super useful. Battery easily lasts a full day. Worth every penny.', 1);
  reviewStmt.run(1, 11, 5, 'Best headphones I have ever used. The noise cancellation is unreal. Perfect for flights and office. LDAC audio quality is superb.', 1);
  reviewStmt.run(2, 1, 4, 'Great phone with excellent display. Camera is top-notch. A bit expensive but Samsung delivers quality.', 0);
  reviewStmt.run(2, 4, 5, 'The M4 Pro MacBook is an absolute beast. Handles video editing, Xcode and heavy multitasking without breaking a sweat. Silent operation is a big plus.', 0);

  // Chat messages
  d.prepare(`INSERT OR IGNORE INTO support_chat (user_id, message, sender, created_at) VALUES (?,?,?,?)`).run(1, 'Hi, I need help with my Samsung Galaxy S25 Ultra. The screen is not responding properly after I dropped it.', 'user', '2026-09-20T09:00:00');
  d.prepare(`INSERT OR IGNORE INTO support_chat (user_id, message, sender, created_at) VALUES (?,?,?,?)`).run(1, 'Hello John! I can see your device is under warranty. I recommend filing a repair request so our technician can inspect it. Would you like me to help you with that?', 'admin', '2026-09-20T09:05:00');
  d.prepare(`INSERT OR IGNORE INTO support_chat (user_id, message, sender, created_at) VALUES (?,?,?,?)`).run(1, 'Yes please, that would be great!', 'user', '2026-09-20T09:07:00');

  d.prepare(`INSERT OR REPLACE INTO seed_done (id, done) VALUES (1, 1)`).run();
}

export default getDb;
