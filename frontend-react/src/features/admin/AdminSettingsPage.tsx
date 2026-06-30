import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function AdminSettingsPage() {
  return (
    <>
      <PageHeader title="Platform Settings" eyebrow="Admin" />
      <Card className="max-w-3xl">
        <h2 className="text-lg font-bold">Future platform controls</h2>
        <div className="mt-4 space-y-3">
          {["Tenant onboarding policy", "Subscription billing provider", "API rate limits", "Global notification templates"].map((setting) => (
            <div key={setting} className="flex items-center justify-between rounded-lg border border-line p-4">
              <span className="font-semibold text-slate-700">{setting}</span>
              <Button variant="secondary">Configure</Button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
