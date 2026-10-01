import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveCliDatabaseUrl, resolvePoolMax, resolveRuntimeDatabaseUrl } from "../db/database-url";

const LOCAL = "postgresql://user:pass@localhost:5436/gametroz";
const REMOTE = "postgresql://user:pass@db.example.com:5432/postgres";
const REMOTE_DIRECT = "postgresql://user:pass@direct.example.com:5432/postgres";

describe("resolveCliDatabaseUrl", () => {
  it("uses DIRECT_URL when it is set", () => {
    assert.equal(resolveCliDatabaseUrl({ DATABASE_URL: REMOTE, DIRECT_URL: REMOTE_DIRECT }), REMOTE_DIRECT);
  });

  it("falls back to DATABASE_URL when DIRECT_URL is missing, empty or blank", () => {
    assert.equal(resolveCliDatabaseUrl({ DATABASE_URL: REMOTE }), REMOTE);
    assert.equal(resolveCliDatabaseUrl({ DATABASE_URL: REMOTE, DIRECT_URL: "" }), REMOTE);
    assert.equal(resolveCliDatabaseUrl({ DATABASE_URL: REMOTE, DIRECT_URL: "   " }), REMOTE);
  });

  it("returns an empty string when nothing is set (prisma generate needs no database)", () => {
    assert.equal(resolveCliDatabaseUrl({}), "");
  });

  it("allows localhost on a developer machine", () => {
    assert.equal(resolveCliDatabaseUrl({ DATABASE_URL: LOCAL }), LOCAL);
  });

  it("refuses localhost on Render or CI and names the variable without leaking its value", () => {
    assert.throws(
      () => resolveCliDatabaseUrl({ RENDER: "true", DATABASE_URL: REMOTE, DIRECT_URL: LOCAL }),
      (error: Error) => error.message.includes("DIRECT_URL") && !error.message.includes("pass@"),
    );
    assert.throws(() => resolveCliDatabaseUrl({ CI: "true", DATABASE_URL: "postgresql://u:p@127.0.0.1:5432/db" }), /DATABASE_URL/);
  });
});

describe("resolveRuntimeDatabaseUrl", () => {
  it("uses only DATABASE_URL", () => {
    assert.equal(resolveRuntimeDatabaseUrl({ DATABASE_URL: REMOTE, DIRECT_URL: REMOTE_DIRECT }), REMOTE);
  });

  it("throws a clear error when DATABASE_URL is missing", () => {
    assert.throws(() => resolveRuntimeDatabaseUrl({ DIRECT_URL: REMOTE_DIRECT }), /DATABASE_URL is not set/);
  });

  it("refuses localhost on Render", () => {
    assert.throws(() => resolveRuntimeDatabaseUrl({ RENDER: "true", DATABASE_URL: LOCAL }), /DATABASE_URL/);
  });
});

describe("resolvePoolMax", () => {
  it("keeps the pool small during next build (many workers share one pooler)", () => {
    assert.equal(resolvePoolMax({ NEXT_PHASE: "phase-production-build" }), 2);
  });

  it("uses a moderate default at runtime", () => {
    assert.equal(resolvePoolMax({}), 5);
  });

  it("honors a valid DATABASE_POOL_MAX override and ignores invalid ones", () => {
    assert.equal(resolvePoolMax({ DATABASE_POOL_MAX: "3" }), 3);
    assert.equal(resolvePoolMax({ DATABASE_POOL_MAX: "3", NEXT_PHASE: "phase-production-build" }), 3);
    assert.equal(resolvePoolMax({ DATABASE_POOL_MAX: "0" }), 5);
    assert.equal(resolvePoolMax({ DATABASE_POOL_MAX: "abc" }), 5);
  });
});
