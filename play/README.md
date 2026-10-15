# Kazakhstan or not? — v1

Buildless static game, published at `/play/` on both domains. EN/RU; the booking page has a localized footer link in all 10 existing languages.

## Contract
- 5 rounds: 3 Kazakhstan locations + 2 other countries, shuffled deterministically by date in Asia/Almaty.
- Shared URLs carry `v=1&day=YYYY-MM-DD&lang=en|ru`. No answers or claimed scores in the URL.
- **Do not reorder/change the v1 bank or seed algorithm** after publishing. Ship a new version while retaining v1 handling if the collection changes, otherwise existing shared links change their questions.
- Browser-only localStorage progress; validate IDs, booleans, length and version. No prize ranking or anti-cheat claims.
- Buttons stay disabled if the photograph fails to load; retry without losing a point.
- Native sharing, clipboard fallback, WhatsApp compose link, PNG card preview/download. Nothing is automatically sent to a third party.
- The game deliberately loads no analytics script. `utm_source=game` on booking links allows existing site attribution to distinguish game-origin inquiries, but game completion/share counts are **not** collected.
- No dependencies, accounts, forms, payment handling or new backend.

## Assets
`assets/credits.json` records Wikimedia Commons source, author and license for every photo. Original photographs; resized/cropped for the screen, no AI transformations. All photo licenses are retained. The share card and `social.png` use original typographic/mountain graphics only.

## Checks
`node tools/test-game.mjs`; `node --check site/play/app.mjs`.
Browser: EN/RU, mobile 390px, five rounds, wrong/right answers, reload/resume, completed-result resume, result PNG preview, copy confirmation, review mode, links/UTM, console errors.

`tools/build.py --site com|kz --out ...` copies `site/play` into the generated folder. Existing root booking pages and API behavior remain independent.
