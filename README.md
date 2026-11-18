# RERA WEB

A full Next.js App Router website for Gaurav and Abhijeet’s independent Indian software startup. TypeScript, next/font, Tailwind CSS, restrained GSAP enhancements, and PostgreSQL via Drizzle.

## Pages

- `/`: seven-chapter editorial homepage and interactive software blueprint.
- `/services`: complete capability directory.
- `/services/web-development`
- `/services/custom-software`
- `/services/ai-automation`
- `/services/web3-blockchain`
- `/services/ui-ux-design`
- `/services/backend-cloud`
- `/work`: honest technical-exploration overview and Build Shorts.
- `/work/workspace-study`: illustrated study with wireframe/interface controls and an optional short film.
- `/guide`: Patch’s 3D turntable, full site index, and links to every service.

## Site guide console

`src/components/guide/site-guide.tsx` renders the floating Patch launcher and its dialog on every route. The dialog offers: a live find field searching page titles, notes, paths and capability keywords; segmented lists (For you / Pages / Capabilities); in-page chapter jumps where those anchors exist; a "You are here" marker on the current page; up to three recently visited pages from `sessionStorage`; and contextual suggestions per route from `src/data/guide.ts`.

Keyboard: `G` opens the guide anywhere except while typing, `/` focuses the find field, `↑`/`↓` move through results, `Enter` in the field opens the first match, `Esc` clears a search and then closes, and focus is trapped and returned to the element that opened the dialog. Without JavaScript the launcher is a plain link to `/guide`.

The company has two founders, Gaurav and Abhijeet, configured in `src/data/site.ts` (`founders`, `foundersLabel`). Structured data, the About and Contact pages, the footer, legal text and the guide all read from that configuration.
- `/process`: five-stage process with native section navigation and artifacts.
- `/about`: founder story and principles, without a fictional portrait.
- `/contact`: project brief, with optional `?service=` preselection.
- `/terms-and-conditions`, `/privacy-policy`: dedicated readable legal documents.
- `/terms`, `/privacy`: permanent redirects to the legal documents.

Each content route has its own metadata and breadcrumbs. Canonical URLs and the sitemap use `NEXT_PUBLIC_SITE_URL` only when a real origin is supplied. The legal copy should be reviewed for the operator’s actual business practices before a public launch; it does not invent registration details, a city of jurisdiction, or a fixed retention policy.

## Content

`src/data/site.ts` stores nullable identity/contact configuration. Missing unverified details are hidden. Services, service-specific FAQs and outcomes, project studies, process content, legal documents, and diagram descriptions are in `src/data/`.

The single work study is clearly marked illustrative. It is not a client case study, a launched product, or a claim of measured results.

## Media and navigation guide

Patch is an original Blender-modeled robot. A compact launcher opens a keyboard-accessible, contextual site guide on every page, with a `/guide` fallback. The warm-paper home exhibit and guide page use a still portrait until visitors request an angle; the 3D turntable uses a pre-rendered sprite, not a WebGL runtime.

Build Shorts collects an original interface film, a three-shot licensed engineering edit, and an original 3D studio cut. All three are self-hosted, silent, and playable on request, with visual descriptions. The player pauses when the selected film changes or it goes off screen. Source credits and the asset build process are documented in [media credits](docs/media-credits.md).

## Interaction architecture

- The hero’s selected layer has one owner: component state. Scroll does not override manual choice. Selecting a tab brings that diagram to the foreground without changing the frame height. Left/Right/Home/End support keyboard navigation.
- CSS owns plate transforms. Pointer motion affects a separate parent. GSAP does not write to diagram transforms or interactive previews.
- Service accordions change only on click or Enter/Space. Arrow keys move focus; hovering and focusing do not resize or change the list.
- Diagram stages and their toolbars retain their dimensions across services and desktop/mobile previews.
- The motion controller uses scoped `gsap.matchMedia()` cleanup. Pending asynchronous imports and scheduled refreshes cannot reanimate a route after unmount. Resize observation refreshes decorative scroll triggers when content height changes.
- Reduced-motion users retain every diagram selection and control. Only motion is removed. A no-JavaScript static stack and expanded service text remain available.
- Route changes reset mobile navigation and release the scroll lock. Native focus trapping and Escape support are retained.

## Contact backend

The database connection reads `DATABASE_URL` in `src/db/index.ts`. Once PostgreSQL is ready, apply the existing schema with `npx drizzle-kit push`.

Required for actual email delivery:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL` — a verified Resend sender

Optional:

- `NEXT_PUBLIC_CONTACT_EMAIL` — verified public email for direct links
- `NEXT_PUBLIC_SITE_URL` — verified public origin
- Upstash REST URL/token — distributed rate limiting; production otherwise uses PostgreSQL
- `RATE_LIMIT_SALT` — optional additional salt
- Both Turnstile keys — optional browser and server verification

See `.env.example` for the variable names. Never commit real credentials.

`POST /api/contact` uses the shared Zod schema, honeypot, minimum completion time, request cap, and rate limits. IPs are hashed for stored rate-limit keys. When email is configured, validated briefs are stored as pending and submitted to Resend with an idempotency key. Success is returned only after the provider returns an email ID. A provider-accepted email is not a claim of inbox placement or that the recipient read it.

Missing configuration returns an explicit HTTP 503 not-sent state. Failed attempts preserve typed values in the page. Native form submission uses POST, never a GET query containing the brief. No fabricated response-time promise is shown.

## Validation

Run from the project root:

- `npx next typegen`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build`

Use the platform-managed build/start healthcheck for the complete runtime. `/api/health` checks the actual PostgreSQL connection.

`node scripts/browser-check.mjs` tests rapid diagram changes, manual selection persistence, fixed preview dimensions, keyboard navigation, routes, browser Back, responsive overflow, automated accessibility, mobile focus, legal aliases, reduced motion, no-JavaScript content, service-prefilled contact flow, and honest form failure states.

`node scripts/api-check.mjs` tests validation, honeypot rejection, minimum completion time, missing delivery configuration, and rate limits. It cleans its test rate-limit keys through Drizzle.
