// Vercel Serverless entry — exports a request listener that boots the Express app.
const { ensureDatabaseEnv } = require("../src/config/ensure-database-env");

let appPromise;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      await ensureDatabaseEnv();
      // Load app only after env is corrected so Prisma picks up the live URL.
      return require("../src/app");
    })();
  }
  return appPromise;
}

module.exports = async function vercelHandler(req, res) {
  const app = await getApp();
  return app(req, res);
};
