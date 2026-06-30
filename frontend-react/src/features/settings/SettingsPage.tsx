import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Shop Settings" eyebrow="Configuration" actions={<Button>Save settings</Button>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold">Shop profile</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-slate-700">Shop name<Input defaultValue="Krushna Smart Mart" /></label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">GSTIN<Input defaultValue="27ABCDE1234F1Z5" /></label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">Billing tax mode<Select><option>GST inclusive</option><option>GST exclusive</option></Select></label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">Default payment<Select><option>UPI</option><option>Cash</option><option>Card</option></Select></label>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-bold">Printer and account</h2>
          <div className="mt-4 space-y-3">
            {["Thermal printer placeholder", "WhatsApp bill template", "User account", "Credit billing controls"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-lg border border-line p-4">
                <span className="font-semibold text-slate-700">{item}</span>
                <Button variant="secondary">Configure</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
