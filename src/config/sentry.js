// Sentry 前端错误监控配置 - 第一阶段默认关闭，用户同意后才动态加载
// 重要原则：只做 Error Monitoring，不开 Session Replay，不上传用户输入的视频 URL
export const sentrySettings = {
  // 是否启用 Sentry 配置能力 - 注意：这里只是允许被用户同意后初始化，不代表默认开启
  enabled: true,
  // Sentry DSN - 这是前端可公开的项目地址，不是私密 API Token
  // 如需更换项目，只替换该值即可；不要把 SENTRY_AUTH_TOKEN 放到前端代码里
  dsn: 'https://d44e6fa0af60330187d36c1d40d3750b@o4511480672878592.ingest.de.sentry.io/4511480694177872',
  // 环境名称 - 让 Sentry 后台区分 production / development / preview
  environment: 'production',
  // 版本号 - 先使用静态版本，后续可在构建流程中替换为 Git commit 或发布版本
  release: 'metistools@0.0.1',
  // 采样率 - 第一阶段只上报错误，不采样普通性能链路
  tracesSampleRate: 0,
  // 事件采样率 - 1 表示同意后错误事件全量进入 beforeSend，再由过滤器决定是否丢弃
  sampleRate: 1,
  // 面包屑数量上限 - 降低 payload 体积，也减少意外带入敏感上下文的风险
  maxBreadcrumbs: 20,
  // 本地存储 key - 记录用户是否允许错误监控
  consentStorageKey: 'metistools_error_monitoring_consent',
  // 同意状态值 - 用户明确允许后才初始化 Sentry
  consentGrantedValue: 'granted',
  // 拒绝状态值 - 用户拒绝后不再弹出提示，也不初始化 Sentry
  consentDeniedValue: 'denied',
  // 需要过滤的 query 参数名 - 仅用于 URL 查询参数精确匹配，不能用于对象字段 includes 判断
  sensitiveQueryKeys: [
    'url',
    'u',
    'src',
    'source',
    'video',
    'stream',
    'manifest',
    'm3u8',
    'mpd',
    'mp4',
    'token',
    'auth',
    'authorization',
    'signature',
    'sig',
    'expires',
    'expire',
    'policy',
    'key',
    'session',
    'cookie',
  ],

  // 需要按字段名过滤的对象字段 - 使用精确匹配或安全长词匹配，避免 culture/value 等正常字段被误过滤
  sensitiveFieldKeys: [
    'url',
    'href',
    'src',
    'source',
    'video',
    'stream',
    'manifest',
    'm3u8',
    'mpd',
    'mp4',
    'token',
    'auth',
    'authorization',
    'signature',
    'sig',
    'expires',
    'expire',
    'policy',
    'session',
    'cookie',
    'password',
    'secret',
    'credential',
  ],
  // 需要过滤的媒体后缀 - 任何包含这些后缀的完整 URL 都视为用户可能输入的视频资源
  sensitiveMediaExtensions: ['.m3u8', '.mpd', '.mp4', '.m4s', '.ts', '.mov', '.webm'],
  // 需要丢弃的常见噪音错误 - 这些通常不是站点业务代码问题，避免浪费免费额度
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Script error.',
    'Non-Error promise rejection captured',
  ],
  // 需要忽略的脚本来源 - 浏览器扩展、插件脚本不属于本站代码
  denyUrls: [
    /extensions\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],
  // 需要丢弃的网络面包屑域名 - 广告、统计、Sentry 自身请求对业务排错价值低，且可能间接携带页面 URL
  // 注意：这里只影响 Sentry 后台的 breadcrumb 展示，不会影响 Google Analytics / AdSense 正常运行
  ignoredBreadcrumbHosts: [
    'google-analytics.com',
    'googletagmanager.com',
    'doubleclick.net',
    'googlesyndication.com',
    'pagead2.googlesyndication.com',
    'googleads.g.doubleclick.net',
    'sentry.io',
    'ingest.sentry.io',
    'ingest.de.sentry.io',
  ],
};
