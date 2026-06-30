import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "../config/database.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const migrationPath = join(__dirname, "migrations", "001_initial_schema.sql");
  const sql = await readFile(migrationPath, "utf8");
  await pool.query(sql);
  console.log("Database migration completed");
  await pool.end();
}

migrate().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
