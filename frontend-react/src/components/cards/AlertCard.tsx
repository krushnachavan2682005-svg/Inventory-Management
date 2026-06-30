import type { ReactNode } from "react";

export function AlertCard({ title, children, tone = "info" }: { title: string; children: ReactNode; tone?: "info" | "warning" | "success" }) {
  const classes = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  }[tone];

  return (
    <div className={`rounded-lg border p-4 ${classes}`}>
      <h3 className="font-bold">{title}</h3>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </div>
  );
}
