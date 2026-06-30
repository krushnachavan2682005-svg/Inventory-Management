import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export const swaggerPlugin = fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Smart Retail OS API",
        description: "Multi-tenant Smart Retail POS and Inventory API",
        version: "0.1.0"
      },
      servers: [{ url: "http://localhost:4000", description: "Local development" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    }
  });
});
