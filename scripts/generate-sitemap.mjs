// sitemap 自动生成脚本 - 根据 src/pages 中的真实页面生成 public/sitemap.xml，避免新增或取消页面后漏同步
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const pagesDir = path.join(rootDir, 'src/pages');
const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
const siteDomain = 'https://metistools.com';

const excludedRoutes = new Set(['/404/']);

const priorityByRoute = new Map([
  ['/', '1.0'],
  ['/m3u8-player/', '0.9'],
  ['/mp4-player/', '0.9'],
  ['/dash-player/', '0.9'],
  ['/guides/', '0.7'],
  ['/faq/', '0.7'],
  ['/about/', '0.5'],
  ['/contact/', '0.5'],
  ['/privacy-policy/', '0.4'],
  ['/terms/', '0.4'],
  ['/playback-policy/', '0.4'],
]);

function listPageFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listPageFiles(fullPath));
    } else if (entry.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }
  return files;
}

function routeFromFile(file) {
  const relativePath = path.relative(pagesDir, file).replaceAll(path.sep, '/');
  if (relativePath === 'index.astro') return '/';
  const route = relativePath.replace(/(?:\/index)?\.astro$/, '/');
  return `/${route}`;
}

function getPriority(route) {
  if (priorityByRoute.has(route)) return priorityByRoute.get(route);
  if (route.startsWith('/guides/')) return '0.7';
  return '0.6';
}

const routes = listPageFiles(pagesDir)
  .map(routeFromFile)
  .filter((route) => !excludedRoutes.has(route))
  .sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.flatMap((route) => [
    '  <url>',
    `    <loc>${siteDomain}${route}</loc>`,
    `    <priority>${getPriority(route)}</priority>`,
    '  </url>',
  ]),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(sitemapPath, xml);
console.log(`Generated sitemap.xml with ${routes.length} URLs.`);
