import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

export function Sidebar({ title, subtitle, items, accent = "bg-brand" }: { title: string; subtitle: string; items: NavItem[]; accent?: string }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-line bg-white p-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${accent} text-white shadow-sm`}>SR</div>
        <div>
          <div className="font-bold text-ink">{title}</div>
          <div className="text-xs font-medium text-slate-500">{subtitle}</div>
        </div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
