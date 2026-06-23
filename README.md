# YeshivaLab.net

The learning home of the TorahLab family — coming soon.

Right now this repo is a single static **coming-soon** page (`index.html`). No build
step, no dependencies. When the real product is built, this becomes the YeshivaLab
front-end on the **shared platform** (one engine + corpus + commentary pipeline +
accounts shared with TorahLab; see `torah-code-lab/TODO.md` #38).

## Structure
- `index.html` — the coming-soon landing page (self-contained: HTML + CSS + tiny inline JS).
- `404.html` — fallback page.

## Deploy (Cloudflare Pages)
This repo is git-connected to a Cloudflare Pages project named `yeshivalab`.

- **Build command:** _(none — static site)_
- **Build output directory:** `/` (root)
- **Custom domain:** `yeshivalab.net`

Push to `main` and Cloudflare auto-deploys. To preview locally, just open `index.html`
in a browser (or `npx serve .`).

## IMPORTANT — keep this repo OFF iCloud
Canonical location is a LOCAL clone at `~/dev/yeshivalab` (mirrors the torah-code-lab
convention). iCloud + git causes desync. Sync only via GitHub.

© AI Cool LLC · part of the TorahLab family · torahlab.net
