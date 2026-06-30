import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Store } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuth } from "./AuthContext";
import type { Role } from "../../types";

export function LoginPage() {
  const [role, setRole] = useState<Role>("shopkeeper");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = () => {
    login(role);
    navigate(role === "admin" ? "/admin/dashboard" : "/shop/dashboard");
  };

  return (
    <main className="app-shell flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-brand">Smart Retail OS</p>
            <h1 className="mt-3 text-3xl font-bold text-ink">Run the platform or operate the shop from one polished frontend.</h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">Mock login today, JWT-ready tomorrow. Choose a role to preview role-based navigation, dashboards, and retail workflows.</p>
          </div>
          <div className="space-y-3">
            {[
              { role: "admin" as const, title: "Admin", text: "Manage shops, platform analytics, activation, and settings.", icon: <Building2 /> },
              { role: "shopkeeper" as const, title: "Shopkeeper", text: "Use POS, inventory, customers, suppliers, sales, and reports.", icon: <Store /> },
            ].map((option) => (
              <button
                key={option.role}
                onClick={() => setRole(option.role)}
                className={`w-full rounded-lg border p-4 text-left transition ${role === option.role ? "border-brand bg-blue-50 ring-4 ring-blue-100" : "border-line bg-white hover:bg-slate-50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-ink p-2 text-white">{option.icon}</div>
                  <div>
                    <div className="font-bold text-ink">{option.title}</div>
                    <p className="mt-1 text-sm text-slate-600">{option.text}</p>
                  </div>
                </div>
              </button>
            ))}
            <Button className="w-full" onClick={submit}>Continue</Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
