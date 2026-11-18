import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const exceptions = [];
const requests = [];
page.on('pageerror', error => exceptions.push(error.message));
page.on('request', request => requests.push(new URL(request.url()).pathname));
const dock = page.getByRole('link', { name: 'Patch site guide', exact: true });
const dialog = page.getByRole('dialog', { name: /Hi, I’m Patch/ });
const find = page.getByRole('searchbox', { name: /Find a page, chapter or capability/i });
const listLinks = () => page.locator('.guide-list a[href]');
const segment = (name) => page.getByRole('button', { name: new RegExp(`^${name}`), exact: false }).first();
// Poll the live URL: client-side pushes and history traversal emit no load/commit event.
const waitRoute = path => page.waitForFunction(p => window.location.pathname === p, path, { timeout: 30000 });
const waitHash = (path, hash) => page.waitForFunction(([p, h]) => window.location.pathname === p && window.location.hash === h, [path, hash], { timeout: 30000 });
const keyboardFocus = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
const activeText = () => page.evaluate(() => document.activeElement?.textContent?.trim() ?? '');
const noOverflow = async (path) => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), await page.evaluate(() => window.innerWidth), `Overflow on ${path}`);
const runAxe = async (label) => {
  const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  const failures = result.violations.map(x => ({id:x.id,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  assert.equal(failures.length, 0, `${label}: ${JSON.stringify(failures)}`);
};
const instantAnchor = async (selector) => { await page.locator(selector).evaluate(el => el.scrollIntoView({block:'start',behavior:'instant'})); };
try {
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('video').count(), 0, 'Do not mount video before play');
  assert.ok(!requests.some(x => x.endsWith('.mp4') || x.endsWith('turntable.webp')), 'Do not request heavy media initially');
  const {patch, films, founder, hero, railRatio} = await page.evaluate(() => {
    const background = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;
    const light = ['#meet-patch','#build-shorts','#about'].map(selector => document.querySelector(selector).getBoundingClientRect().height).reduce((a,b)=>a+b,0);
    return {patch:background('#meet-patch'),films:background('#build-shorts'),founder:background('#about'),hero:background('body'),railRatio:light / document.body.scrollHeight};
  });
  assert.equal(patch,founder); assert.equal(films,founder); assert.notEqual(hero,patch); assert.ok(railRatio < .34,'Keep the page mostly ink');
  assert.equal(await page.locator('.chapter-transition.with-dither .dither-seam').count(), 6, 'All six ink/paper transitions on the homepage must use the dither seam');
  await page.screenshot({path:'artifacts/paper-home-hero.png'});
  await instantAnchor('#meet-patch');
  await page.waitForFunction(() => document.querySelector('.build-rail')?.classList.contains('on-paper'));
  await page.screenshot({path:'artifacts/paper-patch-feature.png'});
  await page.locator('#meet-patch .patch-turn-controls').evaluate(el => window.scrollTo({top:el.getBoundingClientRect().top + window.scrollY - innerHeight + 80,behavior:'instant'}));
  await page.waitForFunction(() => {
    const target = document.querySelector('#meet-patch .patch-turn-controls button:last-child');
    const rect = target?.getBoundingClientRect();
    return rect && target.contains(document.elementFromPoint(rect.left + rect.width/2, rect.top + rect.height/2));
  });
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));

  // Global "g" shortcut opens the console from anywhere on the page.
  await page.locator('body').click({position:{x:8,y:420}});
  await page.keyboard.press('g'); await dialog.waitFor();
  assert.equal(await keyboardFocus(), 'Close site guide');
  assert.ok((await dialog.innerText()).includes('YOU’RE ON / HOME'));
  assert.ok((await dialog.innerText()).includes('FOUNDED BY GAURAV & ABHIJEET'));
  // Focus trap wraps between the close button and the last link.
  await page.keyboard.press('Shift+Tab'); assert.equal(await activeText(), 'Full site guide');
  await page.keyboard.press('Tab'); assert.equal(await keyboardFocus(), 'Close site guide');
  await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement?.tagName), 'INPUT');
  // "/" focuses find from anywhere inside the dialog.
  await page.getByRole('button',{name:'Close site guide'}).focus();
  await page.keyboard.press('/'); assert.equal(await page.evaluate(() => document.activeElement?.type), 'search');

  // Segmented lists: contextual suggestions plus home chapters, then every page, then every capability.
  await segment('For you').click();
  const suggested = await listLinks().count();
  assert.ok(suggested >= 14 && (await dialog.innerText()).includes('ON THIS PAGE'), `Suggested list should merge shortcuts and chapters, got ${suggested}`);
  assert.ok(await page.getByRole('link', {name:/The beginning/}).count(), 'Home chapters are offered as in-page jumps');
  await segment('Pages').click();
  assert.equal(await listLinks().count(), 9);
  assert.ok((await page.locator('.guide-list a[aria-current="page"]').innerText()).toLowerCase().includes('you are here'), 'Current page is marked');
  await segment('Capabilities').click();
  assert.equal(await listLinks().count(), 6);
  assert.ok((await dialog.innerText()).includes('6 CAPABILITIES'));

  // Arrow keys walk the visible list, wrapping at both ends.
  await listLinks().first().focus();
  await page.keyboard.press('ArrowDown'); assert.equal(await page.evaluate(() => document.activeElement === document.querySelectorAll('.guide-list a')[1]), true);
  await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp');
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelectorAll('.guide-list a')[5]), true);

  // Find searches titles, notes, paths and capability keywords; Enter opens the first match.
  await find.fill('automation');
  assert.ok((await dialog.innerText()).includes('MATCH'), 'Result count is announced');
  assert.ok((await listLinks().first().innerText()).includes('AI & automation'));
  await runAxe('Guide console while searching');
  await page.screenshot({path:'artifacts/guide-console-search.png'});
  await find.press('Enter'); await waitRoute('/services/ai-automation');
  await dialog.waitFor({state:'hidden'});

  // Escape clears a search before it closes the console.
  await dock.click(); await dialog.waitFor();
  assert.ok((await dialog.innerText()).includes('YOU’RE ON / CAPABILITIES'));
  await find.fill('zzz-no-match');
  assert.ok((await dialog.innerText()).includes('Nothing matches'));
  await page.keyboard.press('Escape');
  assert.equal(await dialog.isVisible(), true, 'First Escape clears the query');
  assert.equal(await find.inputValue(), '');
  await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
  assert.equal(await keyboardFocus(), 'Patch site guide', 'Focus returns to the launcher');

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('link', {name:'Open site guide', exact:true}).click(); await dialog.waitFor();
  await dialog.getByRole('link', {name:/Explore capabilities/}).click(); await waitRoute('/services');
  await dialog.waitFor({state:'hidden'}); await dock.click();
  await dialog.getByRole('link', {name:/Follow the build process/}).click(); await waitRoute('/process');
  await dock.click(); assert.ok((await dialog.innerText()).includes('YOU’RE ON / PROCESS'));
  await dialog.getByRole('link', {name:/Start a project brief/}).click();
  await waitHash('/contact', '#brief');
  await dialog.waitFor({state:'hidden'}); await page.locator('#brief-name').waitFor();
  await page.goBack(); await waitRoute('/process'); assert.equal(await dialog.isVisible(), false);
  await dock.click(); await dialog.getByRole('link', {name:'Full site guide',exact:true}).click(); await waitRoute('/guide');
  await page.getByRole('heading', {level:1}).waitFor();

  // Recents remember the journey without storing anything server-side.
  await dock.click(); await dialog.waitFor();
  const recents = page.locator('.guide-recents a');
  assert.ok(await recents.count() >= 2, 'Recently visited pages are offered');
  assert.ok((await page.locator('.guide-recents').innerText()).includes('Process'));
  await recents.first().click(); await dialog.waitFor({state:'hidden'});
  await waitRoute('/process');
  await page.goBack(); await waitRoute('/guide');
  await runAxe('Guide page console');

  const turntable = page.locator('.patch-turntable');
  const frameHeight = await turntable.evaluate(el => el.getBoundingClientRect().height);
  assert.equal(await turntable.getAttribute('data-angle'),'0');
  await page.getByRole('button', {name:'Rotate Patch right'}).click();
  await page.waitForFunction(() => document.querySelector('.patch-turntable')?.getAttribute('data-ready') === 'true');
  assert.equal(await turntable.getAttribute('data-angle'),'1');
  assert.ok(requests.some(x=>x.endsWith('turntable.webp')));
  await page.getByRole('button',{name:'Rotate Patch left'}).click();
  await page.getByRole('button',{name:'Rotate Patch left'}).click();
  assert.equal(await turntable.getAttribute('data-angle'),'15');
  await page.getByRole('button',{name:'Reset Patch to front'}).click();
  assert.equal(await turntable.getAttribute('data-angle'),'0');
  const stage = await turntable.locator('.patch-stage').boundingBox();
  await page.mouse.move(stage.x + stage.width * .35, stage.y + stage.height * .5);
  await page.mouse.down(); await page.mouse.move(stage.x + stage.width * .65, stage.y + stage.height * .5,{steps:8}); await page.mouse.up();
  assert.notEqual(await turntable.getAttribute('data-angle'),'0');
  assert.equal(await turntable.evaluate(el=>el.getBoundingClientRect().height),frameHeight,'Switching angles must not shift layout');
  await page.getByRole('button',{name:'Reset Patch to front'}).click();
  await runAxe('Guide page');
  await page.screenshot({path:'artifacts/patch-guide-page.png'});
  console.log('Patch console: g and / shortcuts, focus trap, segments, chapter jumps, search, Enter-to-open, Escape-to-clear, recents, and rotation passed.');

  // Both founders are named consistently across the site.
  await page.goto(`${base}/about`,{waitUntil:'networkidle'});
  const aboutText = await page.locator('main').innerText();
  for (const expected of ['Gaurav.','Abhijeet.','GAURAV & ABHIJEET / FOUNDERS','Founded by Gaurav & Abhijeet','Two founders, one shared standard']) assert.ok(aboutText.includes(expected), `About page is missing ${expected}`);
  await page.screenshot({path:'artifacts/founders-about.png'});
  await page.goto(`${base}/contact`,{waitUntil:'networkidle'});
  assert.ok((await page.locator('.contact-person').innerText()).includes('Gaurav & Abhijeet'));
  const html = await page.content();
  assert.ok(html.includes('"name":"Gaurav"') && html.includes('"name":"Abhijeet"'), 'Structured data names both founders');
  await page.goto(base,{waitUntil:'networkidle'});
  assert.ok((await page.locator('.site-footer').innerText()).includes('FOUNDED BY GAURAV & ABHIJEET'));
  console.log('Founders: About, Contact, structured data and footer all name Gaurav and Abhijeet.');

  await page.goto(`${base}/work#build-shorts`,{waitUntil:'networkidle'});
  await runAxe('Work page before playback');
  const index = page.getByRole('group', {name:'Choose a short film'});
  assert.equal(await index.getByRole('button').count(),3);
  assert.equal(await page.locator('video').count(),0);
  const playerHeight = await page.locator('.film-frame').evaluate(el=>el.getBoundingClientRect().height);
  await page.screenshot({path:'artifacts/paper-screening-room.png'});
  for(const [title,file,duration] of [['From wireframe to interface','interface-study.mp4',12],['Under the interface','terminal-study.mp4',15],['Patch, in the studio','patch-studio.mp4',6]]) {
    const selector = index.getByRole('button',{name:new RegExp(title)});
    await selector.click(); assert.equal(await selector.getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('.film-frame').evaluate(el=>el.getBoundingClientRect().height),playerHeight);
    const button = page.getByRole('button',{name:`Play ${title}`,exact:true});
    const response = page.waitForResponse(res => res.url().endsWith(file) && (res.status()===200 || res.status()===206));
    await button.click(); await response;
    const video = page.locator(`video[src$="${file}"]`);
    await page.waitForFunction(src => { const el = document.querySelector(`video[src$="${src}"]`); return el && el.readyState >= 2 && el.currentTime > 0.05; }, file);
    const attributes = await video.evaluate(el => ({duration:el.duration, width:el.videoWidth, controls:el.controls, inline:el.playsInline}));
    assert.ok(Math.abs(attributes.duration-duration)<.1 && attributes.width>0 && attributes.controls && attributes.inline);
    await page.locator('.film-transcript summary').click(); assert.equal(await page.locator('.film-transcript').getAttribute('open'),'');
    if(file==='terminal-study.mp4') {
      await page.locator('.screening-credits summary').click();
      assert.equal(await page.locator('.screening-credits a').count(),3);
      await runAxe('Licensed film, visual description and credits');
    }
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(src => document.querySelector(`video[src$="${src}"]`)?.paused,file);
  }
  await page.getByRole('button',{name:'Back to poster'}).click(); assert.equal(await page.locator('video').count(),0);
  await page.goto(`${base}/work#patch-studio`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Play Patch, in the studio',exact:true}).waitFor();
  assert.equal(await page.locator('video').count(),0);
  console.log('Screening room: stable switching, three working films, source links, captions, pause, and studio deep link passed.');

  await page.setViewportSize({width:360,height:740});
  await page.goto(`${base}/`,{waitUntil:'networkidle'}); await noOverflow('/');
  await page.getByRole('link',{name:'Watch the build',exact:true}).click();
  await waitHash('/', '#build-shorts');
  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Open navigation'}).click();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:/Work/}).click(); await waitRoute('/work');
  await noOverflow('/work'); await dock.click(); await dialog.waitFor();
  assert.ok((await dialog.innerText()).includes('YOU’RE ON / WORK'));
  await dialog.evaluate(async el => { await Promise.all(el.getAnimations().map(animation => animation.finished.catch(() => {}))); });
  await page.screenshot({path:'artifacts/guide-console-mobile.png'});
  await segment('Capabilities').click(); assert.equal(await listLinks().count(),6);
  await noOverflow('/work');
  await find.fill('cloud'); assert.ok((await listLinks().first().innerText()).includes('Backend & cloud'));
  await page.screenshot({path:'artifacts/guide-console-mobile-search.png'});
  await find.fill('');
  // Clearing a search returns to the segment that was active, so switch back explicitly.
  await segment('For you').click();
  await dialog.getByRole('link',{name:/Watch the build shorts/}).click();
  await waitHash('/work', '#build-shorts');
  await dialog.waitFor({state:'hidden'});
  await page.goto(`${base}/guide`,{waitUntil:'networkidle'}); await noOverflow('/guide');
  await page.emulateMedia({reducedMotion:'reduce'}); await dock.click();
  assert.equal(await dialog.evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.getByRole('button',{name:'Close site guide'}).click();
  await page.getByRole('button',{name:'Rotate Patch right'}).click(); assert.equal(await turntable.getAttribute('data-angle'),'1');
  const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const fallback = await noJS.newPage(); await fallback.goto(base);
  await fallback.getByRole('link',{name:'Patch site guide',exact:true}).click();
  await fallback.waitForURL('**/guide'); assert.ok(await fallback.getByRole('heading',{name:/Choose a destination/}).count());
  assert.equal(await fallback.locator('.patch-turn-controls').isVisible(),false);
  assert.equal(await fallback.locator('.guide-page-index ol a').count(),9,'The full index is readable without JavaScript');
  await fallback.goto(`${base}/work#build-shorts`); assert.equal(await fallback.locator('video[controls]:visible').count(),3);
  assert.deepEqual(exceptions,[]);
  console.log('360px screens, reduced motion, no-JavaScript navigation and media fallbacks passed.');
} finally { await browser.close(); }
