import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { createGameMonetizeProvider } from "../gamemonetize/provider";
import type { PlanEntry } from "../gamemonetize/popularity-plan";
import type { GameMonetizeGame } from "../gamemonetize/types";
import { syncProviderGames } from "../sync";

type Row = Record<string, unknown>;
type Call = { op: "create" | "update"; data: Row; id?: string };

/** Minimal in-memory stand-in for the Prisma calls syncProviderGames makes. */
function fakePrisma(games: Row[] = []) {
  const calls: Call[] = [];
  const categories = ["racing", "arcade", "action", "casual", "puzzle"].map((slug) => ({ id: `cat-${slug}`, slug }));
  const prisma = {
    provider: { upsert: async () => ({ id: "prov-1" }) },
    importRecord: { create: async () => ({ id: "import-1" }), update: async () => ({}) },
    gameCategory: { findMany: async () => categories },
    game: {
      findMany: async ({ where }: { where: Row }) => {
        if ("providerGameId" in where) {
          const ids = (where.providerGameId as { in: string[] }).in;
          return games.filter((row) => row.providerId === where.providerId && ids.includes(row.providerGameId as string));
        }
        if ("embedUrl" in where) {
          const urls = (where.embedUrl as { in: string[] }).in;
          return games.filter((row) => urls.includes(row.embedUrl as string));
        }
        const slugs = (where.slug as { in: string[] }).in;
        return games.filter((row) => slugs.includes(row.slug as string));
      },
      create: async ({ data }: { data: Row }) => void calls.push({ op: "create", data }),
      update: async ({ where, data }: { where: { id: string }; data: Row }) => void calls.push({ op: "update", data, id: where.id }),
    },
  };
  return { prisma: prisma as unknown as PrismaClient, calls };
}

const raw = (id: string, title: string, extra: Partial<GameMonetizeGame> = {}): GameMonetizeGame => ({
  id,
  title,
  description: "A fast and colorful browser game with short levels, simple controls and plenty of challenges to unlock.",
  instructions: "Use the arrow keys to drive. Press space for nitro.",
  url: `https://html5.gamemonetize.co/${id}/`,
  category: "Racing",
  tags: "Cars, Racing",
  thumb: `https://img.gamemonetize.com/${id}/512x384.jpg`,
  width: "1280",
  height: "720",
  ...extra,
});

const entry = (item: GameMonetizeGame, overrides: Partial<PlanEntry> = {}): PlanEntry => ({
  item,
  source: "best",
  sourceRank: 1,
  inTrending: false,
  inEditorsPick: false,
  ...overrides,
});

const run = (prisma: PrismaClient, entries: PlanEntry[], dryRun = false) =>
  syncProviderGames(createGameMonetizeProvider("plan", entries), { prisma, limit: 100, dryRun });

