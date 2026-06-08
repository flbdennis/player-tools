// AI 项目结构速览 - 给 Codex/AI 快速定位文件用，保持短句和路径，不承载业务文案
// 更新规则：新增稳定模块或关键目录时同步维护；临时输出、dist、node_modules、output 不写入
export const aiProjectStructure = {
  stack: 'Astro + Tailwind CSS + JavaScript; no TypeScript',
  roots: {
    pages: 'src/pages: static routes; tools are direct pages; draft high-risk tools under src/pages/tools',
    layouts: 'src/layouts: BaseLayout, EmbedLayout, GuideArticleLayout',
    components: 'src/components: shared UI, forms, player/analyzer shells, log, tabs, tooltip',
    config: 'src/config: site/nav/tools/home/player/analyzer/SEO/page copy/data',
    scripts: 'src/scripts: browser-only client logic; stream-analyzer.js handles Analyzer',
    public: 'public: imgs, logo, og, robots, sitemap, redirects, ads.txt',
    checks: 'scripts: sitemap generation and production checks',
  },
  keyFiles: {
    site: 'src/config/site.js',
    navigation: 'src/config/nav.js',
    toolIndex: 'src/config/tools.js',
    streamFeatureFlags: 'src/config/features.js',
    streamToolRoutes: 'src/config/streamTools.js',
    analyzerCopy: 'src/config/analyzer.js',
    analyzerPage: 'src/pages/m3u8-analyzer.astro',
    analyzerUi: 'src/components/AnalyzerShell.astro',
    analyzerClient: 'src/scripts/stream-analyzer.js',
    playerUi: 'src/components/PlayerShell.astro',
    tabs: 'src/components/PlayerTabs.astro',
    log: 'src/components/PlaybackLog.astro',
    tooltip: 'src/components/Tooltip.astro',
    forms: 'src/components/FormField.astro + TextInput/Select/Textarea/Checkbox/Radio',
    icons: 'src/components/Icon.astro',
  },
  routeMap: {
    lowRiskTools: '/m3u8-player, /mp4-player, /dash-player, /m3u8-analyzer',
    draftHighRiskTools: '/tools/* blank draft routes; hidden by feature flags and excluded from sitemap/checks',
    trustPages: '/about, /contact, /privacy-policy, /terms, /playback-policy, /faq',
    guides: '/guides and /guides/*',
    zhScope: '/zh/* existing localized pages; current new tool work stays English unless requested',
  },
};
