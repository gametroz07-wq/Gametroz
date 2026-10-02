import type { PlanEntry } from "./gamemonetize/popularity-plan";
import { createGameMonetizeProvider, type GameMonetizeProviderSource } from "./gamemonetize/provider";

/**
 * Every provider plugs in here. To add GameDistribution later: create lib/providers/gamedistribution/
 * (config, types, client, mapper, validator, provider) implementing GameProvider, then register it
 * below. Nothing else (catalog, pages, sync service) has to change.
 */
export const providerFactories = {
  gamemonetize: (source: GameMonetizeProviderSource = "fixture", planEntries?: PlanEntry[]) =>
    createGameMonetizeProvider(source, planEntries),
} as const;

export type ProviderSlug = keyof typeof providerFactories;

export function isProviderSlug(value: string): value is ProviderSlug {
  return value in providerFactories;
}
