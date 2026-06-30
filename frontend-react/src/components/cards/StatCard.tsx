import type { ReactNode } from "react";
import { Card } from "../ui/Card";

export function StatCard({ label, value, helper, icon, tone = "blue" }: { label: string; value: string; helper?: string; icon: ReactNode; tone?: "blue" | "green" | "amber" | "rose" }) {
  const color = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  }[tone];

  return (
    <Card className="min-h-32">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-bold text-ink">{value}</p>
          {helper && <p className="mt-2 text-sm text-slate-500">{helper}</p>}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>{icon}</div>
      </div>
    </Card>
  );
}
