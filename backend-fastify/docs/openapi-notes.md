# OpenAPI Notes

Swagger UI is available at `/docs` when the Fastify server is running.

The current route documentation includes tags, summaries, and bearer-auth security metadata. Request and response body schemas are validated with Zod in controllers and can later be promoted into full JSON Schema definitions for richer generated OpenAPI contracts.

API base path: `/api/v1`

Use `Authorization: Bearer <accessToken>` for protected routes.

Shopkeeper routes derive `organization_id` from the JWT. Client-provided organization IDs are ignored for shop-scoped operations.
