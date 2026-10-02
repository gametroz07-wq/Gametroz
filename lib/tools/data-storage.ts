import type { UnitDef } from "./units";

/** Factors are bytes per unit. Decimal (SI) units use powers of 1,000; binary (IEC) units use powers of 1,024. */
export const storageUnits: UnitDef[] = [
  { key: "bit", label: "Bits", symbol: "bit", factor: 1 / 8, group: "Bits and bytes" },
  { key: "B", label: "Bytes", symbol: "B", factor: 1, group: "Bits and bytes" },
  { key: "KB", label: "Kilobytes", symbol: "KB", factor: 1e3, group: "Decimal (1,000)" },
  { key: "MB", label: "Megabytes", symbol: "MB", factor: 1e6, group: "Decimal (1,000)" },
  { key: "GB", label: "Gigabytes", symbol: "GB", factor: 1e9, group: "Decimal (1,000)" },
  { key: "TB", label: "Terabytes", symbol: "TB", factor: 1e12, group: "Decimal (1,000)" },
  { key: "PB", label: "Petabytes", symbol: "PB", factor: 1e15, group: "Decimal (1,000)" },
  { key: "KiB", label: "Kibibytes", symbol: "KiB", factor: 1024, group: "Binary (1,024)" },
  { key: "MiB", label: "Mebibytes", symbol: "MiB", factor: 1024 ** 2, group: "Binary (1,024)" },
  { key: "GiB", label: "Gibibytes", symbol: "GiB", factor: 1024 ** 3, group: "Binary (1,024)" },
  { key: "TiB", label: "Tebibytes", symbol: "TiB", factor: 1024 ** 4, group: "Binary (1,024)" },
];

/** Seconds to transfer `bytes` at `megabitsPerSecond` (1 Mbps = 1,000,000 bits per second), ignoring overhead. */
export function downloadSeconds(bytes: number, megabitsPerSecond: number) {
  return (bytes * 8) / (megabitsPerSecond * 1_000_000);
}

export function formatDuration(seconds: number) {
  if (seconds < 1) return "less than 1 s";
  const total = Math.round(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const parts =
    days > 0
      ? [`${days} d`, hours > 0 ? `${hours} h` : ""]
      : [hours > 0 ? `${hours} h` : "", minutes > 0 ? `${minutes} min` : "", secs > 0 ? `${secs} s` : ""];
  return parts.filter(Boolean).join(" ");
}
