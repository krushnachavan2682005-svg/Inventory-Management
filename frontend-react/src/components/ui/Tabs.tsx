import type { ReactNode } from "react";

export function Tabs({ children }: { children: ReactNode }) {
  return <div className="inline-flex rounded-lg border border-line bg-white p-1 shadow-sm">{children}</div>;
}

export function TabButton({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100"}`}
    >
      {children}
    </button>
  );
}
