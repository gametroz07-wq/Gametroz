const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

export function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, "");
}
