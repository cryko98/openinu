export function formatUsd(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

export function formatPrice(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  if (n >= 1) return `$${n.toFixed(4)}`;
  const str = n.toFixed(12).replace(/0+$/, "");
  const match = str.match(/^0\.(0*)(\d{1,4})/);
  if (!match) return `$${n}`;
  const zeros = match[1].length;
  if (zeros >= 4) return `$0.0(${zeros})${match[2]}`;
  return `$${Number(n.toPrecision(4))}`;
}

export function formatCompact(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export function shortCa(ca: string, size = 4): string {
  return `${ca.slice(0, size)}...${ca.slice(-size)}`;
}
