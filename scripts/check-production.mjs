// 生产发布检查脚本 - 使用 Node 原生能力检查 Ads 审核前最关键的工程与 SEO 风险
import fs from 'node:fs';
import path from 'node:path';

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
  if (relativePath === '404.html') return '/404/';
  return `/${relativePath.replace(/index\.html$/, '')}`;
}

function readPngSize(relativePath) {
  const buffer = fs.readFileSync(path.join(rootDir, relativePath));
  if (buffer.length < 24 || buffer.toString('ascii', 1, 4) !== 'PNG') return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
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
const pageHtmlFiles = htmlFiles.filter((file) => !path.basename(file).startsWith('google'));
const noAdsPages = new Set([
  '404.html',
  'about/index.html',
  'contact/index.html',
  'privacy-policy/index.html',
  'terms/index.html',
  'playback-policy/index.html',
]);

const guideArticlePages = pageHtmlFiles.filter((file) => {
  const relativePath = path.relative(distDir, file).replaceAll(path.sep, '/');
  return relativePath.startsWith('guides/') && relativePath !== 'guides/index.html';
});
if (guideArticlePages.length < 6) fail(`Guide article count is too low: ${guideArticlePages.length}. Keep at least 6 guide pages before AdSense review.`);

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
}

if (exists('public/sitemap.xml')) {
  const sitemapText = read('public/sitemap.xml');
  if (sitemapText.includes('/blog/')) fail('sitemap.xml must not include /blog/ while Blog is disabled.');

  const sitemapUrls = [...sitemapText.matchAll(/<loc>https:\/\/metistools\.com(\/[^<]*)<\/loc>/g)]
    .map((match) => match[1])
    .sort();
  const indexableDistRoutes = pageHtmlFiles
    .map(routeFromDistHtml)
    .filter((route) => route !== '/404/')
    .sort();
  const missingRoutes = indexableDistRoutes.filter((route) => !sitemapUrls.includes(route));
  const staleRoutes = sitemapUrls.filter((route) => !indexableDistRoutes.includes(route));

  if (missingRoutes.length > 0) fail(`sitemap.xml is missing routes: ${missingRoutes.join(', ')}`);
  if (staleRoutes.length > 0) fail(`sitemap.xml includes missing routes: ${staleRoutes.join(', ')}`);
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
  const visibleText = stripNonVisibleHtml(html);
  const hasAdSenseScript = html.includes('pagead2.googlesyndication.com');

  if (/[一-龥]/.test(visibleText)) {
    fail(`${relativePath} contains visible Chinese text.`);
  }

  if (noAdsPages.has(relativePath) && hasAdSenseScript) {
    fail(`${relativePath} must not load AdSense.`);
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

  if (is404) {
    if (!/<meta name="robots" content="noindex, follow"/i.test(html)) fail('404.html must use noindex, follow.');
    if (/<link rel="canonical"/i.test(html)) fail('404.html must not output canonical.');
  } else {
    if (!/<link rel="canonical" href="https:\/\/metistools\.com\//i.test(html)) fail(`${relativePath} is missing canonical.`);
    if (!/<meta name="robots" content="index, follow"/i.test(html)) fail(`${relativePath} must be index, follow.`);
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
if (runtimeText.includes('metistoolsCurrentUrl')) fail('runtime must not expose full video URLs on window.metistoolsCurrentUrl.');
if (runtimeText.includes('detail:{url') || runtimeText.includes('detail: { url')) fail('runtime must not dispatch full video URLs in CustomEvent detail.');
if (/text-\[(?:8|8\.5|9|10|10\.5|11|11\.5)px\]/.test(runtimeText)) fail('runtime contains explicit text size below 12px.');

if (failures.length > 0) {
  console.error('Production checks failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Production checks passed for ${pageHtmlFiles.length} HTML pages.`);
