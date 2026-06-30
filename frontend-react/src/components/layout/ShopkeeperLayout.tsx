import { BadgeIndianRupee, Bot, Boxes, FileBarChart, LayoutDashboard, Package, ReceiptText, Settings, Truck, Users } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function ShopkeeperLayout() {
  return (
    <div className="app-shell flex">
      <Sidebar
        title="Krushna Smart Mart"
        subtitle="Shopkeeper workspace"
        items={[
          { label: "Dashboard", path: "/shop/dashboard", icon: <LayoutDashboard size={18} /> },
          { label: "POS Billing", path: "/shop/pos", icon: <BadgeIndianRupee size={18} /> },
          { label: "Products", path: "/shop/products", icon: <Package size={18} /> },
          { label: "Inventory", path: "/shop/inventory", icon: <Boxes size={18} /> },
          { label: "Customers", path: "/shop/customers", icon: <Users size={18} /> },
          { label: "Suppliers", path: "/shop/suppliers", icon: <Truck size={18} /> },
          { label: "Sales", path: "/shop/sales", icon: <ReceiptText size={18} /> },
          { label: "Reports", path: "/shop/reports", icon: <FileBarChart size={18} /> },
          { label: "AI Insights", path: "/shop/ai-insights", icon: <Bot size={18} /> },
          { label: "Settings", path: "/shop/settings", icon: <Settings size={18} /> },
        ]}
      />
      <main className="min-w-0 flex-1">
        <Topbar userName="Krushna Patil" roleLabel="Shopkeeper" />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
