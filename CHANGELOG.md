# Changelog

## 2026-06-03

- Added prelaunch readiness checks for sitemap metadata, guide images, privacy content, security headers, internal links and structured data.
- Added guide article images using existing authorized assets in `public/imgs/`.
- Added `lastmod` and `changefreq` generation for sitemap entries.
- Added HSTS, Permissions-Policy and a compatibility-first Content Security Policy in `public/_headers`.
- Expanded Privacy Policy with US privacy choices, Global Privacy Control language and children policy language.
- Added GitHub transparency references to About and structured data.
- Added `featureList` and `screenshot` to tool page `WebApplication` JSON-LD.
- Added `npm run check:prelaunch` for final local verification before deployment.
