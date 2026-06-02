import { playerShared } from './player.js';
// DASH 播放器页面配置 - 复用 M3U8/MP4 工具页结构，仅替换 DASH 对应文案、素材、默认链接和 SEO
// 目的：DASH 页面只读取配置并组合公共组件，避免复制一套独立页面逻辑
export const dashPlayerPage = {
  // 页面 SEO 配置 - BaseLayout 和 SEO 组件读取，用于搜索结果和社交分享
  seo: {
    // 页面标题 - 会与 defaultSeo.titleTemplate 组合输出
    title: 'MPEG-DASH Player - MPD Test Online',
    // 页面描述 - 用于 meta description、OG 描述和 Twitter 描述
    description:
      'Test public or authorized MPEG-DASH MPD manifests online. Preview playback, review browser events, and understand manifest, codec, DRM, or access limits.',
  },
  // 面包屑配置 - 当前按 SEO 和用户体验要求保留 Home + 当前页，不展示 Tools 中间层
  breadcrumb: [
    // 首页入口 - 面包屑第一项
    { label: 'Home', href: '/' },
    // 当前页面入口 - 面包屑最后一项
    { label: 'DASH Player', href: '/dash-player/' },
  ],
  // 工具页 Hero 配置 - ToolHero 组件读取标题、描述和插图布局
  hero: {
    // 页面 H1 标题 - 每个页面只能有一个 H1
    title: 'MPEG-DASH Player and MPD Test Tool',
    // Hero 描述 - 说明 DASH/MPD 流测试和 embed 生成用途
    description:
      'Paste a public or authorized MPD manifest URL to preview MPEG-DASH playback, review the Playback Log, and check common manifest or access issues.',
    // Hero 插图路径 - 只能使用 public/imgs 中已有的 DASH 素材
    image: '/imgs/dash_1.webp',
    // Hero 插图 alt - 描述图片内容，用于可访问性和图片 SEO
    imageAlt: '3D illustration of an online MPEG-DASH player with MPD and DASH labels',
    // Hero 插图原始宽度 - 用于输出 img width，降低布局抖动
    imageWidth: 1448,
    // Hero 插图原始高度 - 用于输出 img height，降低布局抖动
    imageHeight: 1086,
    // Hero 插图布局 - DASH 页可以独立于 M3U8/MP4 页微调宽高和位置
    imageLayout: {
      // 移动端插图位置 - 主要避免遮挡标题和描述
      mobile: {
        // 移动端插图显示宽度
        width: '140px',
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
        cardPaddingRight: '118px',
        // 移动端 Hero 总高度，压缩首屏空白
        sectionHeight: '194px',
        // 移动端白色文案卡片最小高度，保证插图和文字视觉上属于同一区块
        cardMinHeight: '158px',
      },
      // 桌面端插图位置 - 用于贴近 UI 设计图中的右上方 3D 插图
      desktop: {
        // 桌面端插图显示宽度
        width: '304px',
        // 桌面端插图高度，auto 保持原始比例
        height: 'auto',
        // 桌面端右侧偏移
        right: '-12px',
        // 桌面端顶部偏移
        top: '-28px',
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
    { id: 'm3u8', label: 'M3U8 Player', href: '/m3u8-player/' },
    // MP4 工具页 Tab
    { id: 'mp4', label: 'MP4 Player', href: '/mp4-player/' },
    // DASH 当前页 Tab
    { id: 'dash', label: 'DASH Player', href: '/dash-player/' },
  ],
  // 播放器主卡片配置 - PlayerShell 读取输入、播放、占位和日志文案
  player: {
    // 工具类型 ID - 播放器逻辑用于区分 MP4/M3U8/DASH 类型
    id: 'dash',
    // 当前工具页路径 - embed 代码和 direct link 生成使用
    pagePath: '/dash-player/',
    // 播放对象名称 - 播放器提示和日志中描述当前内容类型
    playerLabel: 'DASH stream',
    // 默认测试链接 - 页面初始输入框内容，使用公开 MPD 示例流
    defaultUrl: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
    // 输入框占位文案 - 当没有 URL 时显示
    inputPlaceholder: 'Paste your MPD manifest link here...',
    // 播放按钮文案 - 输入框右侧和播放器触发逻辑共用
    buttonLabel: 'Play',
    // 授权与版权提示 - 必须提醒用户只测试公开或已授权链接
    policyHint: playerShared.policyNotice,
    // 播放器空状态标题 - 未播放时显示在播放器占位层
    emptyTitle: 'Ready to test your DASH stream',
    // 播放器空状态描述 - 指导用户粘贴 MPD manifest URL 后点击播放
    emptyDescription: 'Paste an MPD manifest URL above and click Play to load it in the browser player.',
    // 播放日志配置 - 用于播放器下方 Playback Log 区域
    playbackLog: {
      // 日志区标题
      title: 'Playback Log',
      // 日志区说明 - 解释日志用于定位 DASH 播放问题
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
    // 当前工具页路径 - iframe src 和 direct link 基于它生成
    pagePath: '/dash-player/',
    // Embed 区标题 - 提示用户可将播放器嵌入自己的网站
    title: 'Embed the player on your website',
    // iframe 模式按钮文案
    iframeLabel: 'iFrame Embed',
    // 直接链接模式按钮文案
    directLabel: 'Direct Link',
    // 复制按钮默认文案
    copyLabel: 'Copy Code',
    // 复制成功后的按钮文案
    copiedLabel: 'Copied',
  },
  // 使用步骤配置 - PlayerGuideSteps 组件读取并按顺序渲染
  guide: {
    // 使用步骤区标题
    title: 'How to Use DASH Player',
    // 使用步骤列表 - 每项包含图标、标题和说明
    steps: [
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'Link',
        // 步骤标题 - 第一步粘贴 MPD 链接
        title: 'Paste an MPD link',
        // 步骤描述 - 提醒用户使用公开或授权 MPD manifest URL
        description: 'Paste a public or authorized MPD manifest URL into the input box.',
      },
      {
        // 步骤图标名称 - 由 Icon.astro 统一渲染
        icon: 'CirclePlay',
        // 步骤标题 - 第二步点击播放
        title: 'Click the Play button',
        // 步骤描述 - 说明会加载 DASH 流并检查播放支持
        description: 'Load the stream and check DASH playback support.',
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
        // 步骤描述 - 说明可排查 MPD、切片、编码和网络兼容问题
        description: 'Identify MPD, segment, codec or network compatibility problems.',
      },
    ],
  },
  // 信息卡片配置 - InfoImageCard 组件读取，用三个可见 H2 承载检查项、排障说明和访问边界
  infoCards: [
    {
      // 卡片标题 - 说明 MPEG-DASH 工具实际检查哪些浏览器侧信号
      title: 'What This MPEG-DASH Player Checks',
      // 卡片插图路径 - 使用 public/imgs 中的 MPD/DASH 插图
      image: '/imgs/dash_2.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D MPD manifest file and adaptive video segment illustration for DASH testing',
      // 要点列表 - 覆盖 MPD、切片和浏览器播放事件
      bullets: [
        'Checks whether a public or authorized MPD manifest can be loaded by the browser player.',
        'Shows browser and DASH loading events related to manifests, media segments, codecs and playback state.',
        'Displays Playback Log records so you can review likely manifest, segment, network or compatibility issues.',
      ],
    },
    {
      // 卡片标题 - 说明 DASH 常见失败原因
      title: 'Common DASH Playback Problems',
      // 卡片插图路径 - 使用多设备 DASH 播放插图
      image: '/imgs/dash_3.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D multi-device MPEG-DASH playback illustration for MPD troubleshooting',
      // 要点列表 - 覆盖 MPD、切片、CORS、编码和服务器问题
      bullets: [
        'The MPD manifest may be expired, private, invalid, blocked by tokens or unavailable from your network.',
        'CORS rules can block manifest, initialization segment or media segment requests in the browser.',
        'Missing segments, unsupported codecs, DRM license requirements, slow servers or unstable networks can stop playback.',
      ],
    },
    {
      // 卡片标题 - 明确 DASH DRM、MPD 和访问限制边界
      title: 'DRM, Manifest and Access Limits',
      // 卡片插图路径 - 使用 DASH 播放问题警告插图
      image: '/imgs/dash_4.webp',
      // 卡片插图 alt - 描述插图内容
      imageAlt: '3D warning illustration for DASH DRM, manifest and browser access limits',
      // 要点列表 - 强调不绕过 DRM/私有访问，避免版权和审核风险
      bullets: [
        'This tool tests plain browser playback and does not bypass DRM, license servers, login walls, private access controls or copyright restrictions.',
        'Protected DASH streams usually require a supported DRM license flow and cannot be tested like a normal public MPD link.',
        'If you own the source, verify MPD validity, segment URLs, codec declarations, CORS headers, token expiry and CDN responses.',
      ],
    },
  ],
  // FAQ 配置 - PlayerFAQ/FaqAccordion 读取，保持工具页问答统一样式和交互
  faq: {
    // FAQ 唯一前缀 - 防止同一页面存在多个 FAQ 时 id 冲突
    idPrefix: 'dash-faq',
    // FAQ 区块标题
    title: 'FAQ',
    // FAQ 问答列表 - 单项展开，避免内容遮挡 Footer
    items: [
      {
        // 问题标题 - 对比 DASH 和 HLS
        question: 'What is the difference between DASH and HLS?',
        // 问题答案 - 解释 MPD manifest 和 M3U8 playlist 的区别
        answer:
          'DASH and HLS are both adaptive streaming technologies. DASH commonly uses an MPD manifest, while HLS commonly uses M3U8 playlists.',
      },
      {
        // 问题标题 - 解释 MPD 文件
        question: 'What is an MPD file?',
        // 问题答案 - 说明 MPD 描述切片、码率、分辨率、编码和时间信息
        answer:
          'An MPD file is the manifest used by MPEG-DASH. It describes media segments, bitrates, resolutions, codecs and timing information for adaptive playback.',
      },
      {
        // 问题标题 - 是否可以测试私有 MPD 链接
        question: 'Can I test private MPD links?',
        // 问题答案 - 强调公开或授权边界
        answer:
          'Only test manifests you own or are authorized to access. Private MPD links may fail if they require signed URLs, cookies, referrer rules, login sessions or DRM license access.',
      },
      {
        // 问题标题 - DASH 加载失败原因
        question: 'Why does DASH video fail to load?',
        // 问题答案 - 覆盖过期 URL、CORS、编码、DRM、缺失切片和服务端问题
        answer:
          'Common causes include expired URLs, invalid MPD XML, CORS restrictions, unsupported codecs, DRM protection, missing segments, slow streaming servers or blocked source access.',
      },
      {
        // 问题标题 - DRM 播放边界
        question: 'Can this tool play DRM-protected DASH streams?',
        // 问题答案 - 明确普通链接测试无法替代 DRM 授权流程
        answer:
          'Not as a plain public MPD test. DRM-protected streams require the correct browser support, license server flow and authorization. This tool does not bypass DRM or license checks.',
      },
      {
        // 问题标题 - CORS 错误原因
        question: 'Why do CORS errors happen with MPD or DASH segments?',
        // 问题答案 - 说明服务端跨域规则可能阻止浏览器请求
        answer:
          'CORS errors happen when the source server does not allow this website origin to fetch the MPD manifest, initialization segments or media segments in the browser.',
      },
      {
        // 问题标题 - Playback Log 的作用
        question: 'What does the Playback Log show for DASH streams?',
        // 问题答案 - 说明日志是浏览器侧参考诊断
        answer:
          'It shows browser-side playback events and DASH loading events, including manifest loading, buffering, errors and stalled playback. Use it as a reference, not a full server-side diagnostic report.',
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
        question: 'Can I test DASH streams on mobile?',
        // 问题答案 - 说明响应式支持和浏览器/编码/DRM 限制
        answer:
          'Yes. The page is responsive, but DASH playback depends on mobile browser support, codecs, DRM requirements, network conditions and whether the stream allows browser access.',
      },
    ],
  },
};
