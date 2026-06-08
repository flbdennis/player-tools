// 生产发布检查脚本 - 使用 Node 原生能力检查 Ads 审核前最关键的工程与 SEO 风险
import fs from 'node:fs';
import path from 'node:path';
import { guideArticles } from '../src/config/guideArticles.js';
import { disabledDraftStreamRoutes } from '../src/config/streamTools.js';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');
const failures = [];

function fail(message) {
  failures.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(rootDir, relativePath));
}

function exactExists(dirRelativePath, fileName) {
  const dirPath = path.join(rootDir, dirRelativePath);
  return fs.existsSync(dirPath) && fs.readdirSync(dirPath).includes(fileName);
}

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function listFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath, predicate));
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function stripNonVisibleHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ');
}

function getTagCount(html, pattern) {
  return (html.match(pattern) || []).length;
}

function routeFromDistHtml(file) {
  const relativePath = path.relative(distDir, file).replaceAll(path.sep, '/');
  if (relativePath === 'index.html') return '/';
  if (relativePath === '404.html') return '/404';
  const route = relativePath
    .replace(/\/index\.html$/, '')
    .replace(/\.html$/, '');
  return `/${route}`;
}

function stripHashAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

function readPngSize(relativePath) {
  const buffer = fs.readFileSync(path.join(rootDir, relativePath));
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function isValidIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime());
}

// 基础目录和产物检查：必须先构建 dist，再运行本脚本
if (!fs.existsSync(distDir)) {
  fail('dist directory is missing. Run npm run build first.');
}

// 项目技术约束：禁止在源码区引入 TypeScript 文件或 tsconfig
const forbiddenTypeScriptFiles = listFiles(rootDir, (file) => {
  const relativePath = path.relative(rootDir, file);
  if (relativePath.startsWith('node_modules/') || relativePath.startsWith('dist/') || relativePath.startsWith('.astro/')) return false;
  return /\.(ts|tsx)$/.test(file) || path.basename(file) === 'tsconfig.json';
});
if (forbiddenTypeScriptFiles.length > 0) {
  fail(`TypeScript files are not allowed: ${forbiddenTypeScriptFiles.map((file) => path.relative(rootDir, file)).join(', ')}`);
}

// AdSense 文件大小写必须稳定：只允许 lowercase ads.txt
if (!exists('public/ads.txt')) fail('public/ads.txt is missing.');
if (exactExists('public', 'Ads.txt')) fail('public/Ads.txt must not exist. Use lowercase ads.txt only.');
if (exactExists('dist', 'Ads.txt')) fail('dist/Ads.txt must not exist. Use lowercase ads.txt only.');
if (!exists('public/robots.txt')) fail('public/robots.txt is missing.');
if (!exists('public/sitemap.xml')) fail('public/sitemap.xml is missing.');
if (exactExists('public', 'Robots.txt')) fail('public/Robots.txt must not exist. Redirect the variant instead.');
if (exactExists('public', 'Sitemap.xml')) fail('public/Sitemap.xml must not exist. Redirect the variant instead.');
if (exactExists('public', 'favicon.ico')) fail('public/favicon.ico must not exist. Redirect to /logo/favicon.ico instead.');

// 常见大小写误访路径：Cloudflare Pages 静态路径大小写敏感，用 _redirects 规范化，减少无意义 404
let redirectsText = '';
if (!exists('public/_redirects')) {
  fail('public/_redirects is missing. Add redirects for common case-sensitive utility paths.');
} else {
  redirectsText = read('public/_redirects');
  [
    '/Sitemap.xml /sitemap.xml 301',
    '/Robots.txt /robots.txt 301',
    '/Ads.txt /ads.txt 301',
    '/favicon.ico /logo/favicon.ico 301',
  ].forEach((rule) => {
    if (!redirectsText.includes(rule)) fail(`public/_redirects is missing rule: ${rule}`);
  });
}

