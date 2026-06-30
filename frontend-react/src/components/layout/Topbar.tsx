import { Bell, Search } from "lucide-react";
import { Input } from "../ui/Input";

export function Topbar({ userName, roleLabel }: { userName: string; roleLabel: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cloud/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden max-w-md flex-1 items-center gap-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <Input placeholder="Search products, invoices, customers..." className="border-transparent bg-white shadow-sm" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="rounded-lg border border-line bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 shadow-sm">
            <div className="h-8 w-8 rounded-full bg-ink text-center text-xs font-bold leading-8 text-white">{userName.slice(0, 2).toUpperCase()}</div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-ink">{userName}</div>
              <div className="text-xs text-slate-500">{roleLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
