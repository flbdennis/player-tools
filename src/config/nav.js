import { featureFlags } from './features.js';
import { analyzerTool, draftStreamTools } from './streamTools.js';

// Header / Footer 导航配置 - 全站导航入口集中管理，避免不同组件出现不一致链接
const publicToolLinks = [
  // M3U8 工具页链接
  { label: 'M3U8 Player', href: '/m3u8-player' },
  // MP4 工具页链接
  { label: 'MP4 Player', href: '/mp4-player' },
  // DASH 工具页链接
  { label: 'DASH Player', href: '/dash-player' },
  // Analyzer 为低风险工具，和播放器工具平级展示
  ...(featureFlags.enableAnalyzerTools ? [{ label: analyzerTool.name, href: analyzerTool.href }] : []),
  // 高风险草稿路由默认不展示；只有后续明确打开功能开关才进入导航
  ...(featureFlags.showStreamToolDraftsInNav ? draftStreamTools.map((tool) => ({ label: tool.name, href: tool.href })) : []),
];

export const headerNav = [
  // 工具下拉入口 - 当前没有工具分类页，子项直接指向真实工具页面
  {
    // 顶部导航显示文本
    label: 'Tools',
    // 桌面下拉父级 href - 当前只作为兜底锚点，不作为主要访问路径
    href: '#tools',
    // 工具下拉子项 - 必须全部是真实可访问页面
    children: publicToolLinks,
  },
  // 指南页入口 - 指向真实指南页面或站点指南首页
  { label: 'Guides', href: '/guides' },
  // 关于页入口 - AdSense 审核需要清晰站点说明
  { label: 'About', href: '/about' },
  // 联系页入口 - AdSense 审核需要清晰联系方式
  { label: 'Contact', href: '/contact' },
];

// Footer 导航分组 - Footer 按栏目渲染，移动端会按分组布局
export const footerNav = {
  // 工具栏目 - 与 Header 工具入口保持一致
  tools: {
    // Footer 栏目标题
    title: 'Tools',
    // Footer 工具链接列表 - 只放真实工具页面，避免死链
    links: publicToolLinks,
  },
  // 指南栏目 - 汇总用户帮助和播放政策内容
  guides: {
    // Footer 栏目标题
    title: 'Guides',
    // Footer 指南链接列表 - 面向新用户和审核可读性
    links: [
      // 使用指南页面链接
      { label: 'Video Testing Guide', href: '/guides' },
      // 常见问题页面链接
      { label: 'FAQ', href: '/faq' },
      // 播放政策页面链接
      { label: 'Playback Policy', href: '/playback-policy' },
    ],
  },
  // 关于栏目 - 汇总站点说明和合规页面
  about: {
    // Footer 栏目标题
    title: 'About',
    // Footer 关于链接列表 - 覆盖 AdSense 审核需要的基础页面
    links: [
      // 关于页面链接
      { label: 'About', href: '/about' },
      // 联系页面链接
      { label: 'Contact', href: '/contact' },
      // 隐私政策页面链接
      { label: 'Privacy Policy', href: '/privacy-policy' },
      // 美国州隐私选择说明入口 - 指向隐私页内真实锚点，避免创建薄页面
      { label: 'Do Not Sell or Share', href: '/privacy-policy#do-not-sell-or-share' },
      // 服务条款页面链接
      { label: 'Terms', href: '/terms' },
    ],
  },
};

