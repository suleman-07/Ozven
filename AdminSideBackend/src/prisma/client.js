const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient across warm Vercel serverless invocations
// to avoid exhausting Supabase/pgbouncer connections.
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__ozvenPrisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (!globalForPrisma.__ozvenPrisma) {
  globalForPrisma.__ozvenPrisma = prisma;
}

module.exports = prisma;
