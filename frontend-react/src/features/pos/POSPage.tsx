import { useMemo, useState } from "react";
import { Minus, Plus, Printer, Send, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { customers, products } from "../../data/mock-data";
import { formatCurrency } from "../../utils/formatters";
import type { PaymentMode, Product } from "../../types";

interface CartItem {
  product: Product;
  qty: number;
}

export function POSPage() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("UPI");

  const filtered = products.filter((product) => `${product.name} ${product.barcode} ${product.sku}`.toLowerCase().includes(query.toLowerCase()));
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.product.sellingPrice, 0);
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = Math.max(0, subtotal - discount + tax);

  const addProduct = (product: Product) => {
    if (product.stock === 0) return;
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) => item.product.id === product.id ? { ...item, qty: Math.min(item.qty + 1, product.stock) } : item);
      }
      return [...items, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((items) => items
      .map((item) => item.product.id === productId ? { ...item, qty: Math.max(1, Math.min(item.product.stock, item.qty + delta)) } : item)
      .filter((item) => item.qty > 0));
  };

  const selectedCustomer = useMemo(() => customers[0], []);

  return (
    <>
      <PageHeader title="POS Billing" eyebrow="Fast checkout" />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr_0.8fr]">
        <Card className="xl:min-h-[calc(100vh-150px)]">
          <Input placeholder="Search product or scan barcode" value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="mt-4 max-h-[620px] space-y-2 overflow-auto pr-1">
            {filtered.map((product) => (
              <button key={product.id} onClick={() => addProduct(product)} className="w-full rounded-lg border border-line bg-white p-3 text-left transition hover:border-brand hover:bg-blue-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-ink">{product.name}</div>
                    <div className="text-xs text-slate-500">{product.sku} · {product.barcode}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-ink">{formatCurrency(product.sellingPrice)}</div>
                    <Badge tone={product.stock === 0 ? "danger" : product.stock <= product.lowStockThreshold ? "warning" : "success"}>{product.stock} left</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card className="xl:min-h-[calc(100vh-150px)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Current bill</h2>
            <Badge tone="info">{cart.length} items</Badge>
          </div>
          <div className="space-y-3">
            {cart.length === 0 && <div className="rounded-lg border border-dashed border-line p-8 text-center text-sm text-slate-500">Add products to start billing.</div>}
            {cart.map((item) => (
              <div key={item.product.id} className="grid gap-3 rounded-lg border border-line p-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <div className="font-bold text-ink">{item.product.name}</div>
                  <div className="text-sm text-slate-500">{formatCurrency(item.product.sellingPrice)} each</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => updateQty(item.product.id, -1)} icon={<Minus size={15} />} />
                  <span className="min-w-8 text-center font-bold">{item.qty}</span>
                  <Button variant="secondary" onClick={() => updateQty(item.product.id, 1)} icon={<Plus size={15} />} />
                </div>
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <strong>{formatCurrency(item.qty * item.product.sellingPrice)}</strong>
                  <Button variant="ghost" onClick={() => setCart((items) => items.filter((cartItem) => cartItem.product.id !== item.product.id))} icon={<Trash2 size={16} />} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="xl:min-h-[calc(100vh-150px)]">
          <h2 className="text-lg font-bold">Bill summary</h2>
          <div className="mt-4 space-y-3">
            <label className="space-y-2 text-sm font-semibold text-slate-700">Customer<Select><option>{selectedCustomer.name}</option><option>Walk-in Customer</option><option>Add new customer</option></Select></label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">Payment mode<Select value={paymentMode} onChange={(event) => setPaymentMode(event.target.value as PaymentMode)}><option>Cash</option><option>UPI</option><option>Card</option><option>Credit</option></Select></label>
            <label className="space-y-2 text-sm font-semibold text-slate-700">Discount<Input type="number" min={0} value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label>
          </div>
          <div className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="flex justify-between"><span>Discount</span><strong>-{formatCurrency(discount)}</strong></div>
            <div className="flex justify-between"><span>Tax 18%</span><strong>{formatCurrency(tax)}</strong></div>
            <div className="flex justify-between text-xl font-bold text-ink"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
          <Button className="mt-6 w-full" disabled={cart.length === 0}>Generate bill</Button>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="secondary" icon={<Printer size={16} />}>Print</Button>
            <Button variant="secondary" icon={<Send size={16} />}>WhatsApp</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
