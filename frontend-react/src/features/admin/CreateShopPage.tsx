import { Save } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export function CreateShopPage() {
  return (
    <>
      <PageHeader title="Create Shop" eyebrow="Admin" actions={<Button icon={<Save size={17} />}>Save mock shop</Button>} />
      <Card className="max-w-4xl">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">Shop name<Input placeholder="Example Retail Store" /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">Owner name<Input placeholder="Owner full name" /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">Email<Input type="email" placeholder="owner@shop.in" /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">Phone<Input placeholder="+91..." /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">Business type<Select><option>General Retail</option><option>Electronics</option><option>Grocery</option><option>Stationery</option></Select></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">City<Input placeholder="Pune" /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">GSTIN optional<Input placeholder="27ABCDE1234F1Z5" /></label>
          <label className="space-y-2 text-sm font-semibold text-slate-700">Plan/status<Select><option>Trial</option><option>Starter</option><option>Growth</option><option>Pro</option></Select></label>
        </div>
      </Card>
    </>
  );
}
