/** Buyurtma matnini yig'ish — client (zaxira havola) va server (Telegram) bir xil formatdan foydalanadi */

export interface OrderLine {
  /** Oq penaplast */
  name: string;
  /** "15 kg/m³ — 10 cm" yoki "kilogramm" */
  meta: string;
  quantity: number;
  unit: string; // "dona" | "kg"
  unitPriceUSD: number;
  lineTotalUSD: number;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

function fmtUsd(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? `$${r}` : `$${r.toFixed(2)}`;
}

export function buildOrderText(lines: OrderLine[], totalUSD: number, c: OrderCustomer): string {
  const rows = lines.map(
    (l, i) =>
      `${i + 1}) ${l.name} — ${l.meta} — ${l.quantity} ${l.unit} — ${fmtUsd(l.unitPriceUSD)} → ${fmtUsd(l.lineTotalUSD)}`
  );
  const parts = [
    'YANGI BUYURTMA',
    ...rows,
    `JAMI: ${fmtUsd(totalUSD)}`,
    `MIJOZ: ${c.name} / ${c.phone} / ${c.address}${c.note?.trim() ? ` / Izoh: ${c.note.trim()}` : ''}`,
  ];
  return parts.join('\n');
}
