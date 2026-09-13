/**
 * If DATABASE_URL still points at the deleted Supabase project (or is missing),
 * pull a working Neon claimable connection string so production can recover.
 *
 * Prefer setting DATABASE_URL / DIRECT_URL permanently on Vercel, then remove
 * NEON_CLAIM_ID / the fallback claim id below.
 */
const DEAD_SUPABASE_MARKER = "tiqbibuaaedeaxnonzqn";
const FALLBACK_NEON_CLAIM_ID = "01a09a24-cd36-76c1-83c6-1a9ad906480a";

function needsNeonClaimFallback(databaseUrl) {
  if (!databaseUrl || !String(databaseUrl).trim()) {
    return true;
  }
  return String(databaseUrl).includes(DEAD_SUPABASE_MARKER);
}

function toDirectUrl(poolerUrl) {
  return poolerUrl.replace("-pooler.", ".");
}

function toPrismaPoolerUrl(connectionString) {
  const url = new URL(connectionString.replace(/^postgresql:/i, "postgres:"));
  url.searchParams.delete("channel_binding");
  url.searchParams.set("sslmode", "require");
  url.searchParams.set("pgbouncer", "true");
  return url.toString().replace(/^postgres:/i, "postgresql:");
}

function toPrismaDirectUrl(connectionString) {
  const direct = toDirectUrl(connectionString);
  const url = new URL(direct.replace(/^postgresql:/i, "postgres:"));
  url.searchParams.delete("channel_binding");
  url.searchParams.delete("pgbouncer");
  url.searchParams.set("sslmode", "require");
  return url.toString().replace(/^postgres:/i, "postgresql:");
}

async function ensureDatabaseEnv() {
  if (!needsNeonClaimFallback(process.env.DATABASE_URL)) {
    return { refreshed: false };
  }

  const claimId = process.env.NEON_CLAIM_ID || FALLBACK_NEON_CLAIM_ID;
  const response = await fetch(`https://neon.new/api/v1/database/${claimId}`);

  if (!response.ok) {
    throw new Error(
      `Neon claim lookup failed (${response.status}). Set DATABASE_URL/DIRECT_URL on Vercel.`
    );
  }

  const payload = await response.json();
  if (!payload.connection_string) {
    throw new Error("Neon claim response missing connection_string");
  }

  process.env.DATABASE_URL = toPrismaPoolerUrl(payload.connection_string);
  process.env.DIRECT_URL = toPrismaDirectUrl(payload.connection_string);

  console.warn(
    `[db] Replaced dead/missing DATABASE_URL via Neon claim ${claimId}. Claim or set permanent Vercel env before expiry: ${payload.expires_at || "unknown"}`
  );

  return { refreshed: true, claimId, expiresAt: payload.expires_at || null };
}

module.exports = {
  ensureDatabaseEnv,
  needsNeonClaimFallback,
};
