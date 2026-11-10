# TaoSheng Website

The bilingual marketing site for **TaoSheng** — an open-source personal memory tool for Android that listens all day, transcribes on-device, recognizes who is speaking, and lets AI turn conversations into todos, promises and memories.

Built with [Astro](https://astro.build) as a fully static site: no backend, no database, no user accounts.

- This repo: <https://github.com/taosheng-app/taosheng-website> (private)
- App repo: <https://github.com/0xCoach/TaoSheng>

> 中文版本：[README.md](./README.md)

## Tech stack

| Layer | Version | Role |
|---|---|---|
| Astro | 6.3.7 (pinned) | Static site generation, JS-light by default |
| Tailwind CSS | 4.3.5 | Styling, wired in through `@tailwindcss/vite` |
| Alpine.js | 3.17.5 | Language switching, mobile menu, update modal |
| sharp | 0.34.5 | Renders `logo.svg` into PNG icons (dev only) |

**npm** is the only package manager here; the lockfile is `package-lock.json`, so `npm ci` reproduces the exact tree.

Requires **Node.js >= 22.12.0** (see `engines` in `package.json`).

### Why two versions are pinned

`astro` is pinned to the exact version `6.3.7`, and an `overrides` entry holds `vite` at `7.3.3`. Astro 6.4 pulls in Vite 8 (the rolldown core), where Tailwind 4.3's Vite plugin fails outright:

```
[@tailwindcss/vite:generate:build] Missing field `tsconfigPaths` on BindingViteResolvePluginConfig.resolveOptions
```

That is an upstream incompatibility, not a misconfiguration here. Once Tailwind supports Vite 8, drop the `overrides` entry and loosen `astro` — and always run `npm run build` to confirm.

## Getting started

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run deploy` | Deploy to Cloudflare Pages via Wrangler |
| `npm run preview:prod` | Deploy targeting the `taosheng-website` project |
| `npm run astro` | Invoke the Astro CLI directly |

> The `deploy` scripts depend on `wrangler`, which is intentionally **not** in `devDependencies`. Run `npm i -D wrangler` or `npx wrangler login` once before the first deploy.

## Pages

| Route | File | Content |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero, four core capabilities, workflow demo, privacy note, CTAs |
| `/about` | `src/pages/about.astro` | Positioning, four design principles, tech stack |
| `/download` | `src/pages/download.astro` | Two ways in (APK / build from source), feature comparison, FAQ |
| `/contact` | `src/pages/contact.astro` | Bug reports, questions, email |
| `/privacy` | `src/pages/privacy.astro` | Privacy policy: no account, no server, data stays on device |
| `/terms` | `src/pages/terms.astro` | Terms, recording-compliance notice, MIT license |
| `/pricing` | `src/pages/pricing.astro` | Legacy path, `meta refresh` redirect to `/download` |
| 404 | `src/pages/404.astro` | Not found |

TaoSheng is free and open source, so the original "Pricing" page became "Download". The old path still redirects to keep existing links working.

## Project layout

```
.
├── public/                  # Copied to dist/ as-is
│   ├── logo.svg             # Brand mark (orange waveform + echo rings)
│   ├── logo.png             # 512×512
│   ├── favicon-256.png
│   ├── favicon-32.png
│   ├── apple-touch-icon.png
│   ├── og-cover.jpg         # Social sharing cover
│   └── site.webmanifest
├── src/
│   ├── components/
│   │   ├── Check.astro      # Checkmark list icon
│   │   └── NotFound.astro   # 404 page content
│   ├── i18n/
│   │   └── translations.ts  # Single source of truth for all copy
│   ├── layouts/
│   │   └── Layout.astro     # Header, footer, mobile menu, modal, i18n store
│   ├── pages/               # One file per route
│   └── styles/
│       └── global.css       # Color tokens, typography, animations
├── astro.config.mjs
├── wrangler.toml            # Cloudflare Pages config
└── package.json
```

## How the bilingual setup works

The site is **not** two sets of pages. It ships one DOM and swaps copy at runtime, so there is nothing duplicated to keep in sync.

- All copy lives in `src/i18n/translations.ts`. The `en` and `zh` trees mirror each other key for key — 196 entries each — grouped as `meta / header / nav / mobileMenu / footer / notFound / index / download / about / contact / privacy / terms`.
- On first visit, `lang` is read from `localStorage`; if absent, `navigator.language` decides — Chinese locales get `zh`, everything else gets `en`.
- The `中 / EN` toggle in the header swaps every string immediately and also updates `<html lang>`, `<title>`, `description`, `keywords` and the og tags, then persists the choice.
- Each page carries Chinese static text as a fallback, so the site stays readable if JS never runs — good for SEO and first paint.
- Language choice **does not change the URL**. Search engines index a single page, so there are no duplicate-content or `hreflang` concerns.

Adding a string:

```ts
// src/i18n/translations.ts
en: { download: { faq6Q: 'Does it drain battery?', faq6A: '...' } },
zh: { download: { faq6Q: '会很耗电吗？', faq6A: '……'     } },
```

```astro
<h3 x-text="$store.i18n.t('download.faq6Q')">会很耗电吗？</h3>
```

Keys must match exactly on both sides. A missing key makes `t()` return the key itself, so an unresolved `download.faq6Q` shows up verbatim in the UI — that is the only warning you get.

## Maintaining content

These are the spots that cover day-to-day updates:

- **Version number** — `v0.2.20` is hardcoded in `src/i18n/translations.ts` under `footer.version` and `download.apkBtn` (four places across both languages). Bump them together on release.
- **Repository links** — `REPO`, `RELEASES`, `README`, `CHANGELOG`, `CARDS` and `LICENSE` are defined once at the top of `src/layouts/Layout.astro` and reused everywhere. If the app repo ever moves under the org, this is the only file to touch.
- **Page metadata** — the `Props` interface in `Layout.astro` accepts `title / description / keywords` plus `titleEn / descEn / keywordsEn`; each page passes them in from its frontmatter.
- **canonical** — defaults to `'/'`, a placeholder. **Before deploying**, replace it with your absolute domain, otherwise both canonical and `og:url` stay relative.
- **Do not add `@alpinejs/collapse`** — the mobile menu uses core `x-transition`. Under Alpine 3.17 that plugin leaves the menu at `height: 0px` (the button flips `aria-expanded` to true but nothing appears). The dependency has been removed; don't bring it back.
- **Icons** — after editing `public/logo.svg`, regenerate the PNGs:

```bash
node -e "const sharp=require('sharp'),fs=require('fs');const svg=fs.readFileSync('public/logo.svg');(async()=>{for(const [n,s] of [['logo.png',512],['favicon-256.png',256],['favicon-32.png',32],['apple-touch-icon.png',180]]){await sharp(svg).resize(s,s).png().toFile('public/'+n)}console.log('icons generated')})()"
```

## Deployment

The output is plain static files and can be hosted anywhere.

Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist
```

`wrangler.toml` already declares `name = "taosheng-website"` and `pages_build_output_dir = "dist"`. If you connect the repo instead, use `npm run build` as the build command and `dist` as the output directory.

## Related

- TaoSheng app and full documentation: <https://github.com/0xCoach/TaoSheng>
- Latest release: <https://github.com/0xCoach/TaoSheng/releases/latest>

## License

Site content follows the same MIT license as the TaoSheng app. The brand name, logo and cover image belong to the TaoSheng project — please credit the source when reusing them.
