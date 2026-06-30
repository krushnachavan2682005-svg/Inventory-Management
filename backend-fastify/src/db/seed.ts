import { pool } from "../config/database.js";
import { hashPassword } from "../shared/utils/password.js";

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const adminPassword = await hashPassword("Admin@123");
    const ownerPassword = await hashPassword("Owner@123");

    const shop1 = await client.query<{ id: string }>(
      `INSERT INTO organizations (shop_name, owner_name, email, phone, business_type, city, gstin, status, plan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'ACTIVE','PRO')
       ON CONFLICT (email) DO UPDATE SET shop_name = EXCLUDED.shop_name
       RETURNING id`,
      ["Krushna Smart Mart", "Krushna Patil", "owner1@demo.com", "+91 98765 43210", "General Retail", "Pune", "27ABCDE1234F1Z5"]
    );

    const shop2 = await client.query<{ id: string }>(
      `INSERT INTO organizations (shop_name, owner_name, email, phone, business_type, city, status, plan)
       VALUES ($1,$2,$3,$4,$5,$6,'TRIAL','GROWTH')
       ON CONFLICT (email) DO UPDATE SET shop_name = EXCLUDED.shop_name
       RETURNING id`,
      ["Metro Electronics", "Yash Chavan", "owner2@demo.com", "+91 98222 00110", "Electronics", "Mumbai"]
    );

    const org1 = shop1.rows[0].id;
    const org2 = shop2.rows[0].id;

    await client.query(
      `INSERT INTO users (name, email, password_hash, role, organization_id)
       VALUES
       ('Platform Admin', 'admin@smartretail.com', $1, 'ADMIN', NULL),
       ('Krushna Patil', 'owner1@demo.com', $2, 'SHOPKEEPER', $3),
       ('Yash Chavan', 'owner2@demo.com', $2, 'SHOPKEEPER', $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, organization_id = EXCLUDED.organization_id`,
      [adminPassword, ownerPassword, org1, org2]
    );

    const admin = await client.query<{ id: string }>("SELECT id FROM users WHERE email = 'admin@smartretail.com'");
    const owner1 = await client.query<{ id: string }>("SELECT id FROM users WHERE email = 'owner1@demo.com'");
    const ownerId = owner1.rows[0].id;

    const categories = await Promise.all(["Electronics", "Stationery", "Home", "Grocery"].map((name) =>
      client.query<{ id: string }>(
        `INSERT INTO product_categories (organization_id, name)
         VALUES ($1,$2)
         ON CONFLICT (organization_id, name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [org1, name]
      )
    ));

    const [electronics, stationery, home] = categories.map((result) => result.rows[0].id);

    const seededProducts = [
      ["USB Cable Type-C", "USB-TC-01", "89010012001", electronics, 90, 149, 199, 18, 30, 240],
      ["Bluetooth Speaker", "AUD-BS-11", "89010012002", electronics, 980, 1499, 1999, 18, 12, 8],
      ["A5 Notebook Pack", "STAT-NB-05", "89010012003", stationery, 42, 65, 80, 12, 35, 120],
      ["LED TV 42 inch", "TV-LED-42", "89010012004", electronics, 18500, 24900, 29900, 18, 3, 0],
      ["Steel Lunch Box", "HOME-LB-02", "89010012005", home, 220, 349, 449, 12, 15, 54]
    ] as const;

    for (const product of seededProducts) {
      const inserted = await client.query<{ id: string }>(
        `INSERT INTO products (organization_id, name, sku, barcode, category_id, purchase_price, selling_price, mrp, tax_rate, low_stock_threshold)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (organization_id, sku) DO UPDATE SET name = EXCLUDED.name, selling_price = EXCLUDED.selling_price
         RETURNING id`,
        [org1, ...product.slice(0, 9)]
      );
      const productId = inserted.rows[0].id;
      const stock = product[9];
      await client.query(
        `INSERT INTO inventory_balances (organization_id, product_id, available_quantity)
         VALUES ($1,$2,$3)
         ON CONFLICT (organization_id, product_id) DO UPDATE SET available_quantity = EXCLUDED.available_quantity`,
        [org1, productId, stock]
      );
      await client.query(
        `INSERT INTO inventory_movements (organization_id, product_id, movement_type, quantity, previous_quantity, new_quantity, reference_type, reason, created_by)
         VALUES ($1,$2,'PURCHASE',$3,0,$3,'SEED','Opening stock from seed data',$4)`,
        [org1, productId, stock, ownerId]
      );
    }

    await client.query(
      `INSERT INTO customers (organization_id, name, phone, email, total_purchases, credit_due, last_visit_at)
       VALUES
       ($1,'Rohit Sharma','+91 90888 11111','rohit@example.com',52400,1200,now() - interval '2 days'),
       ($1,'Priya Deshmukh','+91 90777 22222','priya@example.com',18800,0,now() - interval '3 days'),
       ($1,'Sameer Khan','+91 90666 33333','sameer@example.com',32600,4500,now() - interval '6 days')
       ON CONFLICT (organization_id, phone) DO NOTHING`,
      [org1]
    );

    await client.query(
      `INSERT INTO suppliers (organization_id, name, contact_name, phone, email, products_supplied, pending_amount, lead_time_days)
       VALUES
       ($1,'Prime Electronics Wholesale','Amit','+91 80000 10001','prime@example.com',42,28400,3),
       ($1,'Maharashtra Stationery Depot','Meera','+91 80000 10002','stationery@example.com',19,6200,2),
       ($1,'Home Utility Traders','Nikhil','+91 80000 10003','home@example.com',27,0,5)`,
      [org1]
    );

    const customer = await client.query<{ id: string }>("SELECT id FROM customers WHERE organization_id = $1 AND phone = '+91 90888 11111'", [org1]);
    const saleProduct = await client.query<{ id: string; selling_price: string; tax_rate: string }>("SELECT id, selling_price, tax_rate FROM products WHERE organization_id = $1 AND sku = 'USB-TC-01'", [org1]);
    if (customer.rows[0] && saleProduct.rows[0]) {
      const productId = saleProduct.rows[0].id;
      const unitPrice = Number(saleProduct.rows[0].selling_price);
      const quantity = 2;
      const taxAmount = Number(((unitPrice * quantity * Number(saleProduct.rows[0].tax_rate)) / 100).toFixed(2));
      const totalAmount = unitPrice * quantity + taxAmount;
      const balance = await client.query<{ available_quantity: number }>("SELECT available_quantity FROM inventory_balances WHERE organization_id=$1 AND product_id=$2", [org1, productId]);
      const previousQuantity = Number(balance.rows[0].available_quantity);
      const newQuantity = previousQuantity - quantity;
      const sale = await client.query<{ id: string }>(
        `INSERT INTO sales (organization_id, customer_id, invoice_number, subtotal, discount_total, tax_total, total_amount, status, created_by)
         VALUES ($1,$2,'INV-001001',$3,0,$4,$5,'PAID',$6)
         ON CONFLICT (organization_id, invoice_number) DO NOTHING
         RETURNING id`,
        [org1, customer.rows[0].id, unitPrice * quantity, taxAmount, totalAmount, ownerId]
      );
      if (sale.rows[0]) {
        const saleId = sale.rows[0].id;
        await client.query(
          `INSERT INTO sale_items (organization_id, sale_id, product_id, quantity, unit_price, discount, tax_amount, line_total)
           VALUES ($1,$2,$3,$4,$5,0,$6,$7)`,
          [org1, saleId, productId, quantity, unitPrice, taxAmount, totalAmount]
        );
        await client.query("UPDATE inventory_balances SET available_quantity=$3, updated_at=now() WHERE organization_id=$1 AND product_id=$2", [org1, productId, newQuantity]);
        await client.query(
          `INSERT INTO inventory_movements (organization_id, product_id, movement_type, quantity, previous_quantity, new_quantity, reference_type, reference_id, reason, created_by)
           VALUES ($1,$2,'SALE',$3,$4,$5,'SALE',$6,'Seed sample sale',$7)`,
          [org1, productId, -quantity, previousQuantity, newQuantity, saleId, ownerId]
        );
        await client.query("INSERT INTO payments (organization_id, sale_id, payment_mode, amount_paid, status) VALUES ($1,$2,'UPI',$3,'PAID')", [org1, saleId, totalAmount]);
        await client.query("INSERT INTO invoices (organization_id, sale_id, invoice_number) VALUES ($1,$2,'INV-001001')", [org1, saleId]);
      }
    }
    await client.query(
      `INSERT INTO ai_insights (organization_id, module_key, title, summary, status, payload)
       VALUES
       ($1,'reorder-suggestions','Smart Reorder Suggestions','AI-ready reorder engine placeholder.','COMING_SOON','{}'),
       ($1,'demand-forecast','Demand Forecasting','Future sales forecast model will read inventory and sales history.','AI_READY','{}'),
       ($1,'dead-stock','Dead Stock Detector','Placeholder for products with slow movement.','COMING_SOON','{}'),
       ($1,'profit-leakage','Profit Leakage Alerts','Placeholder for margin and discount anomaly detection.','AI_READY','{}')`,
      [org1]
    );

    await client.query(
      `INSERT INTO audit_logs (organization_id, actor_user_id, action, entity_type, metadata)
       VALUES ($1,$2,'SEED_DATABASE','SYSTEM',$3)`,
      [org1, admin.rows[0].id, JSON.stringify({ source: "backend-fastify seed" })]
    );

    await client.query("COMMIT");
    console.log("Seed completed");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

