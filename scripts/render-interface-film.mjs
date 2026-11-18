// Produce a 12-second silent editorial cut from captures of the RERA WEB Workspace study.
// Inputs: wireframe.png and interface.png in the provided capture folder. Output: PNG frames for FFmpeg.
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.argv[2] || '/tmp/rera-polish/study';
const fps = 24, seconds = 12;
const output = join(root, 'frames');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  // Use the site's self-hosted font styles when available; browser font fallbacks also render the frames.
  const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
  await page.goto(`${base}/work/workspace-study`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  const stills = await Promise.all(['wireframe', 'interface'].map(async (id) => `data:image/png;base64,${(await readFile(join(root, `${id}.png`))).toString('base64')}`));
  await page.evaluate(async ([wireframe, finished]) => {
    const img = async (src) => { const image = new Image(); image.src = src; await image.decode(); return image; };
    const [wire, product] = await Promise.all([img(wireframe), img(finished)]);
    const canvas = document.createElement('canvas'); canvas.width = 1152; canvas.height = 648;
    const ctx = canvas.getContext('2d', { alpha: false });
    const w = canvas.width, h = canvas.height;
    const fonts = getComputedStyle(document.documentElement);
    const mono = fonts.getPropertyValue('--font-geist-mono').trim() || 'monospace';
    const sans = fonts.getPropertyValue('--font-geist').trim() || 'sans-serif';
    const serif = fonts.getPropertyValue('--font-instrument').trim() || 'serif';
    const ink = '#151512', bone = '#f0ece2', orange = '#ff5a1f';
    const smooth = n => { const t = Math.max(0, Math.min(1, n)); return t*t*(3-2*t); };
    function line(x, y, toX, toY, color) { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(toX, toY); ctx.stroke(); }
    function text(value, x, y, font, color) { ctx.fillStyle = color; ctx.font = font; ctx.fillText(value, x, y); }
    function marks(x, y, width, height, color) { for (const mx of [x,x+width]) for (const my of [y,y+height]) { line(mx-7,my,mx+7,my,color); line(mx,my-7,mx,my+7,color); } }
    function shot(source, box, zoom, anchor = [.5,.5], cut = [0,0,0,0]) {
      const [x,y,width,height] = box;
      const [cx,cy,cw,ch] = cut;
      const iw = cw || source.width, ih = ch || source.height;
      const scale = Math.max(width/iw, height/ih) * zoom;
      ctx.save(); ctx.beginPath(); ctx.rect(x,y,width,height); ctx.clip();
      const dw = iw*scale, dh = ih*scale;
      ctx.drawImage(source, cx,cy,iw,ih,x-(dw-width)*anchor[0],y-(dh-height)*anchor[1],dw,dh);
      ctx.restore();
    }
    window.renderReraFrame = (t) => {
      const stage = t < 3.75 ? 0 : t < 8.2 ? 1 : 2;
      const phase = stage===0 ? t/3.75 : stage===1 ? (t-3.75)/4.45 : (t-8.2)/3.8;
      const dark = stage===1;
      const rule = dark ? '#4a473f' : '#c5bfb2';
      const fg = dark ? bone : ink, dim = dark ? '#b5afa1' : '#595448';
      ctx.fillStyle = dark ? '#161615' : bone; ctx.fillRect(0,0,w,h);
      for(const x of [42.5,374.5,1110.5]) line(x,61,x,582,rule);
      line(42,61.5,1110,61.5,rule); line(42,581.5,1110,581.5,rule);
      ctx.fillStyle = orange; ctx.fillRect(43,31,7,7);
      text('RERA WEB  /  BUILD SHORTS',60,39,`15px ${mono}`,fg);
      text('ILLUSTRATIVE  /  01',914,39,`14px ${mono}`,dim);
      if (stage===0) {
        text('01 / WIREFRAME',61,166,`15px ${mono}`,dim);
        text('Structure',61,267,`500 59px ${sans}`,fg);
        text('first.',60,334,`italic 80px ${serif}`,fg);
        text('Make the flow clear',62,444,`19px ${sans}`,dim);
        text('before styling the screen.',62,475,`19px ${sans}`,dim);
        shot(wire,[399,122,687,393],1.005+.025*smooth(phase));
        ctx.strokeStyle = rule; ctx.strokeRect(398.5,121.5,688,394); marks(399,122,687,393,rule);
      } else if(stage===1) {
        shot(product,[85,94,982,456],1.01+.027*smooth(phase),[.46,.40]);
        marks(85,94,982,456,rule);
        ctx.fillStyle='#161615';ctx.fillRect(85,497,284,53);
        text('02 / INTERFACE',102,529,`15px ${mono}`,fg);
      } else {
        text('03 / DETAIL',61,166,`15px ${mono}`,dim);
        text('Work,',61,266,`500 64px ${sans}`,fg);
        text('in focus.',60,337,`italic 76px ${serif}`,fg);
        text('Give the next action',62,444,`19px ${sans}`,dim);
        text('a clear place to live.',62,475,`19px ${sans}`,dim);
        shot(product,[399,122,687,393],1.015+.035*smooth(phase),[.55,.48],[265,115,850,470]);
        ctx.strokeStyle = rule; ctx.strokeRect(398.5,121.5,688,394);marks(399,122,687,393,rule);
      }
      text('WORKSPACE  /  PRODUCT DESIGN STUDY',42,617,`14px ${mono}`,dim);
      for(let s=0;s<3;s++){ctx.fillStyle=s===stage?orange:rule;ctx.fillRect(971+s*49,610,42,s===stage?3:1);}
      return canvas.toDataURL('image/png').split(',')[1];
    };
  }, stills);
  for(let frame=0;frame<fps*seconds;frame++) {
    const data = await page.evaluate((time) => window.renderReraFrame(time), frame/fps);
    await writeFile(join(output, `frame-${String(frame).padStart(4,'0')}.png`), Buffer.from(data,'base64'));
  }
  console.log(`Rendered ${fps*seconds} frames to ${output}`);
} finally { await browser.close(); }
