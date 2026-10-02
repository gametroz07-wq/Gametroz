import type { PlatformSlug } from "@/types/content";

type DownloadStepsInput = { name: string; url: string; platforms: PlatformSlug[] };

const DESKTOP: PlatformSlug[] = ["windows", "mac", "linux"];
const PLATFORM_NAMES: Record<PlatformSlug, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "the web",
};

function listNames(names: string[], joiner = "and") {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} ${joiner} ${names[names.length - 1]}`;
}

/**
 * Short, practical steps for the "How to download {App} safely" section. Names the real official host and
 * only mentions stores and installers for the platforms the app actually supports.
 */
export function appDownloadSteps({ name, url, platforms }: DownloadStepsInput): string[] {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const desktop = platforms.filter((platform) => DESKTOP.includes(platform));
  const stores = [platforms.includes("android") ? "Google Play" : null, platforms.includes("ios") ? "App Store" : null].filter(
    (store): store is string => store !== null,
  );
  const webOnly = platforms.every((platform) => platform === "web");

  const steps = [
    `Open ${host} with the button above, or type the address yourself. Skip ads and search results you do not recognize.`,
  ];

  if (webOnly) {
    steps.push(`${name} runs in your browser, so there is no installer to download. Check that the address bar shows ${host} before you sign in.`);
  } else if (desktop.length > 0) {
    steps.push(
      `Pick the build for your system (${listNames(desktop.map((platform) => PLATFORM_NAMES[platform]))}) and download it from ${host}, not from a mirror or file-sharing site.`,
    );
  }

  if (stores.length > 0) {
    steps.push(`On a phone or tablet, install from the ${listNames(stores, "or")} listing that the official site links to.`);
  }

  if (desktop.length > 0) {
    steps.push("Before you open the installer, confirm the page used HTTPS (the padlock) and that the file name matches the app you chose.");
  }

  steps.push(`After installing, let ${name} update itself, or come back to ${host} to get newer versions.`);
  return steps.slice(0, 5);
}
