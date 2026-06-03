// 站点全局配置 - 统一管理域名、品牌、联系方式、统计、广告和默认 SEO，避免组件中硬编码站点信息
export const site = {
  // 站点品牌名称 - Header、Footer、SEO 和结构化数据会复用
  name: 'MetisTools',
  // 线上正式域名 - canonical、结构化数据、分享链接和 embed 代码会基于该域名生成
  domain: 'https://metistools.com',
  // 官方联系邮箱 - Footer、联系入口和审核相关页面使用
  email: 'flbdennis.fan@gmail.com',
  // GitHub 仓库地址 - About、结构化数据和透明度说明复用
  githubUrl: 'https://github.com/flbdennis/player-tools',
  // 维护者英文名 - 仅用于 About 和结构化数据；如需更换，统一改这里
  maintainerName: 'Dennis Fan',
  // 项目公开启动日期 - 用于 Organization 结构化数据和透明度说明
  foundingDate: '2026-06-02',
  // 当前页面语言 - SEO 和结构化数据统一使用
  language: 'en',
  // Google Analytics ID - BaseLayout 中加载官方统计脚本时使用
  googleAnalyticsId: 'G-87VGYW1H47',
  // Google AdSense 发布商 ID - BaseLayout 中接入官方 AdSense 脚本时使用
  googleAdsenseId: 'ca-pub-3912115209665374',
  // 站点文字 Logo 路径 - Header/Footer 统一使用 public/logo 中的既有素材
  logo: '/logo/logo_text.svg',
  // favicon 路径 - 浏览器标签页和搜索结果图标使用
  favicon: '/logo/favicon.ico',
};

// 全局 SEO 默认配置 - 当页面没有传入独立 SEO 时作为兜底内容
export const defaultSeo = {
  // SEO 标题模板 - 页面标题会被格式化为“页面名 - MetisTools”
  titleTemplate: '%s - MetisTools',
  // 默认站点标题 - 首页或兜底 SEO 使用
  defaultTitle: 'Free Online Video Player for M3U8, MP4 and DASH - MetisTools',
  // 默认站点描述 - Open Graph、Twitter Card 和普通 meta description 兜底使用
  description:
    'Use free online video player tools to test public or authorized M3U8, MP4 and DASH links in your browser. Review playback events and common loading issues.',
  // 默认社交分享图 - 使用既有首页插图和文字 Logo 合成，避免平台抓取 SVG logo 失败
  ogImage: '/og/default-og.png',
  // 社交平台推荐的大图比例 - SEO 组件会输出到 Open Graph metadata
  ogImageWidth: 1200,
  ogImageHeight: 630,
  // 默认关键词 - 帮助统一描述站点主题，不作为唯一 SEO 依赖
  keywords: ['online video player', 'M3U8 player', 'HLS stream test', 'MP4 player online', 'MPEG-DASH player', 'MPD test online'],
  // 默认作者 - SEO 元信息和结构化数据兜底使用
  author: 'MetisTools',
  // Twitter 账号占位 - 当前没有官方账号，保持空字符串避免输出假社交账号
  twitterHandle: '',
};
