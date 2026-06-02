// Header / Footer 导航配置 - 全站导航入口集中管理，避免不同组件出现不一致链接
export const headerNav = [
  // 工具下拉入口 - 当前没有工具分类页，子项直接指向真实工具页面
  {
    // 顶部导航显示文本
    label: 'Tools',
    // 桌面下拉父级 href - 当前只作为兜底锚点，不作为主要访问路径
    href: '#tools',
    // 工具下拉子项 - 必须全部是真实可访问页面
    children: [
      // M3U8 工具页链接
      { label: 'M3U8 Player', href: '/m3u8-player/' },
      // MP4 工具页链接
      { label: 'MP4 Player', href: '/mp4-player/' },
      // DASH 工具页链接
      { label: 'DASH Player', href: '/dash-player/' },
    ],
  },
  // 指南页入口 - 指向真实指南页面或站点指南首页
  { label: 'Guides', href: '/guides/' },
  // 关于页入口 - AdSense 审核需要清晰站点说明
  { label: 'About', href: '/about/' },
  // 联系页入口 - AdSense 审核需要清晰联系方式
  { label: 'Contact', href: '/contact/' },
];

// Footer 导航分组 - Footer 按栏目渲染，移动端会按分组布局
export const footerNav = {
  // 工具栏目 - 与 Header 工具入口保持一致
  tools: {
    // Footer 栏目标题
    title: 'Tools',
    // Footer 工具链接列表 - 只放真实工具页面，避免死链
    links: [
      // M3U8 工具页链接
      { label: 'M3U8 Player', href: '/m3u8-player/' },
      // MP4 工具页链接
      { label: 'MP4 Player', href: '/mp4-player/' },
      // DASH 工具页链接
      { label: 'DASH Player', href: '/dash-player/' },
    ],
  },
  // 指南栏目 - 汇总用户帮助和播放政策内容
  guides: {
    // Footer 栏目标题
    title: 'Guides',
    // Footer 指南链接列表 - 面向新用户和审核可读性
    links: [
      // 使用指南页面链接
      { label: 'Video Testing Guide', href: '/guides/' },
      // 常见问题页面链接
      { label: 'FAQ', href: '/faq/' },
      // 播放政策页面链接
      { label: 'Playback Policy', href: '/playback-policy/' },
    ],
  },
  // 关于栏目 - 汇总站点说明和合规页面
  about: {
    // Footer 栏目标题
    title: 'About',
    // Footer 关于链接列表 - 覆盖 AdSense 审核需要的基础页面
    links: [
      // 关于页面链接
      { label: 'About', href: '/about/' },
      // 联系页面链接
      { label: 'Contact', href: '/contact/' },
      // 隐私政策页面链接
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      // 美国州隐私选择说明入口 - 指向隐私页内真实锚点，避免创建薄页面
      { label: 'Do Not Sell or Share', href: '/privacy-policy/#do-not-sell-or-share' },
      // 服务条款页面链接
      { label: 'Terms', href: '/terms/' },
    ],
  },
};
