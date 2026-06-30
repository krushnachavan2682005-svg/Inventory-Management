import { BarChart3, Building2, LayoutDashboard, Settings } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminLayout() {
  return (
    <div className="app-shell flex">
      <Sidebar
        title="Smart Retail OS"
        subtitle="Platform admin"
        accent="bg-ink"
        items={[
          { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
          { label: "Shops", path: "/admin/shops", icon: <Building2 size={18} /> },
          { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={18} /> },
          { label: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
        ]}
      />
      <main className="min-w-0 flex-1">
        <Topbar userName="Platform Admin" roleLabel="Admin console" />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
