import { playerShared } from './player.js';
// 首页配置 - 首页所有文案、CTA、图片、FAQ 和工具展示数据集中管理
// 目的：组件只负责渲染和交互，避免首页共享文案散落在组件中导致维护困难

// Hero 首屏配置 - 首页顶部主标题、CTA、特性标签和主视觉插图
export const hero = {
  // 首屏胶囊标签文案 - 用于快速说明站点定位
  badge: 'Free Video Player and Link Testing Tools',
  // H1 标题前缀 - 与高亮词和后缀组合成唯一首页 H1
  titlePrefix: 'Free Online ',
  // H1 高亮词 - 组件会使用渐变文字强调该部分
  titleHighlight: 'Video Player',
  // H1 标题后缀 - 与前缀、高亮词组合成第一行标题
  titleSuffix: ' Tools',
  // H1 第二行标题 - 覆盖三个首期工具格式，避免首页定位过窄
  titleSecondLine: 'for M3U8, MP4 and DASH',
  // 首屏描述 - 说明 M3U8、MP4、DASH 三类工具的核心用途
  description:
    'Test public or authorized M3U8, MP4 and MPEG-DASH links in your browser. Preview playback, review browser-side events and understand common loading issues.',
  // 主 CTA - 默认引导用户进入 M3U8 测试工具页
  primaryCta: { label: 'Start Testing', href: '/m3u8-player/' },
  // 次 CTA - 跳转到首页工具列表锚点，便于用户查看全部工具
  secondaryCta: { label: 'View All Players', href: '#tools' },
  // 首屏特性标签 - 使用 Icon 组件渲染图标，颜色按 UI 设计配置
  chips: [
    // 在线使用标签
    { label: 'Online', icon: 'CircleCheck', color: '#159dff' },
    // 无需安装标签
    { label: 'No Install', icon: 'Home', color: '#28c766' },
    // 日志诊断标签
    { label: 'Playback Log', icon: 'FileText', color: '#159dff' },
    // 授权边界标签
    { label: 'Authorized Links', icon: 'Shield', color: '#8b5cf6' },
  ],
  // 首屏主视觉插图 - 只能使用 public/imgs 中的既有素材
  image: '/imgs/home_1.webp',
  // 首屏插图 alt - 用于可访问性和图片 SEO
  imageAlt: '3D illustration of online video player tools for M3U8, MP4 and DASH testing',
};

// 首页工具列表配置 - Available Player Tools 区块使用
export const availableTools = {
  // 区块标题 - 展示当前可用播放器工具
  title: 'Free Video Player Tools',
  // 区块副标题 - 解释三类播放器分别覆盖不同测试场景
  subtitle: 'Choose the right browser-based player for HLS playlists, MP4 video URLs or MPEG-DASH MPD manifests.',
  // 工具卡片 CTA 文案 - 所有工具卡片统一使用
  ctaLabel: 'Use Now',
  // 工具主题色 - 根据 tools.js 中的 id 匹配不同图标渐变和链接色
  colors: {
    // M3U8 工具紫色主题
    m3u8: { from: '#8b5cf6', to: '#6f42ff', text: '#7747ff' },
    // MP4 工具粉色主题
    mp4: { from: '#ff6d9a', to: '#ff3f78', text: '#ff3f78' },
    // DASH 工具橙色主题
    dash: { from: '#ffc444', to: '#ff970f', text: '#ff9900' },
  },
};

// 首页快速测试配置 - Quick Test M3U8 Link 表单使用
export const quickTest = {
  // 快速测试区块标题
  title: 'Quick Test an M3U8 Link',
  // 快速测试区块说明 - 提醒用户粘贴 M3U8 链接进行可访问性检查
  subtitle: 'Paste a public or authorized M3U8 link to check browser playback and basic loading status.',
  // 输入框占位文案 - 提供 URL 格式示例
  placeholder: 'Paste an M3U8 link, e.g. https://example.com/stream.m3u8',
  // 提交按钮文案
  buttonLabel: 'Test',
  // 授权与版权提示 - AdSense 审核和用户合规提示必须保留
  hint: playerShared.policyNotice,
};

// 首页使用步骤配置 - How to Use 区块使用
export const howItWorks = {
  // 区块标题 - 说明工具的通用使用流程
  title: 'How to Use the Player Tools',
  // 区块插图路径 - 只能使用 public/imgs 中的既有素材
  image: '/imgs/home_2.webp',
  // 区块插图 alt - 描述插图内容，提升可访问性
  imageAlt: '3D illustration showing a video link testing checklist',
  // 步骤列表 - 组件按顺序渲染编号步骤
  steps: [
    {
      // 第 1 步标题 - 选择播放器类型
      title: 'Choose the right player',
      // 第 1 步描述 - 引导用户按格式选择工具
      description: 'Use M3U8 for HLS playlists, MP4 for direct video files, or DASH for MPD manifests.',
    },
    {
      // 第 2 步标题 - 粘贴视频链接
      title: 'Paste a public or authorized link',
      // 第 2 步描述 - 告诉用户输入 URL 并开始测试
      description: 'Use links you own, manage or have permission to test.',
    },
    {
      // 第 3 步标题 - 在线播放预览
      title: 'Preview playback online',
      // 第 3 步描述 - 说明可以检查加载和兼容性
      description: 'Load the video in your browser and check whether playback starts normally.',
    },
    {
      // 第 4 步标题 - 复查播放详情
      title: 'Review playback details',
      // 第 4 步描述 - 说明可以定位链接、流和浏览器问题
      description: 'Use the Playback Log and page notes to identify common browser-side issues.',
    },
  ],
};

