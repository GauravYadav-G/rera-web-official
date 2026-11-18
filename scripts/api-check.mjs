import 'dotenv/config';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const testIPs = ['192.0.2.210', '192.0.2.220', '192.0.2.221', '192.0.2.222', '192.0.2.223', '192.0.2.224'];
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);
async function clean() {
  for (const ip of testIPs) {
    const key = `contact:${createHash('sha256').update(`${ip}:${process.env.RATE_LIMIT_SALT || process.env.DATABASE_URL || 'development'}`).digest('hex')}`;
    await db.execute(sql`delete from contact_rate_limits where key = ${key}`);
  }
}
await clean();
const valid = { name: 'Automated API check', email: 'qa@example.com', company: '', service: 'Web Development', budget: '', message: 'An automated validation brief for checking delivery configuration. This is not a real project enquiry.', website: '', loadedAt: Date.now() - 10000, turnstileToken: '' };
async function send(body, ip, expected, code) {
  const response = await fetch(`${base}/api/contact`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) });
  const json = await response.json();
  assert.equal(response.status, expected, JSON.stringify(json));
  assert.equal(json.code, code);
  assert.equal(json.ok, false);
  console.log(`${code}: ${response.status} passed`);
  return response;
}
try {
  await send({ ...valid, name: 'A', message: 'Short' }, testIPs[1], 422, 'VALIDATION');
  await send({ ...valid, website: 'bot-filled-field' }, testIPs[2], 400, 'VERIFICATION');
  await send({ ...valid, loadedAt: Date.now() }, testIPs[3], 400, 'REVIEW_BRIEF');
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) await send(valid, testIPs[4], 503, 'DELIVERY_NOT_CONFIGURED');
  for (let attempt = 0; attempt < 5; attempt++) await send({ ...valid, name: '' }, testIPs[5], 422, 'VALIDATION');
  const limited = await send({ ...valid, name: '' }, testIPs[5], 429, 'RATE_LIMITED');
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  console.log('API protection and delivery-gating checks passed.');
} finally { await clean(); await pool.end(); }
