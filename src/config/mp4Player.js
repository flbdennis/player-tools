import { playerShared } from './player.js';
// MP4 播放器页面配置 - 复用 M3U8 页面结构，仅替换 MP4 对应文案、素材、默认链接和 SEO
// 目的：MP4 页面只读取配置并组合公共组件，避免复制一套独立页面逻辑
export const mp4PlayerPage = {
  // 页面 SEO 配置 - BaseLayout 和 SEO 组件读取，用于搜索结果和社交分享
  seo: {
    // 页面标题 - 会与 defaultSeo.titleTemplate 组合输出
    title: 'MP4 Player Online - Play MP4 From URL',
    // 页面描述 - 用于 meta description、OG 描述和 Twitter 描述
    description:
      'Play and test public or authorized MP4 video URLs in your browser. Check playback behavior and learn about MIME type, codec, and Range request issues.',
  },
  // 面包屑配置 - 当前按 SEO 和用户体验要求保留 Home + 当前页，不展示 Tools 中间层
  breadcrumb: [
    // 首页入口 - 面包屑第一项
    { label: 'Home', href: '/' },
    // 当前页面入口 - 面包屑最后一项
    { label: 'MP4 Player', href: '/mp4-player' },
  ],
  // 工具页 Hero 配置 - ToolHero 组件读取标题、描述和插图布局
  hero: {
    // 页面 H1 标题 - 每个页面只能有一个 H1
    title: 'MP4 Player Online for Video URLs',
    // Hero 描述 - 说明 MP4 文件测试和 embed 生成用途
    description:
      'Paste a public or authorized MP4 URL to preview browser playback, review the Playback Log, and check common file, MIME type, codec or server issues.',
    // Hero 插图路径 - 只能使用 public/imgs 中已有的 MP4 素材
    image: '/imgs/mp4_1.webp',
    // Hero 插图 alt - 描述图片内容，用于可访问性和图片 SEO
    imageAlt: '3D illustration of an online MP4 video player with video file and film reel',
    // Hero 插图原始宽度 - 用于输出 img width，降低布局抖动
    imageWidth: 1254,
    // Hero 插图原始高度 - 用于输出 img height，降低布局抖动
    imageHeight: 1254,
    // Hero 插图布局 - MP4 页可以独立于 M3U8 页微调宽高和位置
    imageLayout: {
      // 移动端插图位置 - 主要避免遮挡标题和描述
      mobile: {
        // 移动端插图显示宽度
        width: '138px',
        // 移动端插图高度，auto 保持原始比例
        height: 'auto',
        // 移动端右侧偏移
        right: '-6px',
        // 移动端底部偏移，让插图轻微压住下方区域
        top: '42px',
        // 移动端底部偏移改为 auto，让插图和文字同属 Hero 视觉区域，避免移动端上下分离过远
        bottom: 'auto',
        // 移动端层级，保证插图在背景上但不压住主要文字
        zIndex: '20',
        // 移动端透明度，提升文字可读性
        opacity: '0.96',
        // 移动端文案卡片右侧预留空间，避免插图遮挡标题和描述
        cardPaddingRight: '116px',
        // 移动端 Hero 总高度，压缩首屏空白
        sectionHeight: '192px',
        // 移动端白色文案卡片最小高度，保证插图和文字视觉上属于同一区块
        cardMinHeight: '156px',
      },
      // 桌面端插图位置 - 用于贴近 UI 设计图中的右上方 3D 插图
      desktop: {
        // 桌面端插图显示宽度
        width: '268px',
        // 桌面端插图高度，auto 保持原始比例
        height: 'auto',
        // 桌面端右侧偏移
        right: '8px',
        // 桌面端顶部偏移
        top: '-40px',
        // 桌面端层级，保证插图能压在播放器卡片上方
        zIndex: '20',
        // 桌面端透明度，保持素材完整显示
        opacity: '1',
      },
    },
  },
  // 工具 Tab 配置 - PlayerTabs 读取并根据 active id 标记当前页面
  tabs: [
    // M3U8 工具页 Tab
    { id: 'm3u8', label: 'M3U8 Player', href: '/m3u8-player' },
    // MP4 当前页 Tab
    { id: 'mp4', label: 'MP4 Player', href: '/mp4-player' },
    // DASH 工具页 Tab
    { id: 'dash', label: 'DASH Player', href: '/dash-player' },
  ],
  // 播放器主卡片配置 - PlayerShell 读取输入、播放、占位和日志文案
  player: {
    // 工具类型 ID - 播放器逻辑用于区分 MP4/M3U8/DASH 类型
    id: 'mp4',
    // 当前工具页路径 - embed 代码和 direct link 生成使用
    pagePath: '/mp4-player',
    // 播放对象名称 - 播放器提示和日志中描述当前内容类型
    playerLabel: 'MP4 video',
    // Hidden H2 used for player region semantics and screen readers, not for keyword stuffing
    panelTitle: 'MP4 video playback panel',
    // 默认测试链接 - 页面初始输入框内容，使用公开 MP4 示例视频
    defaultUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    // 输入框占位文案 - 当没有 URL 时显示
    inputPlaceholder: 'Paste your MP4 video link here...',
    // 播放按钮文案 - 输入框右侧和播放器触发逻辑共用
    buttonLabel: 'Play',
    // 授权与版权提示 - 必须提醒用户只测试公开或已授权链接
    policyHint: playerShared.policyNotice,
    // 播放器空状态标题 - 未播放时显示在播放器占位层
    emptyTitle: 'Ready to test your MP4 video',
    // 播放器空状态描述 - 指导用户粘贴 MP4 URL 后点击播放
    emptyDescription: 'Paste an MP4 URL above and click Play to load it in the browser player.',
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
    pagePath: '/mp4-player',
    // 专用嵌入页路径 - iframe 分享必须使用 noindex/禁广告的轻量页面
    embedPath: '/embed/mp4',
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
    title: 'How to Use MP4 Player',
    // 使用步骤列表 - 每项包含图标、标题和说明
    steps: [
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'Link',
        // 步骤标题 - 第一步粘贴链接
        title: 'Paste an MP4 link',
        // 步骤描述 - 提醒用户使用公开或授权 MP4 URL
        description: 'Paste a public or authorized MP4 video URL into the input box.',
      },
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'CirclePlay',
        // 步骤标题 - 第二步点击播放
        title: 'Click the Play button',
        // 步骤描述 - 说明会加载文件并检查浏览器支持
        description: 'Load the file and check browser playback support.',
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
        // 步骤描述 - 说明可排查 URL、编码、网络和浏览器兼容问题
        description: 'Identify URL, codec, network or browser compatibility problems.',
      },
    ],
  },
  // 信息卡片配置 - InfoImageCard 组件读取，用三个可见 H2 承载检查项、排障说明和浏览器限制
  infoCards: [
    {
      // 卡片标题 - 说明 MP4 工具实际检查哪些浏览器侧信号
      title: 'What This MP4 Player Checks',
      // 卡片插图路径 - 使用 public/imgs 中的 MP4 文件插图
      image: '/imgs/mp4_2.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D MP4 file illustration for browser video URL testing',
      // 要点列表 - 覆盖 MP4 链接、播放事件和服务端响应
      bullets: [
        'Checks whether a public or authorized MP4 URL can be loaded by the browser video element.',
        'Shows browser playback events, metadata loading, buffering, errors and likely source compatibility issues.',
        'Helps you review whether the MP4 link behaves like a direct media file rather than an HTML page or blocked response.',
      ],
    },
    {
      // 卡片标题 - 说明 MP4 常见失败原因
      title: 'Common MP4 Playback Problems',
      // 卡片插图路径 - 使用多设备播放相关插图
      image: '/imgs/mp4_3.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D multi-device online video playback illustration for MP4 troubleshooting',
      // 要点列表 - 覆盖 URL、编码、MIME、Range 和服务端问题
      bullets: [
        'The link may be expired, private, redirected to an HTML page, blocked by permissions or unavailable from your network.',
        'The file may use unsupported video or audio codecs even when the container is MP4.',
        'Missing MIME types, disabled Range requests, incomplete files, CORS restrictions or slow servers can prevent browser playback.',
      ],
    },
    {
      // 卡片标题 - 明确 MP4 浏览器限制和服务端边界
      title: 'Browser, MIME Type and Server Limits',
      // 卡片插图路径 - 使用警告插图
      image: '/imgs/mp4_4.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D warning illustration for MP4 MIME type and browser playback limits',
      // 要点列表 - 强调不下载、不转换、不绕过访问控制
      bullets: [
        'This tool plays MP4 links in the browser and does not download, convert, capture or redistribute video files.',
        'Browsers need supported codecs and correct media responses. A file that opens in a desktop player may still fail online.',
        'If you own the source server, verify Content-Type, byte Range support, redirects, CORS headers and the actual MP4 response.',
      ],
    },
  ],
  // FAQ 配置 - PlayerFAQ/FaqAccordion 读取，保持工具页问答统一样式和交互
  faq: {
    // FAQ 唯一前缀 - 防止同一页面存在多个 FAQ 时 id 冲突
    idPrefix: 'mp4-faq',
    // FAQ 区块标题
    title: 'FAQ',
    // FAQ 问答列表 - 单项展开，避免内容遮挡 Footer
    items: [
      {
        // 问题标题 - 说明可测试的 MP4 URL 类型
        question: 'What MP4 links can I test?',
        // 问题答案 - 强调公开或授权的直接视频链接
        answer:
          'Test public or authorized direct MP4 video URLs that can be accessed by your browser. Avoid confidential, unauthorized or login-only links.',
      },
      {
        // 问题标题 - 是否可以播放私有链接
        question: 'Can I test private MP4 links?',
        // 问题答案 - 强调授权访问和私有链接限制
        answer:
          'Only test videos you own or are authorized to access. Some private links may require signed URLs, cookies, referrer rules or login sessions.',
      },
      {
        // 问题标题 - MP4 加载失败原因
        question: 'Why does my MP4 fail to load?',
        // 问题答案 - 覆盖链接、权限、编码、CORS、服务端和文件完整性问题
        answer:
          'Common causes include expired URLs, redirects to non-video pages, missing permissions, unsupported codecs, CORS restrictions, slow servers or incomplete video files.',
      },
      {
        // 问题标题 - MIME 类型错误长尾问题
        question: 'What does "No video with supported format and MIME type found" mean?',
        // 问题答案 - 解释常见浏览器错误，不承诺自动修复
        answer:
          'It usually means the browser cannot use the response as playable media. The URL may not return an MP4 file, the MIME type may be wrong, the codec may be unsupported, or the server may block browser access.',
      },
      {
        // 问题标题 - Range 请求的重要性
        question: 'Why do Range requests matter for MP4 playback?',
        // 问题答案 - 说明浏览器常用字节范围加载视频
        answer:
          'Browsers often request byte ranges so they can seek, buffer and load metadata efficiently. If the server does not support Range requests, MP4 playback or seeking may fail.',
      },
      {
        // 问题标题 - 工具是否下载或转换视频
        question: 'Can this tool download or convert MP4 files?',
        // 问题答案 - 明确不是下载/转换工具，降低版权风险
        answer:
          'No. This page is for playback testing only. It does not download, convert, capture or redistribute MP4 files.',
      },
      {
        // 问题标题 - Playback Log 的作用
        question: 'What does the Playback Log show for MP4 videos?',
        // 问题答案 - 说明日志是浏览器侧参考诊断
        answer:
          'It shows browser-side events such as metadata loading, play attempts, buffering, errors and stalled playback. Use it as a reference when checking file, codec or server behavior.',
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
        question: 'Can I use this MP4 player on mobile?',
        // 问题答案 - 说明响应式支持和编码/浏览器限制
        answer:
          'Yes. The page is responsive and modern mobile browsers can play many MP4 files, but playback still depends on codec support, network conditions and source server settings.',
      },
    ],
  },
};
