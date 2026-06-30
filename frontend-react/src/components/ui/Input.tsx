import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-blue-100 ${className}`}
      {...props}
    />
  );
}