describe("sync with popularity metadata", () => {
  it("writes popularity and trending on new games, never featured (editorial), and reports the source", async () => {
    const { prisma, calls } = fakePrisma();
    const result = await run(prisma, [
      entry(raw("p1", "Alpha Racer"), { source: "trending", sourceRank: 3, inTrending: true, inEditorsPick: true }),
    ]);
    assert.equal(result.created, 1);
    assert.equal(calls[0].data.popularity, 2997);
    assert.equal(calls[0].data.trending, true);
    assert.ok(!("featured" in calls[0].data), "featured is an editorial decision, not set by sync");
    assert.equal(result.items[0].source, "trending");
  });

  it("refreshes popularity on REVIEW and PUBLISHED games, but keeps editorial fields of published ones", async () => {
    const { prisma, calls } = fakePrisma([
      { id: "g1", providerId: "prov-1", providerGameId: "p1", slug: "alpha-racer", status: "REVIEW", embedUrl: "https://html5.gamemonetize.co/p1/" },
      { id: "g2", providerId: "prov-1", providerGameId: "p2", slug: "beta-racer", status: "PUBLISHED", embedUrl: "https://html5.gamemonetize.co/p2/" },
      { id: "g3", providerId: "prov-1", providerGameId: "p3", slug: "gamma-racer", status: "ARCHIVED", embedUrl: "https://html5.gamemonetize.co/p3/" },
    ]);
    await run(prisma, [
      entry(raw("p1", "Alpha Racer"), { sourceRank: 1, inTrending: true }),
      entry(raw("p2", "Beta Racer"), { source: "hot", sourceRank: 2, inEditorsPick: true }),
      entry(raw("p3", "Gamma Racer"), { source: "editors_pick", sourceRank: 1 }),
    ]);
    const byId = new Map(calls.map((call) => [call.id, call.data]));
    assert.equal(byId.get("g1")?.popularity, 4999);
    assert.equal(byId.get("g1")?.trending, true);
    assert.ok("name" in (byId.get("g1") ?? {}));

    assert.equal(byId.get("g2")?.popularity, 3998);
    assert.ok(!("featured" in (byId.get("g2") ?? {})), "sync never overwrites the editorial featured selection");
    assert.ok(!("name" in (byId.get("g2") ?? {})), "published game keeps its editorial content");
    assert.ok("embedUrl" in (byId.get("g2") ?? {}), "published game still gets technical fields");

    assert.ok(!("popularity" in (byId.get("g3") ?? {})), "archived games are not re-ranked");
  });

  it("behaves exactly as before when there is no popularity metadata", async () => {
    const { prisma, calls } = fakePrisma();
    const result = await syncProviderGames(createGameMonetizeProvider("fixture"), { prisma, limit: 10 });
    assert.ok(result.created > 0);
    for (const call of calls) {
      assert.ok(!("popularity" in call.data));
      assert.ok(!("trending" in call.data));
      assert.ok(!("featured" in call.data));
    }
    assert.ok(result.items.every((item) => item.source === undefined));
  });

  it("writes nothing on a dry run", async () => {
    const { prisma, calls } = fakePrisma();
    const result = await run(prisma, [entry(raw("p1", "Alpha Racer"))], true);
    assert.equal(result.created, 1);
    assert.equal(calls.length, 0);
  });
});

describe("technical duplicate rejection", () => {
  it("rejects an embed URL that already belongs to another game in the database", async () => {
    const { prisma, calls } = fakePrisma([
      { id: "g9", providerId: "prov-1", providerGameId: "other", slug: "other-game", status: "PUBLISHED", embedUrl: "https://html5.gamemonetize.co/shared/" },
    ]);
    const result = await run(prisma, [entry(raw("p1", "Alpha Racer", { url: "https://html5.gamemonetize.co/shared/" }))]);
    assert.equal(result.rejected, 1);
    assert.equal(result.created, 0);
    assert.equal(calls.length, 0);
    assert.ok(result.items[0].issues.some((issue) => issue.code === "DUPLICATE_EMBED" && issue.severity === "error"));
  });

  it("rejects the second game of a run that repeats an embed URL", async () => {
    const { prisma, calls } = fakePrisma();
    const result = await run(prisma, [
      entry(raw("p1", "Alpha Racer")),
      entry(raw("p2", "Beta Racer", { url: "https://html5.gamemonetize.co/p1/" })),
    ]);
    assert.deepEqual([result.created, result.rejected], [1, 1]);
    assert.equal(calls.length, 1);
    assert.ok(result.items[1].issues.some((issue) => issue.code === "DUPLICATE_EMBED"));
  });

  it("rejects the second game of a run that repeats a slug, and slugs owned by another game", async () => {
    const { prisma } = fakePrisma([
      { id: "g9", providerId: "prov-1", providerGameId: "other", slug: "taken-title", status: "PUBLISHED", embedUrl: "https://html5.gamemonetize.co/zzz/" },
    ]);
    const result = await run(prisma, [
      entry(raw("p1", "Alpha Racer")),
      entry(raw("p2", "Alpha Racer!")),
      entry(raw("p3", "Taken Title")),
    ]);
    assert.deepEqual([result.created, result.rejected], [1, 2]);
    assert.ok(result.items[1].issues.some((issue) => issue.code === "DUPLICATE_SLUG"));
    assert.ok(result.items[2].issues.some((issue) => issue.code === "DUPLICATE_SLUG"));
  });

  it("does not flag a game whose own stored embed URL is unchanged", async () => {
    const { prisma } = fakePrisma([
      { id: "g1", providerId: "prov-1", providerGameId: "p1", slug: "alpha-racer", status: "REVIEW", embedUrl: "https://html5.gamemonetize.co/p1/" },
    ]);
    const result = await run(prisma, [entry(raw("p1", "Alpha Racer"))]);
    assert.deepEqual([result.updated, result.rejected], [1, 0]);
  });
});
