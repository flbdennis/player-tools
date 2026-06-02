// sitemap 自动生成脚本 - 根据 src/pages 中的真实页面生成 public/sitemap.xml，避免新增或取消页面后漏同步
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { site } from '../src/config/site.js';
import { guideArticles } from '../src/config/guideArticles.js';

const rootDir = process.cwd();
const pagesDir = path.join(rootDir, 'src/pages');
const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
const siteDomain = site.domain;
const guideLastmodByRoute = new Map(
  guideArticles.map((article) => [article.href, article.dateModified])
);

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

function getChangefreq(route) {
  if (route === '/' || route.endsWith('-player/')) return 'weekly';
  if (route.startsWith('/guides/')) return 'monthly';
  return 'monthly';
}

function normalizeDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function getGitLastModified(file) {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return value || '';
  } catch {
    return '';
  }
}

function getLastmod(route, file) {
  if (guideLastmodByRoute.has(route)) return guideLastmodByRoute.get(route);

  const gitLastModified = getGitLastModified(file);
  const fileModified = fs.statSync(file).mtime.toISOString();
  const newest = [gitLastModified, fileModified]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return normalizeDate(newest || fileModified);
}

const routes = listPageFiles(pagesDir)
  .map((file) => ({
    file,
    route: routeFromFile(file),
  }))
  .filter((item) => !excludedRoutes.has(item.route) && !item.route.startsWith('/embed/'))
  .map((item) => ({
    ...item,
    lastmod: getLastmod(item.route, item.file),
    priority: getPriority(item.route),
    changefreq: getChangefreq(item.route),
  }))
  .sort((a, b) => {
    if (a.route === '/') return -1;
    if (b.route === '/') return 1;
    return a.route.localeCompare(b.route);
  });

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.flatMap(({ route, lastmod, priority, changefreq }) => [
    '  <url>',
    `    <loc>${siteDomain}${route}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(sitemapPath, xml);
console.log(`Generated sitemap.xml with ${routes.length} URLs.`);