if (exists('public/robots.txt')) {
  const robotsText = read('public/robots.txt');
  if (!robotsText.includes('Allow: /')) fail('production robots.txt must allow crawling.');
  if (!robotsText.includes('Sitemap: https://metistools.com/sitemap.xml')) fail('production robots.txt must point to the canonical sitemap URL.');
  if (/Disallow:\s*\//i.test(robotsText)) fail('production robots.txt must not disallow the whole site.');
}

// OG 图检查：统一社交图必须存在且尺寸符合 1200x630
if (!exists('public/og/default-og.png')) {
  fail('public/og/default-og.png is missing.');
} else {
  const ogSize = readPngSize('public/og/default-og.png');
  if (!ogSize || ogSize.width !== 1200 || ogSize.height !== 630) {
    fail('public/og/default-og.png must be a 1200x630 PNG.');
  }
}

// 核心插图体积检查：避免重新替换图片后拖慢首屏和移动端体验
if (exists('public/imgs/m3u8_1.webp')) {
  const imageSize = fs.statSync(path.join(rootDir, 'public/imgs/m3u8_1.webp')).size;
  if (imageSize > 200 * 1024) fail('public/imgs/m3u8_1.webp should stay under 200KB.');
}

// _headers 路径检查：避免写入不存在资源或大小写错误路径
if (!exists('public/_headers')) {
  fail('public/_headers is missing.');
} else {
  const headersText = read('public/_headers');
  if (headersText.includes('/Ads.txt')) fail('public/_headers must use /ads.txt, not /Ads.txt.');
  if (headersText.includes('/logo.webp')) fail('public/_headers references missing /logo.webp.');
  if (headersText.includes('/favicon.ico')) fail('public/_headers references missing /favicon.ico.');
  if (!headersText.includes('Referrer-Policy: strict-origin-when-cross-origin')) fail('Referrer-Policy header is missing.');
  if (!headersText.includes('X-Content-Type-Options: nosniff')) fail('X-Content-Type-Options header is missing.');
  if (!headersText.includes('Strict-Transport-Security:')) fail('Strict-Transport-Security header is missing.');
  if (!headersText.includes('Permissions-Policy:')) fail('Permissions-Policy header is missing.');
  if (!headersText.includes('Content-Security-Policy:')) fail('Content-Security-Policy header is missing.');
  if (!headersText.includes("object-src 'none'")) fail('CSP must include object-src none.');
  if (!headersText.includes("base-uri 'self'")) fail('CSP must include base-uri self.');
  if (!headersText.includes("form-action 'self'")) fail('CSP must include form-action self.');

  const routeLines = headersText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('/') && !line.startsWith('/*') && !line.startsWith('/*.html') && !line.startsWith('/_astro/'));

  routeLines.forEach((route) => {
    const normalizedRoute = route.endsWith('/*') ? route.slice(1, -2) : route.slice(1);
    if (!normalizedRoute) return;
    if (!fs.existsSync(path.join(publicDir, normalizedRoute))) {
      fail(`public/_headers references missing public path: ${route}`);
    }
  });
}

// 页面源码约束：页面文件不能直接写原生表单控件或弹窗 API
const pageFiles = listFiles(path.join(srcDir, 'pages'), (file) => file.endsWith('.astro'));
pageFiles.forEach((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(rootDir, file);
  if (/<(?:input|button|select|textarea)\b/.test(source)) {
    fail(`${relativePath} directly uses a native form element. Use shared components instead.`);
  }
  if (/\b(?:alert|confirm|prompt)\s*\(/.test(source)) {
    fail(`${relativePath} uses alert/confirm/prompt.`);
  }
  if (/<svg\b/i.test(source)) {
    fail(`${relativePath} contains inline SVG. Use Icon component instead.`);
  }
});

// 构建产物检查：核心页面必须具备 SEO 元数据，404 不输出 canonical，不索引
const htmlFiles = listFiles(distDir, (file) => file.endsWith('.html'));
const runtimeFiles = listFiles(distDir, (file) => /\.(html|js)$/.test(file));
const runtimeText = runtimeFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const disabledDraftRouteSet = new Set(disabledDraftStreamRoutes);
const pageHtmlFiles = htmlFiles.filter((file) => !path.basename(file).startsWith('google') && !disabledDraftRouteSet.has(routeFromDistHtml(file)));
const validDistRoutes = new Set(pageHtmlFiles.map(routeFromDistHtml));
// 英文页面允许出现的非英文语言切换标签；除此之外仍视为可见中文泄漏
const allowedNonEnglishLanguageSwitchLabels = ['中文'];
const noAdsRoutes = new Set([
  '/404',
  '/about',
  '/contact',
  '/embed/dash',
  '/embed/m3u8',
  '/embed/mp4',
  '/privacy-policy',
  '/terms',
  '/playback-policy',
  '/zh/about',
  '/zh/contact',
  '/zh/faq',
  '/zh/privacy-policy',
  '/zh/terms',
  '/zh/playback-policy',
]);
const noindexRoutes = new Set([
  '/404',
  '/embed/dash',
  '/embed/m3u8',
  '/embed/mp4',
]);

if (redirectsText) {
  [...validDistRoutes]
    .filter((route) => route !== '/' && route !== '/404')
    .sort()
    .forEach((route) => {
      const rule = `${route}/ ${route} 301`;
      if (!redirectsText.includes(rule)) fail(`public/_redirects is missing trailing-slash normalization rule: ${rule}`);
    });
}

const guideArticlePages = pageHtmlFiles.filter((file) => {
  const route = routeFromDistHtml(file);
  return route.startsWith('/guides/') && route !== '/guides';
});
if (guideArticlePages.length < 6) fail(`Guide article count is too low: ${guideArticlePages.length}. Keep at least 6 guide pages before AdSense review.`);

// Guide 日期检查：日期只代表内容发布/实质修改，不应因构建、提交或格式调整批量刷新
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());
const guideModifiedDates = guideArticles.map((article) => article.dateModified);
const uniqueGuideModifiedDates = new Set(guideModifiedDates);
guideArticles.forEach((article) => {
  if (!isValidIsoDate(article.datePublished)) fail(`${article.slug} has an invalid datePublished.`);
  if (!isValidIsoDate(article.dateModified)) fail(`${article.slug} has an invalid dateModified.`);
  if (article.datePublished > today) fail(`${article.slug} datePublished must not be in the future.`);
  if (article.dateModified > today) fail(`${article.slug} dateModified must not be in the future.`);
  if (article.dateModified < article.datePublished) fail(`${article.slug} dateModified must not be earlier than datePublished.`);
});
if (guideArticles.length >= 6 && uniqueGuideModifiedDates.size < 3) {
  fail('Guide dateModified values look batch-updated. Only update dateModified after substantive article changes.');
}

