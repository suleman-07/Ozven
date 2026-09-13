/**
 * Used by `vercel-build`: refresh dead DATABASE_URL/DIRECT_URL, then generate + migrate.
 */
const { spawnSync } = require("child_process");
const path = require("path");

async function main() {
  const { ensureDatabaseEnv } = require("../src/config/ensure-database-env");
  await ensureDatabaseEnv();

  const cwd = path.join(__dirname, "..");
  const steps = [
    ["npx", ["prisma", "generate"]],
    ["npx", ["prisma", "migrate", "deploy"]],
  ];

  for (const [cmd, args] of steps) {
    const result = spawnSync(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: true,
      env: process.env,
    });
    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
