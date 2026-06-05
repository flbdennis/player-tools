// 中文 M3U8 工具页配置 - 当前中文版本第一步只做 M3U8 页面，MP4/DASH 暂不中文化
// 目的：集中管理中文 SEO、关键词覆盖、播放器文案、FAQ 和合规边界，避免在页面组件中硬编码中文内容
import zhCNPlayerLogText from './playerLogText/zh-CN.js';

export const zhM3u8PlayerPage = {
  // 中文页面 SEO 配置 - 重点覆盖中文搜索词、连写词和免费相关词，但不承诺下载、转换或绕过限制
  seo: {
    title: '免费 M3U8 在线播放器 - m3u8 player / m3u8play HLS 测试工具',
    description:
      '免费在线测试公开或已授权的 M3U8/HLS 视频流，可查看播放状态、跨域、编码和服务器响应问题。也适合通过 m3u8play、m3u8 play、m3u8player、m3u8 player 等名称查找在线测试工具的用户。',
  },
  // Hero 配置 - H1 保持简洁，长尾词分散到描述、卡片和 FAQ
  hero: {
    title: '免费 M3U8 在线播放器',
    description:
      '粘贴公开或已授权的 M3U8/HLS 视频流地址，直接在浏览器中进行 M3U8 在线播放测试，快速查看播放状态、M3U8跨域错误、HLS跨域问题、编码兼容性和服务器响应情况。适合测试 M3U8直播源、M3U8直播流、课程视频或网页嵌入播放场景。',
    image: '/imgs/m3u8_1.webp',
    imageAlt: 'M3U8在线播放器和 HLS直播流测试工具插图',
    imageWidth: 1448,
    imageHeight: 1086,
    imageLayout: {
      mobile: {
        width: '132px',
        height: 'auto',
        right: '-8px',
        top: '42px',
        bottom: 'auto',
        zIndex: '20',
        opacity: '0.96',
        cardPaddingRight: '112px',
        sectionHeight: '192px',
        cardMinHeight: '156px',
      },
      desktop: {
        width: '300px',
        height: 'auto',
        right: '-18px',
        top: '-24px',
        zIndex: '20',
        opacity: '1',
      },
    },
  },
  // 中文页当前只开放 M3U8 一个工具入口，避免把用户引导到尚未中文化的 MP4/DASH 页面
  tabs: [
    { id: 'm3u8', label: 'M3U8在线播放器', href: '/zh/m3u8-player' },
  ],
  // 播放器主卡片配置 - 尽量中文化可配置文案，底层播放错误仍由浏览器和播放器事件决定
  player: {
    id: 'm3u8',
    pagePath: '/zh/m3u8-player',
    playerLabel: 'M3U8/HLS 视频流',
    // 隐藏 H2，仅用于播放器区域语义和无障碍，不放 SEO 关键词堆叠
    panelTitle: 'M3U8/HLS 视频流播放面板',
    defaultUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    inputPlaceholder: '粘贴 M3U8直播源、M3U8直播流或 .m3u8 链接...',
    buttonLabel: '播放',
    policyHint:
      '请仅测试公开或已授权的视频链接。请尊重版权、隐私和来源网站的服务条款。',
    emptyTitle: '准备测试 M3U8/HLS 视频流',
    emptyDescription: '输入m3u8链接立即播放，并查看浏览器侧加载结果。',
    ui: {
      urlErrorText: '请输入以 http:// 或 https:// 开头的有效链接。',
      readyStatusText: '状态：就绪。',
      readyInstructionText: '粘贴公开或已授权的链接，然后点击播放开始测试。',
      dragLogHint: '拖动日志区域左下角可以展开，查看更多播放诊断记录。',
      logText: zhCNPlayerLogText,
    },
    playbackLog: {
      title: '播放诊断日志',
      description:
        '记录浏览器端播放事件，仅用于公开或已授权链接。结果取决于浏览器、网络、CORS、CDN、服务器、MIME/编码、Range 请求和访问设置；MetisTools 不绕过 CORS、DRM、版权或来源权限。',
      shortDescription:
        '记录授权链接的浏览器端播放事件。',
      notice:
        '信息 = 正常进度，成功 = 播放里程碑，警告 = 可能的问题，错误 = 播放失败。警告和错误会显示原始英文日志，方便搜索。',
      sourceNotice:
        'INFO = normal progress, SUCCESS = playback milestone, WARNING = possible issue, ERROR = playback failure. Warnings and errors include the original English log for search.',
      lines: [],
      actions: {
        clear: '清空',
        copy: '复制日志',
        copied: '已复制',
        showEnglish: '英文日志',
        showEnglishTitle: '切换为英文原文，方便搜索错误。当前日志会立即切换，无需清空。',
        showLocalized: '中文日志',
        showLocalizedTitle: '切换回中文日志。当前日志会立即切换，无需清空。',
      },
    },
  },
  // iframe 嵌入配置 - 明确只适合公开或已授权流，不隐藏、不代理用户视频地址
  embed: {
    pagePath: '/zh/m3u8-player',
    embedPath: '/embed/m3u8',
    title: 'iframe嵌入播放器',
    shortNotice: '仅嵌入公开或已授权的视频流，适合 HTML嵌入视频 场景。',
    detailNotice:
      '私有或签名链接请使用短期 URL 和来源站访问规则。iframe 嵌入不会隐藏、代理或保护原始视频链接。',
    emptyLabel: '空播放器',
    currentUrlLabel: '带当前链接',
    sensitiveNotice:
      '当前链接看起来包含 token、signature 或 expires 等参数。请只在授权范围内使用短期链接。',
    missingUrlNotice: '请先在上方输入有效链接，或使用空播放器模式。',
    copyLabel: '复制代码',
    copiedLabel: '已复制',
  },
  // 使用步骤 - 直接覆盖“输入 m3u8 链接立即播放”等中文长尾场景
  guide: {
    title: '如何使用M3U8在线播放器',
    steps: [
      {
        icon: 'Link',
        title: '粘贴 M3U8 链接',
        description: '输入m3u8链接立即播放，链接必须是公开或已授权的 M3U8视频流地址。',
      },
      {
        icon: 'CirclePlay',
        title: '点击播放',
        description: '用浏览器加载 M3U8直播源 或 M3U8直播流，检查是否能正常播放。',
      },
      {
        icon: 'Settings2',
        title: '查看播放状态',
        description: '确认音量、全屏、暂停和播放进度是否符合浏览器本地播放行为。',
      },
      {
        icon: 'Gauge',
        title: '排查播放问题',
        description: '结合播放日志判断 M3U8跨域错误、HLS跨域问题、编码或服务器响应问题。',
      },
    ],
  },
  // 信息卡片 - 三个 H2 承载中文关键词、长尾词和合规边界
  infoCards: [
    {
      title: 'M3U8 在线测试工具的常见名称',
      image: '/imgs/m3u8_2.webp',
      imageAlt: '在线 M3U8 工具和 M3U8在线工具箱插图',
      paragraphs: [
        '这个页面是浏览器中的 M3U8/HLS 在线测试工具，用于测试公开或已授权的视频流是否能正常播放。',
        '你也可以把这个工具理解为 m3u8play、m3u8 play、m3u8player 或 m3u8 player 在线测试工具。不同用户搜索习惯不同，但这里的核心功能都是测试公开或已授权的 M3U8/HLS 视频流。',
      ],
    },
    {
      title: 'M3U8视频无法播放和跨域排查',
      image: '/imgs/m3u8_3.webp',
      imageAlt: 'M3U8视频无法播放和 HLS 跨域问题排查插图',
      bullets: [
        'M3U8视频无法播放 可能由链接过期、切片丢失、编码不兼容、服务器不可用或网络限制引起。',
        '当 视频源服务器限制跨域访问 时，浏览器可能提示 M3U8跨域错误 或 HLS跨域问题，需要由来源服务器或 CDN 正确配置。',
        '这个工具只做浏览器侧检查，不会下载视频、转换格式，也不会绕过 CORS、DRM、登录、token、版权或来源网站权限。',
      ],
    },
    {
      title: 'M3U8格式、原理和浏览器边界',
      image: '/imgs/m3u8_4.webp',
      imageAlt: 'M3U8格式和浏览器本地播放边界插图',
      bullets: [
        '如果你想了解 什么是M3U8文件、什么是M3U8格式 或 如何打开m3u8文件，可以先用本页测试真实播放表现，再查看播放日志。',
        'M3U8协议原理 是通过播放列表引用媒体分片；M3U8格式的优点 包括适合直播、清晰度切换和分段传输，M3U8与其他格式区别 主要在播放列表和流式加载方式。',
        '本页采用纯前端播放，不上传视频链接；播放行为发生在你的浏览器中，因此更接近真实浏览器本地播放结果。',
      ],
    },
  ],
  // FAQ - 把必须覆盖的中文关键词集中放在工具页，而不是分散到其他页面
  faq: {
    title: '常见问题',
    items: [
      {
        question: 'm3u8play、m3u8 play、m3u8player 和 m3u8 player 指的是同类工具吗？',
        answer:
          '通常是的。这些写法多用于搜索在线 M3U8/HLS 播放或测试工具。本页提供的是浏览器端测试播放器，用于检查公开或已授权的视频流是否能正常播放。',
      },
      {
        question: '这是免费M3U8播放器吗？',
        answer:
          '是。本页可以作为 免费M3U8播放器、免费m3u8在线播放器、免费HLS播放器 和 免费M3U8在线测试工具 使用，但只支持测试公开或已授权的视频链接。',
      },
      {
        question: '可以播放 M3U8直播源 和 M3U8直播流 吗？',
        answer:
          '可以测试公开或已授权的 M3U8直播源 和 M3U8直播流。直播是否稳定取决于来源服务器、CDN、网络、编码、CORS 和访问权限。',
      },
      {
        question: '什么是M3U8文件，什么是M3U8格式？',
        answer:
          'M3U8 是 HLS 常用的播放列表格式，用来描述媒体分片、清晰度变体、音频轨道和字幕等信息。浏览器会读取播放列表，再请求实际的视频分片。',
      },
      {
        question: '如何打开m3u8文件？',
        answer:
          '如果你有公开或已授权的 .m3u8 链接，可以把它粘贴到本页输入框中测试播放。网页地址、登录页或普通视频详情页通常不是可直接播放的 M3U8 链接。',
      },
      {
        question: '为什么会出现 M3U8跨域错误 或 HLS跨域问题？',
        answer:
          '这通常是因为来源服务器没有允许当前网站在浏览器中请求播放列表、分片、字幕或密钥文件。跨域问题需要由视频源服务器或 CDN 配置解决，播放器不能绕过。',
      },
      {
        question: '是否支持 HTML嵌入视频 和 iframe嵌入播放器？',
        answer:
          '支持生成 iframe 嵌入代码，适合在授权范围内做 HTML嵌入视频。请注意，iframe 不会隐藏或代理原始视频 URL，私有或签名链接应使用短期链接和来源站访问规则。',
      },
      {
        question: '这个页面会上传视频链接吗？',
        answer:
          '本页用于浏览器本地播放和纯前端播放，不上传视频链接到服务器端解析。请不要粘贴未经授权、包含敏感 token 或不应公开的视频地址。',
      },
    ],
  },
};
