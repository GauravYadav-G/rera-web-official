import 'dotenv/config';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('artifacts', { recursive: true });
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const routes = ['/', '/services', '/services/web-development', '/services/custom-software', '/services/ai-automation', '/services/web3-blockchain', '/services/ui-ux-design', '/services/backend-cloud', '/work', '/work/workspace-study', '/about', '/process', '/contact', '/guide', '/terms-and-conditions', '/privacy-policy'];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.210' } });
await context.addInitScript(() => Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }));
const page = await context.newPage();
const exceptions = [];
const violations = [];
page.on('pageerror', error => exceptions.push(error.message));
async function visit(path) { const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' }); assert.equal(response.status(), 200, `Route ${path}`); await page.evaluate(() => document.fonts.ready); }
async function noOverflow(label) { const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth })); assert.ok(dimensions.width <= dimensions.viewport, `${label}: ${JSON.stringify(dimensions)}`); }
try {
  await visit('/');
  const layers = ['Interface', 'Logic', 'Intelligence', 'Foundation'];
  const heroTabs = page.getByRole('tablist', { name: 'Inspect the Build Stack layers' }).getByRole('tab');
  const heroHeight = await page.locator('.hero-experience').evaluate(el => el.getBoundingClientRect().height);
  for (let index = 0; index < 16; index++) {
    const target = index % 4;
    await heroTabs.nth(target).click();
    assert.equal(await page.locator('.hero .build-stack').getAttribute('data-active-layer'), layers[target]);
    assert.equal(await heroTabs.nth(target).getAttribute('aria-selected'), 'true');
    assert.ok((await page.locator('.hero .stack-layer-0 .layer-edge-label').textContent()).includes(layers[target].toUpperCase()));
    const height = await page.locator('.hero-experience').evaluate(el => el.getBoundingClientRect().height);
    assert.ok(Math.abs(height - heroHeight) < 1, 'Hero frame must not move while selecting layers');
  }
  await heroTabs.nth(2).click();
  await page.evaluate(() => window.scrollTo({ top: 550, behavior: 'instant' }));
  await page.waitForTimeout(3300);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  assert.equal(await heroTabs.nth(2).getAttribute('aria-selected'), 'true', 'Scroll must not override manual selection');
  await heroTabs.nth(2).focus(); await page.keyboard.press('Home'); assert.equal(await heroTabs.nth(0).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End'); assert.equal(await heroTabs.nth(3).getAttribute('aria-selected'), 'true');
  await heroTabs.nth(0).click();
  console.log('Hero: rapid switching, correct diagrams, stable height, persistent selection, and keyboard navigation passed.');
  await page.screenshot({ path: 'artifacts/fixed-home-desktop.png' });

  const serviceButtons = page.locator('.service-trigger');
  await serviceButtons.nth(0).focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await serviceButtons.nth(1).evaluate(el => el === document.activeElement), true);
  assert.equal(await serviceButtons.nth(0).getAttribute('aria-expanded'), 'true', 'Focus alone must not switch an accordion');
  await page.keyboard.press('Enter'); assert.equal(await serviceButtons.nth(1).getAttribute('aria-expanded'), 'true');
  await serviceButtons.nth(4).hover(); assert.equal(await serviceButtons.nth(1).getAttribute('aria-expanded'), 'true', 'Hover must not reflow the list');
  let stageHeight;
  for (let index = 0; index < 6; index++) {
    await serviceButtons.nth(index).click();
    assert.equal(await serviceButtons.nth(index).getAttribute('aria-expanded'), 'true');
    const height = await page.locator('.services-preview .preview-stage').evaluate(el => el.getBoundingClientRect().height);
    stageHeight ??= height;
    assert.ok(Math.abs(height - stageHeight) < 1, 'Service diagram stage must stay fixed');
  }
  await serviceButtons.nth(0).click();
  const previewHeight = await page.locator('.services-preview .preview-plate').evaluate(el => el.getBoundingClientRect().height);
  await page.locator('.services-preview').getByRole('button', { name: 'Preview mobile layout' }).click();
  assert.equal(await page.locator('.services-preview .is-phone').count(), 1);
  assert.ok(Math.abs((await page.locator('.services-preview .preview-plate').evaluate(el => el.getBoundingClientRect().height)) - previewHeight) < 1, 'Device toggle must not resize the panel');
  await page.locator('.services-preview').getByRole('button', { name: 'Preview desktop layout' }).click();
  console.log('Services: click/keyboard-only selection, fixed diagram frames, and device preview toggles passed.');

  for (const route of routes) {
    await visit(route);
    assert.equal(await page.locator('h1').count(), 1, `${route}: exactly one h1`);
    await noOverflow(`desktop ${route}`);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    if (result.violations.length) violations.push({ route, issues: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 8).map(n => ({ target: n.target, summary: n.failureSummary })) })) });
    if (['/services', '/services/web-development', '/services/ui-ux-design', '/work', '/work/workspace-study', '/about', '/process', '/contact', '/terms-and-conditions'].includes(route)) await page.screenshot({ path: `artifacts/page-${route.slice(1).replaceAll('/', '-')}.png` });
    console.log(`Route ${route}: loaded, h1 and desktop layout passed; axe violations ${result.violations.length}`);
  }
  for (const width of [360, 390, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/services', '/services/ui-ux-design', '/services/backend-cloud', '/work', '/work/workspace-study', '/process', '/about', '/contact', '/terms-and-conditions', '/privacy-policy']) {
      await visit(route); await noOverflow(`${width}px ${route}`);
      if (width === 390 && ['/', '/services/ui-ux-design', '/contact', '/terms-and-conditions'].includes(route)) await page.screenshot({ path: `artifacts/mobile-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}.png` });
    }
    console.log(`${width}px: no horizontal overflow across all sampled pages.`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (let repeat = 0; repeat < 3; repeat++) {
    await visit('/');
    await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Services', exact: true }).click();
    await page.waitForURL('**/services');
    await page.getByRole('heading', { level: 2, name: /UI\/UX/ }).getByRole('link').click();
    await page.waitForURL('**/services/ui-ux-design');
    await page.goBack(); await page.waitForURL('**/services');
    await page.locator('header.site-header').getByRole('link', { name: 'RERA WEB, home' }).click();
    await page.waitForURL(base + '/');
    await page.getByRole('tab', { name: /03 Intelligence/i }).click();
    assert.equal(await page.locator('.hero .build-stack').getAttribute('data-active-layer'), 'Intelligence');
  }
  console.log('Repeated client-side route changes and browser Back: passed.');
  await visit('/work/workspace-study');
  await page.getByRole('button', { name: 'Wireframe', exact: true }).click();
  assert.equal(await page.locator('.study-wireframe').count(), 1);
  await page.getByRole('button', { name: 'Interface', exact: true }).click();
  assert.equal(await page.locator('.study-wireframe').count(), 0);
  await visit('/services/ui-ux-design');
  const faq = page.locator('.faq-list details').first(); await faq.locator('summary').click(); assert.equal(await faq.getAttribute('open'), '');
  await page.getByRole('link', { name: 'Let’s build something' }).click();
  await page.waitForURL('**/contact?service=**');
  assert.equal(await page.locator('#brief-service').inputValue(), 'UI/UX Design');
  await page.getByRole('button', { name: 'SEND YOUR IDEA', exact: true }).click();
  await page.locator('.field-error').first().waitFor({ state: 'visible' });
  assert.ok(await page.locator('.field-error').count() >= 3);
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    await page.locator('#brief-name').fill('Automated regression check');
    await page.locator('#brief-email').fill('qa@example.com');
    await page.locator('#brief-message').fill('An automated check of the form failure state. Email is not configured and no delivery is expected.');
    await page.waitForTimeout(2600);
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/contact') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'SEND YOUR IDEA', exact: true }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 503);
    assert.equal(await page.locator('#brief-name').inputValue(), 'Automated regression check');
    assert.ok((await page.locator('.form-status').innerText()).includes('not been sent'));
  }
  console.log('Work view toggle, FAQs, service-prefilled contact route, and form validation passed.');
  await page.setViewportSize({ width: 390, height: 844 }); await visit('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Shift+Tab');
  assert.ok((await page.evaluate(() => document.activeElement?.textContent || '')).includes('Contact'));
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), 'Close navigation');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.mobile-menu').count(), 0);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: /About/ }).click();
  await page.waitForURL('**/about'); assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
  const mobileAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  if(mobileAxe.violations.length) violations.push({route:'mobile about',issues:mobileAxe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});

  await page.emulateMedia({ reducedMotion: 'reduce' }); await visit('/');
  await page.getByRole('tab', { name: /04 Foundation/i }).click();
  assert.equal(await page.locator('.hero .build-stack').getAttribute('data-active-layer'), 'Foundation');
  assert.equal(await page.locator('.hero .stack-live').isVisible(), true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(500);
  assert.equal(await page.locator('.hero .build-stack').getAttribute('data-active-layer'), 'Foundation');
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJSPage = await noJS.newPage(); await noJSPage.goto(base);
  assert.equal(await noJSPage.locator('#service-panel-backend-cloud').isVisible(), true);
  assert.equal(await noJSPage.locator('.hero .stack-static-fallback').isVisible(), true);
  await noJSPage.goto(`${base}/terms-and-conditions`); assert.equal(await noJSPage.locator('.legal-section').count(), 10);
  console.log('Mobile navigation, focus trap, reduced-motion switching, and no-JavaScript content passed.');
  for(const alias of ['/terms','/privacy']) { const response=await context.request.get(`${base}${alias}`); assert.equal(response.status(),200); }
  console.log('Accessibility findings:', JSON.stringify(violations, null, 2));
  console.log('Browser exceptions:', JSON.stringify(exceptions));
  assert.equal(exceptions.length, 0);
  assert.equal(violations.length, 0, 'All pages should pass the automated accessibility audit');
  console.log('All multi-page and interaction regressions passed.');
} finally { await browser.close(); }
