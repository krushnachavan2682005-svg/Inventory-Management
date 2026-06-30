import Fastify from "fastify";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { aiInsightsRoutes } from "./modules/ai-insights/ai-insights.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { customerRoutes } from "./modules/customers/customers.routes.js";
import { inventoryRoutes } from "./modules/inventory/inventory.routes.js";
import { invoiceRoutes } from "./modules/invoices/invoices.routes.js";
import { productRoutes } from "./modules/products/products.routes.js";
import { reportsRoutes } from "./modules/reports/reports.routes.js";
import { salesRoutes } from "./modules/sales/sales.routes.js";
import { shopRoutes } from "./modules/shops/shops.routes.js";
import { supplierRoutes } from "./modules/suppliers/suppliers.routes.js";
import { authPlugin } from "./plugins/auth.plugin.js";
import { securityPlugin } from "./plugins/cors.plugin.js";
import { dbPlugin } from "./plugins/db.plugin.js";
import { errorHandlerPlugin } from "./plugins/error-handler.plugin.js";
import { swaggerPlugin } from "./plugins/swagger.plugin.js";
import { success } from "./shared/utils/formatters.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport: process.env.NODE_ENV === "production" ? undefined : { target: "pino-pretty" }
    }
  });

  await app.register(errorHandlerPlugin);
  await app.register(securityPlugin);
  await app.register(swaggerPlugin);
  await app.register(dbPlugin);
  await app.register(authPlugin);

  app.get("/health", {
    schema: {
      tags: ["System"],
      summary: "Health check"
    }
  }, async () => success({ status: "ok" }));

  await app.register(authRoutes, { prefix: "/api/v1/auth" });
  await app.register(adminRoutes, { prefix: "/api/v1/admin" });
  await app.register(shopRoutes, { prefix: "/api/v1/admin/shops" });
  await app.register(productRoutes, { prefix: "/api/v1/shop/products" });
  await app.register(customerRoutes, { prefix: "/api/v1/shop/customers" });
  await app.register(supplierRoutes, { prefix: "/api/v1/shop/suppliers" });
  await app.register(inventoryRoutes, { prefix: "/api/v1/shop/inventory" });
  await app.register(salesRoutes, { prefix: "/api/v1/shop/sales" });
  await app.register(invoiceRoutes, { prefix: "/api/v1/shop/invoices" });
  await app.register(reportsRoutes, { prefix: "/api/v1/shop/reports" });
  await app.register(aiInsightsRoutes, { prefix: "/api/v1/shop/ai-insights" });

  return app;
}
