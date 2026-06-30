export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));

export const marginPercent = (sellingPrice: number, purchasePrice: number) =>
  Math.round(((sellingPrice - purchasePrice) / sellingPrice) * 100);
