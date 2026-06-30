import type { Pool } from "pg";

const moduleMap = {
  "reorder-suggestions": "Smart Reorder Suggestions",
  "demand-forecast": "Demand Forecasting",
  "dead-stock": "Dead Stock Detector",
  "profit-leakage": "Profit Leakage Alerts"
} as const;

export class AiInsightsService {
  constructor(private readonly pool: Pool) {}

  async list(org: string) {
    const result = await this.pool.query("SELECT * FROM ai_insights WHERE organization_id=$1 AND deleted_at IS NULL ORDER BY created_at DESC", [org]);
    if (result.rows.length > 0) return result.rows;
    return Object.entries(moduleMap).map(([module_key, title]) => ({
      module_key,
      title,
      summary: "AI-ready module placeholder. Real inference will be served later by a Python AI service.",
      status: "COMING_SOON"
    }));
  }

  one(moduleKey: keyof typeof moduleMap) {
    return {
      module_key: moduleKey,
      title: moduleMap[moduleKey],
      status: moduleKey === "demand-forecast" || moduleKey === "profit-leakage" ? "AI_READY" : "COMING_SOON",
      summary: "Placeholder response. This endpoint is stable for frontend integration, but real AI is intentionally not implemented yet.",
      payload: {}
    };
  }
}