if (exists('src/config/faqPage.js')) {
  const faqSource = read('src/config/faqPage.js');
  const faqQuestionCount = (faqSource.match(/question:\s*'/g) || []).length;
  if (faqQuestionCount < 20) fail(`FAQ page item count is too low: ${faqQuestionCount}. Keep at least 20 substantial FAQ items.`);
} else {
  fail('src/config/faqPage.js is missing.');
}

if (exists('src/components/PlayerShell.astro')) {
  const playerShellSource = read('src/components/PlayerShell.astro');
  if (!playerShellSource.includes('hasSensitiveUrlParams')) fail('PlayerShell must filter signed or tokenized URLs before sessionStorage writes.');
  if (/localStorage\.(?:getItem|setItem|removeItem)\(\s*playerUrlStorageKey/.test(playerShellSource)) {
    fail('Player URL storage must not use localStorage.');
  }
  if (/adsbygoogle|data-ad-slot|pagead2\.googlesyndication\.com/i.test(playerShellSource)) {
    fail('PlayerShell must not contain ad slots or AdSense code near player controls.');
  }
}

if (exists('src/components/FaqAccordion.astro')) {
  const faqAccordionSource = read('src/components/FaqAccordion.astro');
  if (faqAccordionSource.includes('-mobile-content-') || faqAccordionSource.includes('-desktop-content-')) {
    fail('FaqAccordion must render each FAQ item once, not separate mobile and desktop copies.');
  }
}

if (exists('src/components/Header.astro')) {
  const headerSource = read('src/components/Header.astro');
  if (headerSource.includes('mobile-nav-menu') || headerSource.includes('data-desktop-dropdown')) {
    fail('Header must use a single primary navigation DOM instead of separate mobile and desktop nav copies.');
  }
}

if (exists('public/sitemap.xml')) {
  const sitemapText = read('public/sitemap.xml');
  if (/https:\/\/metistools\.com\/blog(?:\/|<)/.test(sitemapText)) fail('sitemap.xml must not include /blog while Blog is disabled.');

  const sitemapEntries = [...sitemapText.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  const sitemapUrls = sitemapEntries
    .map((entry) => entry.match(/<loc>https:\/\/metistools\.com(\/[^<]*)<\/loc>/)?.[1])
    .filter(Boolean)
    .sort();
  const indexableDistRoutes = pageHtmlFiles
    .map(routeFromDistHtml)
    .filter((route) => !noindexRoutes.has(route))
    .sort();
  const missingRoutes = indexableDistRoutes.filter((route) => !sitemapUrls.includes(route));
  const staleRoutes = sitemapUrls.filter((route) => !indexableDistRoutes.includes(route));

  if (missingRoutes.length > 0) fail(`sitemap.xml is missing routes: ${missingRoutes.join(', ')}`);
  if (staleRoutes.length > 0) fail(`sitemap.xml includes missing routes: ${staleRoutes.join(', ')}`);
  sitemapEntries.forEach((entry) => {
    const loc = entry.match(/<loc>([^<]+)<\/loc>/)?.[1] || 'unknown URL';
    const locPath = loc.replace('https://metistools.com', '');
    if (locPath !== '/' && locPath.endsWith('/')) fail(`sitemap.xml URL must not use a trailing slash: ${loc}`);
    if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(entry)) fail(`sitemap.xml entry is missing valid lastmod: ${loc}`);
    if (!/<changefreq>[^<]+<\/changefreq>/.test(entry)) fail(`sitemap.xml entry is missing changefreq: ${loc}`);
  });
} else {
  fail('public/sitemap.xml is missing.');
}

if (runtimeText.includes('?url=')) {
  fail('dist runtime still contains ?url=. User video URLs must not be written into page URLs.');
}

pageHtmlFiles.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(distDir, file).replaceAll(path.sep, '/');
  const is404 = relativePath === '404.html';
  const route = routeFromDistHtml(file);
  const isChinesePage = route.startsWith('/zh/');
  const isNoindexPage = noindexRoutes.has(route);
  const visibleText = stripNonVisibleHtml(html);
  const hasAdSenseScript = /<script\b[^>]+pagead2\.googlesyndication\.com/i.test(html);

  // 英文页面仍禁止可见中文；中文目录页面允许中文内容，避免多语言上线后误报
  const visibleTextForLanguageCheck = allowedNonEnglishLanguageSwitchLabels.reduce(
    (text, label) => text.replaceAll(label, ''),
    visibleText,
  );
  if (!isChinesePage && /[一-龥]/.test(visibleTextForLanguageCheck)) {
    fail(`${relativePath} contains visible Chinese text outside /zh/.`);
  }

  const internalLinks = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/'))
    .map(stripHashAndQuery)
    .filter((href) => href && !href.startsWith('/imgs/') && !href.startsWith('/logo/') && !href.startsWith('/og/'));
  internalLinks.forEach((href) => {
    if (href !== '/' && href.endsWith('/')) fail(`${relativePath} links to a trailing-slash internal page: ${href}`);
    if (!validDistRoutes.has(href)) fail(`${relativePath} links to a missing internal page: ${href}`);
  });

  if (noAdsRoutes.has(route) && hasAdSenseScript) {
    fail(`${relativePath} must not load AdSense.`);
  }
  if (['/m3u8-player', '/mp4-player', '/dash-player'].includes(route)) {
    if (/<ins\b[^>]*adsbygoogle/i.test(html) || /\bdata-ad-slot=/i.test(html) || /adsbygoogle\.push/i.test(html)) {
      fail(`${relativePath} must not contain tool-page ad slots before AdSense review.`);
    }
  }
  if (/\b(?:Leaderboard|Content Middle|Footer Banner|Advertisement placeholder|Ad placeholder|fake ad)\b/i.test(visibleText)) {
    fail(`${relativePath} contains visible fake ad placeholder text.`);
  }
  if (/\b728\s*(?:x|×)\s*90\b/i.test(visibleText)) {
    fail(`${relativePath} contains visible ad-size placeholder text.`);
  }

  if (getTagCount(html, /<title\b/gi) !== 1) fail(`${relativePath} must contain exactly one title tag.`);
  if (getTagCount(html, /<h1\b/gi) !== 1) fail(`${relativePath} must contain exactly one H1.`);
  if (!/<meta name="description" content="[^"]+"/i.test(html)) fail(`${relativePath} is missing meta description.`);
  if (/<meta name="keywords"/i.test(html)) fail(`${relativePath} must not output meta keywords.`);
  if (!/<meta property="og:image" content="https:\/\/metistools\.com\/og\/default-og\.png"/i.test(html)) fail(`${relativePath} must use the default OG image.`);
  if (!/<meta property="og:image:width" content="1200"/i.test(html)) fail(`${relativePath} is missing og:image:width.`);
  if (!/<meta property="og:image:height" content="630"/i.test(html)) fail(`${relativePath} is missing og:image:height.`);
  if (!/<meta name="twitter:image" content="https:\/\/metistools\.com\/og\/default-og\.png"/i.test(html)) fail(`${relativePath} is missing Twitter image.`);

  if (isNoindexPage) {
    const expectedRobots = is404 ? 'noindex, follow' : 'noindex, nofollow';
    if (!new RegExp(`<meta name="robots" content="${expectedRobots}"`, 'i').test(html)) {
      fail(`${relativePath} must use ${expectedRobots}.`);
    }
    if (/<link rel="canonical"/i.test(html)) fail(`${relativePath} must not output canonical.`);
  } else {
    const canonicalMatch = html.match(/<link rel="canonical" href="(https:\/\/metistools\.com\/?[^"]*)"/i);
    if (!canonicalMatch) {
      fail(`${relativePath} is missing canonical.`);
    } else {
      const expectedCanonical = `https://metistools.com${route === '/' ? '/' : route}`;
      if (canonicalMatch[1] !== expectedCanonical) fail(`${relativePath} canonical must be ${expectedCanonical}.`);
      if (route !== '/' && canonicalMatch[1].endsWith('/')) fail(`${relativePath} canonical must not use a trailing slash.`);
    }
    if (!/<meta name="robots" content="index, follow"/i.test(html)) fail(`${relativePath} must be index, follow.`);
  }
});

