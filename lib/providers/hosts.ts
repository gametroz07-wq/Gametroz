import { GAMEMONETIZE } from "./gamemonetize/config";

/** Host allowlists per provider. Kept apart from the registry so UI code imports no adapters or fixtures. */
export const providerHosts: Record<string, { embedHosts: readonly string[]; imageHosts: readonly string[] }> = {
  [GAMEMONETIZE.slug]: { embedHosts: GAMEMONETIZE.embedHosts, imageHosts: GAMEMONETIZE.imageHosts },
};
