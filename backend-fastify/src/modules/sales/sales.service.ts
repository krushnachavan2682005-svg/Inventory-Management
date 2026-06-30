import type { Pool, PoolClient } from "pg";
import { AppError } from "../../shared/errors/app-error.js";
import { ErrorCodes } from "../../shared/errors/error-codes.js";
import { invoiceNumber } from "../../shared/utils/formatters.js";
import type { CreateSaleInput } from "./sales.schema.js";

export class SalesService {
  constructor(private readonly pool: Pool) {}

  list(org: string) {
    return this.pool.query("SELECT * FROM sales WHERE organization_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC", [org]).then((r) => r.rows);
  }

  async get(org: string, id: string) {
    const sale = await this.pool.query("SELECT * FROM sales WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL", [org, id]);
    if (!sale.rows[0]) throw AppError.notFound("Sale not found");
    const items = await this.pool.query("SELECT si.*, p.name AS product_name FROM sale_items si JOIN products p ON p.id=si.product_id WHERE si.organization_id=$1 AND si.sale_id=$2", [org, id]);
    const payments = await this.pool.query("SELECT * FROM payments WHERE organization_id=$1 AND sale_id=$2", [org, id]);
    return { ...sale.rows[0], items: items.rows, payments: payments.rows };
  }

  async create(org: string, userId: string, input: CreateSaleInput) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      if (input.customer_id) {
        await this.assertCustomer(client, org, input.customer_id);
      }

      let subtotal = 0;
      const preparedItems = [];
      for (const item of input.items) {
        const product = await client.query(
          `SELECT p.id, p.name, p.tax_rate, ib.available_quantity
           FROM products p
           JOIN inventory_balances ib ON ib.product_id=p.id AND ib.organization_id=p.organization_id
           WHERE p.organization_id=$1 AND p.id=$2 AND p.deleted_at IS NULL
           FOR UPDATE`,
          [org, item.product_id]
        );
        if (!product.rows[0]) throw AppError.notFound("Product not found in this shop");
        const available = Number(product.rows[0].available_quantity);
        if (available < item.quantity) {
          throw new AppError(ErrorCodes.INSUFFICIENT_STOCK, `Insufficient stock for ${product.rows[0].name}`, 409, { product_id: item.product_id, available });
        }
        const lineBase = item.quantity * item.unit_price - item.discount;
        const taxAmount = Number(((lineBase * Number(product.rows[0].tax_rate)) / 100).toFixed(2));
        const lineTotal = lineBase + taxAmount;
        subtotal += item.quantity * item.unit_price;
        preparedItems.push({ ...item, previousQuantity: available, newQuantity: available - item.quantity, taxAmount, lineTotal });
      }

      const invoiceSeq = await client.query("SELECT nextval('invoice_sequence') AS seq").catch(async () => {
        await client.query("CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1001");
        return client.query("SELECT nextval('invoice_sequence') AS seq");
      });
      const invNo = invoiceNumber(Number(invoiceSeq.rows[0].seq));
      const computedTax = preparedItems.reduce((sum, item) => sum + item.taxAmount, 0);
      const taxTotal = input.tax_total || computedTax;
      const totalAmount = subtotal - input.discount_total + taxTotal;
      const status = input.payment_mode === "CREDIT" ? "CREDIT" : input.amount_paid >= totalAmount ? "PAID" : "PARTIAL";

      const sale = await client.query(
        `INSERT INTO sales (organization_id, customer_id, invoice_number, subtotal, discount_total, tax_total, total_amount, status, created_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [org, input.customer_id ?? null, invNo, subtotal, input.discount_total, taxTotal, totalAmount, status, userId]
      );
      const saleId = sale.rows[0].id;

      for (const item of preparedItems) {
        await client.query(
          `INSERT INTO sale_items (organization_id, sale_id, product_id, quantity, unit_price, discount, tax_amount, line_total)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [org, saleId, item.product_id, item.quantity, item.unit_price, item.discount, item.taxAmount, item.lineTotal]
        );
        await client.query("UPDATE inventory_balances SET available_quantity=$3, updated_at=now() WHERE organization_id=$1 AND product_id=$2", [org, item.product_id, item.newQuantity]);
        await client.query(
          `INSERT INTO inventory_movements (organization_id, product_id, movement_type, quantity, previous_quantity, new_quantity, reference_type, reference_id, reason, created_by)
           VALUES ($1,$2,'SALE',$3,$4,$5,'SALE',$6,'POS sale stock deduction',$7)`,
          [org, item.product_id, -item.quantity, item.previousQuantity, item.newQuantity, saleId, userId]
        );
      }

      await client.query(
        `INSERT INTO payments (organization_id, sale_id, payment_mode, amount_paid, status)
         VALUES ($1,$2,$3,$4,$5)`,
        [org, saleId, input.payment_mode, input.amount_paid, status]
      );
      await client.query(
        `INSERT INTO invoices (organization_id, sale_id, invoice_number)
         VALUES ($1,$2,$3)`,
        [org, saleId, invNo]
      );
      if (input.customer_id) {
        await client.query(
          `UPDATE customers
           SET total_purchases = total_purchases + $3,
               credit_due = credit_due + $4,
               last_visit_at = now(),
               updated_at = now()
           WHERE organization_id=$1 AND id=$2`,
          [org, input.customer_id, totalAmount, input.payment_mode === "CREDIT" ? totalAmount - input.amount_paid : 0]
        );
      }

      await client.query("COMMIT");
      return this.get(org, saleId);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async returnSale(org: string, saleId: string) {
    return { status: "COMING_SOON", sale_id: saleId, organization_id: org, summary: "Sale return workflow will reverse payments and create RETURN inventory movements." };
  }

  private async assertCustomer(client: PoolClient, org: string, customerId: string) {
    const customer = await client.query("SELECT id FROM customers WHERE organization_id=$1 AND id=$2 AND deleted_at IS NULL", [org, customerId]);
    if (!customer.rows[0]) throw AppError.notFound("Customer not found in this shop");
  }
}
