import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  cell: (item: T) => ReactNode;
}

export function DataTable<T>({ columns, data, keyExtractor }: { columns: Column<T>[]; data: T[]; keyExtractor: (item: T) => string }) {
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            {columns.map((column) => (
              <th key={column.header} className="px-4 py-3 font-bold">{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="transition hover:bg-slate-50">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3 align-middle text-slate-700">{column.cell(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
