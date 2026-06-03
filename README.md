# MetisTools Player Tools

MetisTools is a static Astro site for browser-based video playback testing. It provides free tools for public or authorized M3U8/HLS, MP4 and MPEG-DASH/MPD links, plus guide pages, FAQ content and policy pages prepared for SEO and AdSense review.

## Project Scope

- Homepage for the free online video player tool set.
- Tool pages for M3U8, MP4 and MPEG-DASH playback testing.
- Playback Log support for browser-side events and troubleshooting clues.
- Guide pages for M3U8, CORS, MP4 URL and MPD testing topics.
- About, Contact, Privacy Policy, Terms, FAQ and Playback Policy pages.

MetisTools does not download, convert, capture, redistribute or bypass access controls for video content.

## Tech Stack

- Astro
- Tailwind CSS
- JavaScript
- hls.js
- dash.js
- Sentry browser SDK loaded only after optional monitoring consent

This project intentionally does not use TypeScript.

## Local Commands

```sh
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run check:audit
npm run check:prelaunch
```

`npm run build` generates `public/sitemap.xml` before building the static site. `npm run check` builds the site and runs production checks for SEO, AdSense-sensitive output and project constraints.
`npm run check:prelaunch` runs the production checks and the production dependency audit before launch.

## Important Paths

```text
src/config/               Shared site, navigation, tool, FAQ and guide data
src/components/           Reusable UI and player components
src/layouts/              Base and guide article layouts
src/pages/                Astro routes
src/pages/guides/         Guide article pages
scripts/generate-sitemap.mjs
scripts/check-production.mjs
public/                   Static assets, ads.txt, robots.txt and sitemap.xml
```

## SEO and AdSense Notes

- Keep all public page text in English.
- Keep user-facing pages focused on real playback testing and troubleshooting value.
- Do not add fake ad placeholders or simulated ad blocks.
- Do not place ads near URL inputs, Play buttons, video controls, fullscreen controls or Playback Log buttons.
- Do not add public CORS proxy, downloader, converter or bypass features.
- Keep Privacy Policy, Terms, Contact, About and Playback Policy reachable.
- Configure Google Privacy & messaging or another Google-certified CMP for EEA, UK and Switzerland users before relying on personalized ads in those regions.
- Keep the European Privacy Message published in AdSense Privacy & messaging.
- Keep public preview builds `noindex,nofollow`; set `METISTOOLS_NOINDEX=true` or `PUBLIC_METISTOOLS_NOINDEX=true` when the hosting platform does not expose a preview context automatically.
- Keep sitemap entries synchronized with real pages and include `lastmod`.
- Keep guide article images sourced from authorized `public/imgs/` assets unless new images are explicitly approved and added to the project.
- Keep security headers in `public/_headers` and test them after deployment.

## Privacy Notes

Submitted video URLs should stay inside the browser for playback testing. Do not expose full video URLs in global variables, analytics events, Sentry events, copied diagnostic reports or page URLs.

## Prelaunch Checklist

Before submitting or resubmitting the site for AdSense review:

- Deploy the current project to `https://metistools.com`.
- Confirm the old general tools site is no longer served on the domain.
- Confirm `https://metistools.com/ads.txt`, `robots.txt` and `sitemap.xml` are reachable.
- Confirm the AdSense European Privacy Message is published and visible in EEA, UK and Switzerland tests.
- Run `npm run check:prelaunch`.
- Manually test the homepage, M3U8 Player, MP4 Player, DASH Player, FAQ, Guides, About, Contact, Privacy Policy, Terms and Playback Policy on desktop and mobile.
- Confirm no fake ad placeholders are visible and no ad position is placed near player controls, URL inputs, Play buttons or Playback Log controls.
- Before AdSense approval, do not add ad slots inside the tool cards, URL form area, video player, Playback Log or Embed Code panel.

## Deployment

The site is designed for static hosting such as Cloudflare Pages.

Recommended build command:

```sh
npm run build
```

Recommended output directory:

```text
dist
```

## Changelog

See `CHANGELOG.md` for launch-readiness changes.

## Files Not Committed

The repository ignores local dependencies, build output, temporary research files, editor files and environment variables:

- `node_modules/`
- `dist/`
- `.astro/`
- `.env`
- `.DS_Store`
- `.vscode/`
- `.claude/`
- `tmp/`
- `output/`
- `.playwright-cli/`
