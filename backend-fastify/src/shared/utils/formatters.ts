export function success<T>(data: T, meta: Record<string, unknown> = {}) {
  return { success: true, data, meta };
}

export function invoiceNumber(sequence: number) {
  return `INV-${String(sequence).padStart(6, "0")}`;
}
