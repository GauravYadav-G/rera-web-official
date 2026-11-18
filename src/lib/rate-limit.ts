import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";
import { sql, lt } from "drizzle-orm";
import { db } from "@/db";
import { contactRateLimits } from "@/db/schema";

const WINDOW_SECONDS = 15 * 60;
const MAX_REQUESTS = 5;
const globalStore = globalThis as typeof globalThis & { __reraContactLimits?: Map<string, { count: number; expires: number }> };
const memory = globalStore.__reraContactLimits ?? new Map<string, { count: number; expires: number }>();
globalStore.__reraContactLimits = memory;

export async function checkContactRateLimit(ip: string) {
  const fingerprint = createHash("sha256").update(`${ip}:${process.env.RATE_LIMIT_SALT || process.env.DATABASE_URL || "development"}`).digest("hex");
  const key = `contact:${fingerprint}`;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, WINDOW_SECONDS);
    const ttl = await redis.ttl(key);
    return { allowed: count <= MAX_REQUESTS, retryAfter: Math.max(1, ttl) };
  }
  if (process.env.NODE_ENV === "development") {
    const now = Date.now();
    for (const [entryKey, entry] of memory) if (entry.expires <= now) memory.delete(entryKey);
    const entry = memory.get(key) || { count: 0, expires: now + WINDOW_SECONDS * 1000 };
    entry.count += 1;
    memory.set(key, entry);
    return { allowed: entry.count <= MAX_REQUESTS, retryAfter: Math.max(1, Math.ceil((entry.expires - now) / 1000)) };
  }
  // A durable PostgreSQL fallback keeps production instances in agreement when Redis is not configured.
  const now = new Date();
  const expiresAt = new Date(Date.now() + WINDOW_SECONDS * 1000);
  await db.delete(contactRateLimits).where(lt(contactRateLimits.expiresAt, now));
  const [entry] = await db.insert(contactRateLimits).values({ key, count: 1, expiresAt }).onConflictDoUpdate({
    target: contactRateLimits.key,
    set: {
      count: sql`CASE WHEN ${contactRateLimits.expiresAt} <= ${now} THEN 1 ELSE ${contactRateLimits.count} + 1 END`,
      expiresAt: sql`CASE WHEN ${contactRateLimits.expiresAt} <= ${now} THEN ${expiresAt} ELSE ${contactRateLimits.expiresAt} END`,
    },
  }).returning({ count: contactRateLimits.count, expiresAt: contactRateLimits.expiresAt });
  return { allowed: entry.count <= MAX_REQUESTS, retryAfter: Math.max(1, Math.ceil((entry.expiresAt.getTime() - Date.now()) / 1000)) };
}
