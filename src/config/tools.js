// 工具页面配置 - 首页工具卡片、导航下拉和工具页 Tab 统一读取这些工具数据
export const tools = [
  // M3U8/HLS 播放器入口配置
  {
    // 工具唯一 ID - 用于匹配颜色、激活态和工具类型判断
    id: 'm3u8',
    // 工具完整名称 - 首页卡片标题和 SEO 相关文案可复用
    name: 'M3U8 Player',
    // 工具短名称 - 导航、Tab 或紧凑 UI 中使用
    shortName: 'M3U8 Player',
    // 工具简短描述 - 首页工具卡片正文使用
    description:
      'Test HLS playlists and review common M3U8 loading issues.',
    // 工具页面路由 - 所有入口必须跳转真实页面，避免死链
    href: '/m3u8-player',
    // 工具图标名称 - 由 Icon.astro 统一渲染，不直接引入图标库
    icon: 'Play',
  },
  // MP4 播放器入口配置
  {
    // 工具唯一 ID - 用于匹配颜色、激活态和工具类型判断
    id: 'mp4',
    // 工具完整名称 - 首页卡片标题和 SEO 相关文案可复用
    name: 'MP4 Player Online',
    // 工具短名称 - 导航、Tab 或紧凑 UI 中使用
    shortName: 'MP4 Player',
    // 工具简短描述 - 首页工具卡片正文使用
    description:
      'Play public MP4 URLs and check MIME type, codec and server limits.',
    // 工具页面路由 - 所有入口必须跳转真实页面，避免死链
    href: '/mp4-player',
    // 工具图标名称 - 由 Icon.astro 统一渲染，不直接引入图标库
    icon: 'Play',
  },
  // MPEG-DASH 播放器入口配置
  {
    // 工具唯一 ID - 用于匹配颜色、激活态和工具类型判断
    id: 'dash',
    // 工具完整名称 - 首页卡片标题和 SEO 相关文案可复用
    name: 'MPEG-DASH Player',
    // 工具短名称 - 导航、Tab 或紧凑 UI 中使用
    shortName: 'DASH Player',
    // 工具简短描述 - 首页工具卡片正文使用
    description:
      'Test MPD manifests and review DASH playback problems.',
    // 工具页面路由 - 所有入口必须跳转真实页面，避免死链
    href: '/dash-player',
    // 工具图标名称 - 由 Icon.astro 统一渲染，不直接引入图标库
    icon: 'Play',
  },
];
