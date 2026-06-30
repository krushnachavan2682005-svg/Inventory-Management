# Smart Retail OS Backend

Production-grade Fastify + TypeScript backend foundation for a multi-tenant Smart Retail POS and Inventory Management System.

## Install

```bash
cd backend-fastify
npm install
```

## Configure Environment

```bash
cp .env.example .env
```

Set `DATABASE_URL` to a PostgreSQL database and use a long random `JWT_SECRET`.

## Run Migrations

```bash
npm run db:migrate
```

## Seed Data

```bash
npm run db:seed
```

Demo users:

- Admin: `admin@smartretail.com` / `Admin@123`
- Shopkeeper 1: `owner1@demo.com` / `Owner@123`
- Shopkeeper 2: `owner2@demo.com` / `Owner@123`

## Start Dev Server

```bash
npm run dev
```

API base URL: `http://localhost:4000/api/v1`

Swagger UI: `http://localhost:4000/docs`

Health check: `http://localhost:4000/health`

## Implemented APIs

Auth:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Admin:

- `GET /api/v1/admin/dashboard`
- `GET /api/v1/admin/analytics`
- `GET /api/v1/admin/shops`
- `POST /api/v1/admin/shops`
- `GET /api/v1/admin/shops/:id`
- `PATCH /api/v1/admin/shops/:id`
- `PATCH /api/v1/admin/shops/:id/status`

Shopkeeper:

- Products CRUD under `/api/v1/shop/products`
- Customers CRUD under `/api/v1/shop/customers`
- Suppliers CRUD under `/api/v1/shop/suppliers`
- Inventory balances, movements, adjustments, low stock, dead-stock placeholder
- Sales/POS create/list/get/return placeholder
- Invoices list/get
- Reports dashboard, sales summary, inventory health, top products, payment breakdown
- AI insights placeholders

## Multi-Tenancy

`organizations` represents shops/tenants. Business tables include `organization_id`, timestamps, and soft-delete columns where useful.

Admin users can access platform routes and all shops. Shopkeeper users can access only their own shop data. Shopkeeper APIs never trust `organization_id` from the frontend; tenant context is derived from JWT claims.

## Inventory Ledger

Inventory is not stored only as a product stock number.

- `inventory_balances` stores current available and reserved quantity per product per shop.
- `inventory_movements` stores every stock-changing event with previous quantity, new quantity, reference type/id, reason, and creator.

POS sale creation runs inside a PostgreSQL transaction:

1. Validate customer and products belong to the tenant.
2. Lock inventory balances with `FOR UPDATE`.
3. Validate stock.
4. Create sale.
5. Create sale items.
6. Create payment.
7. Deduct inventory balances.
8. Create inventory movements.
9. Create invoice.
10. Update customer purchase/credit values.

If any step fails, the transaction rolls back.

## AI Placeholder

Real AI is not implemented yet. Placeholder APIs exist for smart reorder suggestions, demand forecasting, dead stock, and profit leakage.

## Later Connections

- Wire the React frontend to these APIs.
- Add refresh tokens/session management.
- Add cashier/manager/inventory/accountant roles.
- Add purchase order receiving workflow.
- Add sale return reversal logic.
- Add full JSON Schema OpenAPI request/response docs.
- Add tests and CI.

## Known Limitations

- No real AI inference yet.
- Sale return endpoint is a placeholder.
- The migration runner executes the initial SQL migration directly; for production, add a migrations history table or Drizzle migration workflow.
- Swagger route summaries are present, but full body schemas can be expanded later.
