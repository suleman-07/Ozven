const { ensureDatabaseEnv } = require("./config/ensure-database-env");

async function start() {
  await ensureDatabaseEnv();
  const app = require("./app");

  const PORT = Number(process.env.PORT) || 5000;
  const HOST = "0.0.0.0";

  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  server.on("error", (error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
} else {
  // Imported as a module (rare). Prefer api/index.js on Vercel.
  module.exports = require("./app");
}
