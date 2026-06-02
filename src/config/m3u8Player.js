import { playerShared } from './player.js';
// M3U8 播放器页面配置 - 页面文案、SEO、播放器、信息卡片和 FAQ 统一集中管理
// 目的：M3U8 页面只负责组合公共组件，所有可变内容都从该配置读取
export const m3u8PlayerPage = {
  // 页面 SEO 配置 - BaseLayout 和 SEO 组件读取，用于搜索结果和社交分享
  seo: {
    // 页面标题 - 会与 defaultSeo.titleTemplate 组合输出
    title: 'M3U8 Player Online - Free HLS Stream Tester',
    // 页面描述 - 用于 meta description、OG 描述和 Twitter 描述
    description:
      'Play and test public or authorized M3U8/HLS streams online. Preview browser playback, review the Playback Log, and check common CORS, codec, segment, or access issues.',
  },
  // 面包屑配置 - 当前按 SEO 和用户体验要求保留 Home + 当前页，不展示 Tools 中间层
  breadcrumb: [
    // 首页入口 - 面包屑第一项
    { label: 'Home', href: '/' },
    // 当前页面入口 - 面包屑最后一项
    { label: 'M3U8 Player', href: '/m3u8-player/' },
  ],
  // 工具页 Hero 配置 - ToolHero 组件读取标题、描述和插图布局
  hero: {
    // 页面 H1 标题 - 每个页面只能有一个 H1
    title: 'M3U8 Player Online',
    // Hero 描述 - 移动端和桌面端都直接展示，必须保持英文可读
    description:
      'Paste a public or authorized M3U8 link to preview HLS playback, review the Playback Log, and check common browser-side stream issues.',
    // Hero 插图路径 - 只能使用 public/imgs 中已有的 m3u8 素材
    image: '/imgs/m3u8_1.webp',
    // Hero 插图 alt - 描述图片内容，用于可访问性和图片 SEO
    imageAlt: '3D illustration of an HLS and M3U8 online video player',
    // Hero 插图原始宽度 - 用于输出 img width，降低布局抖动
    imageWidth: 1448,
    // Hero 插图原始高度 - 用于输出 img height，降低布局抖动
    imageHeight: 1086,
    // Hero 插图布局 - 每个工具页都可以单独设置移动端和桌面端的基础 CSS 值
    imageLayout: {
      // 移动端插图位置 - 主要避免遮挡标题和描述
      mobile: {
        // 移动端插图显示宽度
        width: '142px',
        // 移动端插图高度，auto 保持原始比例
        height: 'auto',
        // 移动端右侧偏移
        right: '-8px',
        // 移动端底部偏移，让插图轻微压住下方区域
        top: '42px',
        // 移动端底部偏移改为 auto，让插图和文字同属 Hero 视觉区域，避免移动端上下分离过远
        bottom: 'auto',
        // 移动端层级，保证插图在背景上但不压住主要文字
        zIndex: '20',
        // 移动端透明度，提升文字可读性
        opacity: '0.96',
        // 移动端文案卡片右侧预留空间，避免插图遮挡标题和描述
        cardPaddingRight: '118px',
        // 移动端 Hero 总高度，压缩首屏空白
        sectionHeight: '192px',
        // 移动端白色文案卡片最小高度，保证插图和文字视觉上属于同一区块
        cardMinHeight: '156px',
      },
      // 桌面端插图位置 - 用于贴近 UI 设计图中的右上方 3D 插图
      desktop: {
        // 桌面端插图显示宽度
        width: '300px',
        // 桌面端插图高度，auto 保持原始比例
        height: 'auto',
        // 桌面端右侧偏移，可使用负值让插图更靠右
        right: '-18px',
        // 桌面端顶部偏移，可使用负值让插图压住下方卡片
        top: '-24px',
        // 桌面端层级，保证插图能压在播放器卡片上方
        zIndex: '20',
        // 桌面端透明度，保持素材完整显示
        opacity: '1',
      },
    },
  },
  // 工具 Tab 配置 - PlayerTabs 读取并根据 active id 标记当前页面
  tabs: [
    // M3U8 当前页 Tab
    { id: 'm3u8', label: 'M3U8 Player', href: '/m3u8-player/' },
    // MP4 工具页 Tab
    { id: 'mp4', label: 'MP4 Player', href: '/mp4-player/' },
    // DASH 工具页 Tab
    { id: 'dash', label: 'DASH Player', href: '/dash-player/' },
  ],
  // 播放器主卡片配置 - PlayerShell 读取输入、播放、占位和日志文案
  player: {
    // 工具类型 ID - 播放器逻辑用于区分 MP4/M3U8/DASH 类型
    id: 'm3u8',
    // 当前工具页路径 - embed 代码和 direct link 生成使用
    pagePath: '/m3u8-player/',
    // 播放对象名称 - 播放器提示和日志中描述当前内容类型
    playerLabel: 'HLS stream',
    // 默认测试链接 - 页面初始输入框内容，使用公开 HLS 示例流
    defaultUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    // 输入框占位文案 - 当没有 URL 时显示
    inputPlaceholder: 'Paste your M3U8 link here...',
    // 播放按钮文案 - 输入框右侧和播放器触发逻辑共用
    buttonLabel: 'Play',
    // 授权与版权提示 - 必须提醒用户只测试公开或已授权链接
    policyHint: playerShared.policyNotice,
    // 播放器空状态标题 - 未播放时显示在播放器占位层
    emptyTitle: 'Ready to test your HLS stream',
    // 播放器空状态描述 - 指导用户粘贴 M3U8 URL 后点击播放
    emptyDescription: 'Paste an M3U8 URL above and click Play to load it in the browser player.',
    // 播放日志配置 - 用于播放器下方 Playback Log 区域
    playbackLog: {
      // 日志区标题
      title: 'Playback Log',
      // 日志区说明 - 解释日志用于定位播放问题
      description: playerShared.playbackLogDescription,
      // 默认日志行 - 当前为空，避免页面初始展示假日志
      lines: [],
      // 日志操作按钮文案 - PlayerShell 内部按钮读取
      actions: {
        // 开始记录按钮文案
        start: 'Start Log',
        // 暂停记录按钮文案
        pause: 'Pause Log',
        // 清空日志按钮文案
        clear: 'Clear Log',
        // 复制日志按钮文案
        copy: 'Copy Log',
        // 复制成功后的按钮文案
        copied: 'Copied',
      },
    },
  },
  // Embed 区域配置 - EmbedCodeBox 读取当前页面路径和按钮文案
  embed: {
    // 当前工具页路径 - 作为用户查看完整工具页的来源路径
    pagePath: '/m3u8-player/',
    // 专用嵌入页路径 - iframe 分享必须使用 noindex/禁广告的轻量页面
    embedPath: '/embed/m3u8/',
    // Embed 区标题 - 简短说明嵌入能力，详细边界交给问号提示
    title: 'Embed This Player',
    // Embed 区可见短提示 - 保留核心授权边界
    shortNotice: playerShared.embedShortNotice,
    // Embed 区问号提示 - 说明私有/签名 URL 不会被隐藏或代理
    detailNotice: playerShared.embedDetailNotice,
    // 空播放器模式按钮文案
    emptyLabel: 'Empty Player',
    // 带当前 URL 模式按钮文案
    currentUrlLabel: 'With Current URL',
    // 敏感 URL 提醒 - 当前输入包含 token/signature/expires 等参数时显示
    sensitiveNotice: playerShared.embedSensitiveNotice,
    // 当前 URL 缺失提醒 - 用户选择带 URL 模式但输入框无有效 URL 时显示
    missingUrlNotice: playerShared.embedMissingUrlNotice,
    // 复制按钮默认文案
    copyLabel: 'Copy Code',
    // 复制成功后的按钮文案
    copiedLabel: 'Copied',
  },
  // 使用步骤配置 - PlayerGuideSteps 组件读取并按顺序渲染
  guide: {
    // 使用步骤区标题
    title: 'How to Use M3U8 Player',
    // 使用步骤列表 - 每项包含图标、标题和说明
    steps: [
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'Link',
        // 步骤标题 - 第一步粘贴链接
        title: 'Paste an M3U8 link',
        // 步骤描述 - 提醒用户使用公开或授权 URL
        description: 'Paste a public or authorized M3U8 URL into the input box.',
      },
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'CirclePlay',
        // 步骤标题 - 第二步点击播放
        title: 'Click the Play button',
        // 步骤描述 - 说明会加载流并检查浏览器支持
        description: 'Load the stream and check browser playback support.',
      },
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'Settings2',
        // 步骤标题 - 第三步使用播放器控制
        title: 'Use player controls',
        // 步骤描述 - 说明可检查播放、暂停、音量和全屏
        description: 'Check play, pause, volume and fullscreen controls.',
      },
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'Gauge',
        // 步骤标题 - 第四步复查播放问题
        title: 'Review playback issues',
        // 步骤描述 - 说明可排查 URL、CORS、编码和网络问题
        description: 'Identify URL, CORS, codec or network problems.',
      },
    ],
  },
  // 信息卡片配置 - InfoImageCard 组件读取，用三个可见 H2 承载检查项、排障说明和授权边界
  infoCards: [
    {
      // 卡片标题 - 说明该工具实际检查哪些浏览器侧信号
      title: 'What This M3U8 Player Checks',
      // 卡片插图路径 - 使用 public/imgs 中的 M3U8 文件插图
      image: '/imgs/m3u8_2.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D M3U8 playlist file and media segment illustration for HLS testing',
      // 要点列表 - 覆盖工具真实能力，避免把日志说成完整服务端诊断
      bullets: [
        'Checks whether a public or authorized M3U8 playlist can be loaded by the browser.',
        'Uses browser playback events and HLS loading events to show likely playlist, segment, codec or network issues.',
        'Displays Playback Log records so you can compare loading progress, warnings and playback failures.',
      ],
    },
    {
      // 卡片标题 - 说明 M3U8/HLS 常见失败原因
      title: 'Common M3U8 Playback Problems',
      // 卡片插图路径 - 使用在线播放相关插图
      image: '/imgs/m3u8_3.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D online video playback illustration for HLS stream troubleshooting',
      // 要点列表 - 覆盖 CORS、切片、编码和访问权限等高价值排障点
      bullets: [
        'The playlist or media segments may be expired, private, blocked by tokens, geo-restricted or unavailable from your network.',
        'CORS rules can prevent this website from fetching playlists, keys or segment files in the browser.',
        'Invalid playlists, missing segments, unsupported codecs, DRM requirements or slow servers can stop playback.',
      ],
    },
    {
      // 卡片标题 - 明确浏览器工具边界和授权范围
      title: 'Browser and Access Limits',
      // 卡片插图路径 - 使用警告插图
      image: '/imgs/m3u8_4.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D warning illustration for browser playback limits and authorized HLS testing',
      // 要点列表 - 强调不绕过 CORS/DRM/私有访问，降低审核和版权风险
      bullets: [
        'This tool tests playback from your browser and does not bypass CORS, DRM, login walls, private access controls or copyright restrictions.',
        'A stream that works in VLC may still fail in the browser because browser CORS, codec and MediaSource rules are different.',
        'For deeper server-side checks, review your source server logs, CDN settings, CORS headers and playlist or segment responses.',
      ],
    },
  ],
  // FAQ 配置 - PlayerFAQ/FaqAccordion 读取，保持工具页问答统一样式和交互
  faq: {
    // FAQ 区块标题
    title: 'FAQ',
    // FAQ 问答列表 - 单项展开，避免内容遮挡 Footer
    items: [
      {
        // 问题标题 - 对比 M3U8 和 HLS 的关系
        question: 'What is the difference between M3U8 and HLS?',
        // 问题答案 - 解释协议和播放列表格式的关系
        answer:
          'HLS is the streaming protocol, while M3U8 is the playlist format used by HLS to describe media segments and stream variants.',
      },
      {
        // 问题标题 - 是否可以播放私有链接
        question: 'Can I test private M3U8 links?',
        // 问题答案 - 强调授权访问和私有链接限制
        answer:
          'Only test streams you own or are authorized to access. Some private links require tokens, cookies, referrer rules or signed URLs.',
      },
      {
        // 问题标题 - VLC 和浏览器播放结果不一致
        question: 'Why does an M3U8 stream work in VLC but not in the browser?',
        // 问题答案 - 解释浏览器特有的 CORS、MSE 和编码限制
        answer:
          'VLC can often access streams without the same browser CORS and MediaSource restrictions. A browser test can fail when CORS headers, codecs, mixed content, tokens or DRM requirements are not compatible with web playback.',
      },
      {
        // 问题标题 - CORS 错误原因
        question: 'Why do CORS errors happen?',
        // 问题答案 - 说明服务端跨域规则可能阻止浏览器请求
        answer:
          'CORS errors happen when the video server does not allow the browser to fetch playlist or segment files from this website origin.',
      },
      {
        // 问题标题 - DRM 和访问限制边界
        question: 'Can this tool bypass DRM or access restrictions?',
        // 问题答案 - 明确不绕过任何保护措施
        answer:
          'No. The player does not bypass DRM, CORS, token rules, login requirements, geo-blocking, copyright restrictions or source website permissions.',
      },
      {
        // 问题标题 - Playback Log 的作用
        question: 'What does the Playback Log show for HLS streams?',
        // 问题答案 - 说明日志是浏览器侧参考诊断
        answer:
          'It shows browser-side playback events, HLS loading events, warnings and errors. The log helps identify likely issues, but it cannot replace source server logs or full CDN diagnostics.',
      },
      {
        // 问题标题 - 覆盖无空格连贯词搜索，不把它塞进标题造成堆词
        question: 'Is this a browser-based m3u8player?',
        // 问题答案 - 自然解释 m3u8player 连写形式，同时强调授权边界
        answer:
          'Yes. Some users write m3u8player as one word. This page is a browser-based M3U8 player for testing public or authorized HLS streams, without downloading or bypassing access controls.',
      },
      {
        // 问题标题 - 是否存储视频 URL
        question: 'Does this player store my video URL?',
        // 问题答案 - 强调浏览器会话内使用，不建议粘贴敏感链接
        answer:
          'The page uses the URL inside your browser session for playback and embed generation. Do not paste confidential or unauthorized links.',
      },
      {
        // 问题标题 - 移动端是否可用
        question: 'Can I use this M3U8 player on mobile?',
        // 问题答案 - 说明响应式支持和浏览器/编码限制
        answer:
          'Yes. The page is responsive and works in modern mobile browsers, though playback support depends on the browser, stream codec, network and source access rules.',
      },
    ],
  },
};
