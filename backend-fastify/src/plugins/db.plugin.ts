import fp from "fastify-plugin";
import { pool } from "../config/database.js";

export const dbPlugin = fp(async (fastify) => {
  fastify.decorate("pg", pool);
  fastify.addHook("onClose", async () => {
    await pool.end();
  });
});