// 首页优势区配置 - Why Choose MetisTools 区块使用
export const whyChoose = {
  // 区块标题 - 展示选择 MetisTools 的理由
  title: 'Why Use MetisTools?',
  // 优势列表 - 每项包含标题、说明和 Icon 组件名称
  features: [
    {
      // 优势标题 - 强调加载速度和稳定性
      title: 'Browser-side Testing',
      // 优势说明 - 控制在短句，保证移动端高度稳定
      description: 'Test links directly online.',
      // 图标名称 - 由 Icon.astro 统一渲染
      icon: 'Zap',
    },
    {
      // 优势标题 - 强调隐私和安全测试
      title: 'Playback Log',
      // 优势说明 - 强调简单安全的测试体验
      description: 'Review useful events.',
      // 图标名称 - 由 Icon.astro 统一渲染
      icon: 'Shield',
    },
    {
      // 优势标题 - 强调多设备适配
      title: 'Clear Boundaries',
      // 优势说明 - 桌面端和移动端都可使用
      description: 'Clear access limits.',
      // 图标名称 - 由 Icon.astro 统一渲染
      icon: 'Monitor',
    },
    {
      // 优势标题 - 面向开发者调试场景
      title: 'Three Formats',
      // 优势说明 - 强调可帮助调试播放问题
      description: 'M3U8, MP4 and DASH.',
      // 图标名称 - 由 Icon.astro 统一渲染
      icon: 'Code',
    },
    {
      // 优势标题 - 强调免费使用
      title: 'No Install',
      // 优势说明 - 简单工具适合日常测试
      description: 'Use modern browsers.',
      // 图标名称 - 由 Icon.astro 统一渲染
      icon: 'Headphones',
    },
  ],
};

// 首页 FAQ 配置 - 首页 FAQ 组件和公共 FAQ 手风琴读取该数据
export const faq = {
  // FAQ 区块标题
  title: 'FAQ',
  // FAQ 问答列表 - 以数据驱动方式渲染，便于后续复用和维护
  items: [
    {
      // 问题标题 - 说明首页工具覆盖范围
      question: 'What can I test with MetisTools?',
      // 问题答案 - 覆盖首期三个真实工具页，避免夸大功能
      answer:
        'You can test public or authorized M3U8/HLS playlists, direct MP4 video URLs and MPEG-DASH MPD manifests in your browser.',
    },
    {
      // 问题标题 - 说明工具不是下载或转换服务
      question: 'Is MetisTools a video downloader or converter?',
      // 问题答案 - 明确功能边界，降低版权和 AdSense 合规风险
      answer:
        'No. MetisTools is built for browser playback testing and troubleshooting. It does not download, convert, capture or redistribute video content.',
    },
    {
      // 问题标题 - 帮用户选择对应工具页
      question: 'Which player should I use?',
      // 问题答案 - 直接映射到 M3U8、MP4、DASH 三个页面
      answer:
        'Use the M3U8 Player for HLS playlists, the MP4 Player for direct MP4 links, and the MPEG-DASH Player for MPD manifest URLs.',
    },
    {
      // 问题标题 - 说明视频无法播放的常见原因
      question: 'Why can a video link fail in the browser?',
      // 问题答案 - 覆盖过期链接、CORS、编码、地域和 DRM 等原因
      answer:
        'Common causes include expired URLs, private access rules, CORS restrictions, unsupported codecs, missing media segments, server errors, geo-blocking or DRM protection.',
    },
    {
      // 问题标题 - 解释 Playback Log 的价值
      question: 'What does the Playback Log show?',
      // 问题答案 - 明确日志是浏览器侧参考信息，不承诺完整诊断
      answer:
        'The Playback Log shows browser-side playback events, warnings and errors. It can help identify likely loading issues, but results depend on browser support and source server behavior.',
    },
    {
      // 问题标题 - 是否可以测试私有或敏感链接
      question: 'Can I test private video links?',
      // 问题答案 - 强调授权、登录态和签名链接限制
      answer:
        'Only test links you own or are authorized to access. Private links may fail if they require login sessions, cookies, referrer rules, signed tokens or a DRM license flow.',
    },
    {
      // 问题标题 - 是否存储用户输入的视频 URL
      question: 'Does MetisTools store my video URL?',
      // 问题答案 - 说明浏览器内使用，并提醒不要粘贴敏感链接
      answer:
        'The tools use the URL in your browser session for playback testing. Do not paste private, confidential or unauthorized video links.',
    },
    {
      // 问题标题 - 说明移动端可用性
      question: 'Can I use the tools on mobile?',
      // 问题答案 - 说明响应式支持和浏览器能力限制
      answer:
        'Yes. The pages are responsive, but playback still depends on the browser, codec support, network conditions and whether the source allows browser access.',
    },
  ],
};
