import { Bot } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { aiModules } from "../../data/mock-data";

export function AIInsightsPage() {
  return (
    <>
      <PageHeader title="AI Insights" eyebrow="AI-ready modules" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {aiModules.map((module) => (
          <Card key={module}>
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-700"><Bot size={22} /></div>
              <Badge tone="info">Coming soon</Badge>
            </div>
            <h2 className="mt-5 text-lg font-bold text-ink">{module}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">AI-ready module placeholder. It will connect to future Fastify APIs, PostgreSQL data, and model workflows.</p>
          </Card>
        ))}
      </div>
    </>
  );
}
