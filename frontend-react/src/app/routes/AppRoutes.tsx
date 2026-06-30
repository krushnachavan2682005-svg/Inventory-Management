import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { ShopkeeperLayout } from "../../components/layout/ShopkeeperLayout";
import { AdminAnalyticsPage } from "../../features/admin/AdminAnalyticsPage";
import { AdminDashboard } from "../../features/admin/AdminDashboard";
import { AdminSettingsPage } from "../../features/admin/AdminSettingsPage";
import { CreateShopPage } from "../../features/admin/CreateShopPage";
import { ShopsPage } from "../../features/admin/ShopsPage";
import { AIInsightsPage } from "../../features/ai-insights/AIInsightsPage";
import { LoginPage } from "../../features/auth/LoginPage";
import { CustomersPage } from "../../features/customers/CustomersPage";
import { InventoryPage } from "../../features/inventory/InventoryPage";
import { POSPage } from "../../features/pos/POSPage";
import { ProductsPage } from "../../features/products/ProductsPage";
import { ReportsPage } from "../../features/reports/ReportsPage";
import { SalesPage } from "../../features/sales/SalesPage";
import { SettingsPage } from "../../features/settings/SettingsPage";
import { ShopDashboard } from "../../features/shopkeeper/ShopDashboard";
import { SuppliersPage } from "../../features/suppliers/SuppliersPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shops" element={<ShopsPage />} />
        <Route path="shops/create" element={<CreateShopPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      <Route path="/shop" element={<ShopkeeperLayout />}>
        <Route index element={<Navigate to="/shop/dashboard" replace />} />
        <Route path="dashboard" element={<ShopDashboard />} />
        <Route path="pos" element={<POSPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="ai-insights" element={<AIInsightsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