// 多语言导航配置 - Header/Footer 按当前路径选择，不新增组件，后续日文/繁中继续在这里扩展
export const localizedNavigation = {
  en: {
    homeHref: '/',
    languageLabel: 'English',
    languageMenuLabel: 'Choose language',
    homeAriaLabel: 'MetisTools home',
    primaryNavLabel: 'Primary navigation',
    mobileMenuAriaLabel: 'Toggle menu',
    emailAriaLabel: 'Email MetisTools',
    headerNav,
    footerDescription:
      'Free browser-based video player tools for testing public or authorized M3U8, MP4 and MPEG-DASH links.',
    contactTitle: 'Contact',
    contactPrompt: 'Questions or suggestions?',
    copyrightText: '© 2026 MetisTools. All rights reserved.',
    footerNav,
  },
  zh: {
    // 当前中文版本尚未做中文首页，中文 logo 返回已汉化的 M3U8 工具页，避免跳到英文首页
    homeHref: '/zh/m3u8-player',
    languageLabel: '中文',
    languageMenuLabel: '选择语言',
    homeAriaLabel: 'MetisTools 中文版首页',
    primaryNavLabel: '主导航',
    mobileMenuAriaLabel: '打开或关闭菜单',
    emailAriaLabel: '通过邮件联系 MetisTools',
    headerNav: [
      {
        label: '工具',
        href: '/zh/m3u8-player',
        children: [
          { label: 'M3U8在线播放器', href: '/zh/m3u8-player' },
        ],
      },
      { label: '指南', href: '/zh/guides' },
      { label: '常见问题', href: '/zh/faq' },
      { label: '关于', href: '/zh/about' },
      { label: '联系', href: '/zh/contact' },
    ],
    footerDescription:
      '用于测试公开或已授权 M3U8/HLS 视频流的免费浏览器在线播放工具。',
    contactTitle: '联系',
    contactPrompt: '有问题或建议？',
    copyrightText: '© 2026 MetisTools. 版权所有。',
    footerNav: {
      tools: {
        title: '工具',
        links: [
          { label: 'M3U8在线播放器', href: '/zh/m3u8-player' },
        ],
      },
      guides: {
        title: '指南',
        links: [
          { label: 'M3U8测试指南', href: '/zh/guides' },
          { label: 'M3U8跨域错误', href: '/zh/guides/m3u8-cors-error' },
          { label: '在线测试M3U8', href: '/zh/guides/how-to-test-m3u8-stream-online' },
          { label: '播放政策', href: '/zh/playback-policy' },
        ],
      },
      about: {
        title: '关于',
        links: [
          { label: '关于', href: '/zh/about' },
          { label: '联系', href: '/zh/contact' },
          { label: '隐私政策', href: '/zh/privacy-policy' },
          { label: '服务条款', href: '/zh/terms' },
          { label: '常见问题', href: '/zh/faq' },
        ],
      },
    },
  },
};

// 已汉化页面映射 - 语言切换只在有对应翻译的页面展示，避免跳到未汉化页面
export const localizedPathPairs = [
  ['/m3u8-player', '/zh/m3u8-player'],
  ['/guides', '/zh/guides'],
  ['/guides/fix-m3u8-cors-error', '/zh/guides/m3u8-cors-error'],
  ['/guides/how-to-test-m3u8-stream-online', '/zh/guides/how-to-test-m3u8-stream-online'],
  ['/faq', '/zh/faq'],
  ['/about', '/zh/about'],
  ['/contact', '/zh/contact'],
  ['/privacy-policy', '/zh/privacy-policy'],
  ['/terms', '/zh/terms'],
  ['/playback-policy', '/zh/playback-policy'],
];

export function normalizeLocalePath(pathname = '/') {
  let normalizedPath = String(pathname || '/').split(/[?#]/)[0] || '/';
  normalizedPath = normalizedPath.replace(/\/index\.html$/, '') || '/';
  normalizedPath = normalizedPath.replace(/\.html$/, '');
  normalizedPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '');
  return normalizedPath || '/';
}

export function getLocaleFromPath(pathname = '/') {
  const normalizedPath = normalizeLocalePath(pathname);
  return normalizedPath === '/zh' || normalizedPath.startsWith('/zh/') ? 'zh' : 'en';
}

export function getNavigationForPath(pathname = '/') {
  return localizedNavigation[getLocaleFromPath(pathname)] || localizedNavigation.en;
}

export function getLanguageLinks(pathname = '/') {
  const normalizedPath = normalizeLocalePath(pathname);
  const pair = localizedPathPairs.find(([enPath, zhPath]) => enPath === normalizedPath || zhPath === normalizedPath);
  if (!pair) return [];

  const [enPath, zhPath] = pair;
  const currentLocale = getLocaleFromPath(normalizedPath);
  return currentLocale === 'zh'
    ? [{ label: 'English', href: enPath, lang: 'en' }]
    : [{ label: '中文', href: zhPath, lang: 'zh-CN' }];
}

export function getLanguageMenu(pathname = '/') {
  const normalizedPath = normalizeLocalePath(pathname);
  const currentLocale = getLocaleFromPath(normalizedPath);
  const currentNavigation = localizedNavigation[currentLocale] || localizedNavigation.en;

  return {
    label: currentNavigation.languageLabel || currentLocale,
    ariaLabel: currentNavigation.languageMenuLabel || 'Choose language',
    options: getLanguageLinks(normalizedPath),
  };
}
