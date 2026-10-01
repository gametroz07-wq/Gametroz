// Runs the idempotent seed during a deploy build ONLY when SEED_ON_DEPLOY=true.
// Use it for the first production deploy, then remove the variable: the seed never deletes data,
// but it would reset seeded records to their seed values on every build.
import { execSync } from "node:child_process";

if (process.env.SEED_ON_DEPLOY !== "true") {
  console.log("[deploy-seed] SEED_ON_DEPLOY is not true; skipping seed.");
} else {
  console.log("[deploy-seed] Seeding database (idempotent upserts, no deletes)...");
  execSync("npx prisma db seed", { stdio: "inherit" });
}
