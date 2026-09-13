/**
 * Sync DATABASE_URL + DIRECT_URL from local .env to Vercel Production.
 *
 * Prerequisites:
 *   npx vercel login
 *   npx vercel link   (inside AdminSideBackend, project: ozven)
 *
 * Usage:
 *   node scripts/sync-vercel-db-env.js
 */
const { spawnSync } = require("child_process");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
  quiet: true,
});

const keys = ["DATABASE_URL", "DIRECT_URL", "JWT_SECRET", "CORS_ORIGIN"];

function vercelEnvAdd(key, value) {
  // Remove existing production value (ignore failure if missing), then add.
  spawnSync("npx", ["vercel", "env", "rm", key, "production", "--yes"], {
    cwd: path.join(__dirname, ".."),
    stdio: "ignore",
    shell: true,
  });

  const result = spawnSync(
    "npx",
    ["vercel", "env", "add", key, "production"],
    {
      cwd: path.join(__dirname, ".."),
      input: value + "\n",
      encoding: "utf8",
      shell: true,
    }
  );

  if (result.status !== 0) {
    console.error(`Failed to set ${key}`);
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status || 1);
  }
  console.log(`Set ${key} (production)`);
}

for (const key of keys) {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
  vercelEnvAdd(key, value);
}

console.log("Done. Redeploy with: npx vercel --prod");