const aboutFile = pageHtmlFiles.find((file) => routeFromDistHtml(file) === '/about');
const aboutHtml = aboutFile ? fs.readFileSync(aboutFile, 'utf8') : '';
if (!aboutHtml.includes('https://github.com/flbdennis/player-tools')) fail('About page must link to the GitHub repository for transparency.');

const privacyFile = pageHtmlFiles.find((file) => routeFromDistHtml(file) === '/privacy-policy');
const privacyHtml = privacyFile ? fs.readFileSync(privacyFile, 'utf8') : '';
if (!privacyHtml.includes('Do Not Sell') || !privacyHtml.includes('Global Privacy Control') || !privacyHtml.includes('children under 13')) {
  fail('Privacy Policy must include US privacy choices, Global Privacy Control and children policy language.');
}

guideArticlePages.forEach((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(distDir, file).replaceAll(path.sep, '/');
  if (!/<figure\b/i.test(html) || !/src="\/imgs\/[^"]+\.webp"/i.test(html)) {
    fail(`${relativePath} must include a guide image from public/imgs.`);
  }
});

// Google tag 顺序检查：Consent Mode 默认状态必须早于 GA 和 AdSense 脚本
const indexHtml = exists('dist/index.html') ? read('dist/index.html') : '';
const consentIndex = indexHtml.indexOf("window.gtag('consent', 'default'");
const gaIndex = indexHtml.indexOf('https://www.googletagmanager.com/gtag/js');
const adsenseIndex = indexHtml.indexOf('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
if (consentIndex === -1 || gaIndex === -1 || adsenseIndex === -1) {
  fail('Google Consent Mode, GA, or AdSense script is missing from dist/index.html.');
} else {
  if (consentIndex > gaIndex || consentIndex > adsenseIndex) {
    fail('Consent Mode default state must be set before GA and AdSense scripts.');
  }
}
if (!indexHtml.includes("window.gtag('set', 'ads_data_redaction', true)")) fail('ads_data_redaction must be enabled.');
if (!indexHtml.includes('page_location: sanitizedPageLocation')) fail('GA page_location must use sanitizedPageLocation.');
if (!indexHtml.includes('https://fundingchoicesmessages.google.com')) fail('Funding Choices preconnect is missing.');
if (!indexHtml.includes('sameAs') || !indexHtml.includes('https://github.com/flbdennis/player-tools')) fail('Organization JSON-LD must include GitHub sameAs.');
if (runtimeText.includes('metistoolsCurrentUrl')) fail('runtime must not expose full video URLs on window.metistoolsCurrentUrl.');
if (runtimeText.includes('detail:{url') || runtimeText.includes('detail: { url')) fail('runtime must not dispatch full video URLs in CustomEvent detail.');
if (runtimeText.includes('detectUrlType(')) fail('runtime references removed detectUrlType helper.');
if (/text-\[(?:8|8\.5|9|10|10\.5|11|11\.5)px\]/.test(runtimeText)) fail('runtime contains explicit text size below 12px.');
if (!runtimeText.includes('featureList') || !runtimeText.includes('screenshot')) fail('Tool WebApplication JSON-LD must include featureList and screenshot.');

if (failures.length > 0) {
  console.error('Production checks failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Production checks passed for ${pageHtmlFiles.length} HTML pages.`);
