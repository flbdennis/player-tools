// Sentry 客户端初始化脚本 - 只在用户同意后由 MonitoringConsent 动态 import
// 本文件负责：初始化 Sentry、过滤敏感数据、避免上传用户输入的视频链接
import * as Sentry from '@sentry/browser';
import { sentrySettings } from '../config/sentry.js';

// 初始化状态标记 - 防止同一页面多次点击同意导致重复初始化
let sentryInitialized = false;

// 对外暴露初始化函数 - 只有用户同意错误监控后才调用
export function initSentry() {
  // 如果配置禁用或已经初始化，直接返回，避免重复注册全局错误监听
  if (!sentrySettings.enabled || sentryInitialized) return;

  Sentry.init({
    // Sentry 项目 DSN - 用于发送错误事件，不是私密 token
    dsn: sentrySettings.dsn,
    // 环境名称 - 用于后台筛选事件来源
    environment: sentrySettings.environment,
    // 发布版本 - 用于排查某次发布是否引入新错误
    release: sentrySettings.release,
    // 不发送默认 PII - 禁止自动携带用户身份类信息
    sendDefaultPii: false,
    // 第一阶段关闭性能追踪，避免增加首屏和免费额度压力
    tracesSampleRate: sentrySettings.tracesSampleRate,
    // 错误事件采样率 - 进入 beforeSend 后再做精细过滤
    sampleRate: sentrySettings.sampleRate,
    // 面包屑上限 - 降低 payload 体积和敏感上下文风险
    maxBreadcrumbs: sentrySettings.maxBreadcrumbs,
    // 常见噪音错误忽略列表 - 减少免费额度浪费
    ignoreErrors: sentrySettings.ignoreErrors,
    // 浏览器插件脚本来源忽略列表 - 避免把扩展错误归因到本站
    denyUrls: sentrySettings.denyUrls,
    // 事件发送前最终过滤器 - 必须删除 URL、token、cookie、header 等敏感信息
    beforeSend(event) {
      return sanitizeSentryEvent(event);
    },
    // 面包屑发送前过滤器 - 避免点击、console、xhr 等记录中带入视频 URL
    beforeBreadcrumb(breadcrumb) {
      return sanitizeBreadcrumb(breadcrumb);
    },
  });

  sentryInitialized = true;
  Sentry.addBreadcrumb({
    category: 'monitoring',
    level: 'info',
    message: 'Sentry error monitoring enabled after user consent',
  });
}

// 对外暴露测试函数 - 仅用于本地验证 Sentry 是否能收到错误，不在页面中自动调用
export function throwSentryTestError() {
  throw new Error('MetisTools Sentry test error');
}

// 清洗 Sentry 事件 - 保留错误定位需要的信息，移除用户视频 URL 和敏感字段
function sanitizeSentryEvent(event) {
  if (!event) return event;

  // request.url 可能包含 ?url= 或用户粘贴的视频地址，保留页面路径但移除 query/hash
  if (event.request?.url) {
    event.request.url = sanitizeRequestUrl(event.request.url);
  }

  // headers 里不能保留 cookie、authorization、set-cookie 等敏感信息
  if (event.request?.headers) {
    event.request.headers = sanitizeHeaders(event.request.headers);
  }

  // cookies/data/query_string 可能包含用户输入内容，直接清洗或删除
  if (event.request) {
    delete event.request.cookies;
    event.request.data = sanitizeValue(event.request.data);
    event.request.query_string = sanitizeString(event.request.query_string);
  }

  // user 字段只保留最少信息；不允许 email、ip、username 进入 Sentry
  if (event.user) {
    delete event.user.email;
    delete event.user.ip_address;
    delete event.user.username;
  }

  // breadcrumbs 需要再次应用丢弃规则，防止某些自动面包屑绕过 beforeBreadcrumb 后进入事件
  event.breadcrumbs = Array.isArray(event.breadcrumbs)
    ? event.breadcrumbs.map((breadcrumb) => sanitizeBreadcrumb(breadcrumb)).filter(Boolean)
    : sanitizeValue(event.breadcrumbs);

  // extra、contexts、tags 都可能带 URL，统一递归清洗
  event.extra = sanitizeValue(event.extra);
  event.contexts = sanitizeValue(event.contexts);
  event.tags = sanitizeValue(event.tags);
  event.message = sanitizeString(event.message);

  // exception value / stacktrace 中也可能包含 URL，统一清洗
  if (event.exception?.values) {
    event.exception.values = event.exception.values.map((exception) => sanitizeValue(exception));
  }

  return event;
}

// 清洗面包屑 - 保留行为类别，但过滤 message、data、url 等可能包含用户输入的字段
function sanitizeBreadcrumb(breadcrumb) {
  if (!breadcrumb) return breadcrumb;

  // 丢弃广告、统计、Sentry 自身的网络请求面包屑，避免把 GA/Ads 请求中的页面 URL 间接带进 Sentry
  if (shouldDropBreadcrumb(breadcrumb)) {
    return null;
  }

  return {
    ...breadcrumb,
    message: sanitizeString(breadcrumb.message),
    data: sanitizeBreadcrumbData(breadcrumb.data),
  };
}

// 判断是否需要丢弃某条面包屑 - 主要用于过滤 GA/Ads/Sentry ingest 这类低价值网络记录
function shouldDropBreadcrumb(breadcrumb) {
  const candidates = [
    breadcrumb.message,
    breadcrumb.data?.url,
    breadcrumb.data?.href,
    breadcrumb.data?.request?.url,
  ].filter(Boolean);

  return candidates.some((candidate) => isIgnoredBreadcrumbUrl(candidate));
}

// 判断 URL 是否来自应该忽略的第三方监控/广告/统计域名
function isIgnoredBreadcrumbUrl(value) {
  if (typeof value !== 'string') return false;

  try {
    const parsedUrl = new URL(value);
    const host = parsedUrl.hostname.toLowerCase();
    return sentrySettings.ignoredBreadcrumbHosts.some((ignoredHost) => {
      const normalizedIgnoredHost = ignoredHost.toLowerCase();
      return host === normalizedIgnoredHost || host.endsWith(`.${normalizedIgnoredHost}`);
    });
  } catch {
    const lowerValue = value.toLowerCase();
    return sentrySettings.ignoredBreadcrumbHosts.some((ignoredHost) => lowerValue.includes(ignoredHost.toLowerCase()));
  }
}

// 清洗面包屑 data - URL 字段用更严格的 request URL 规则，其他字段继续递归清洗
function sanitizeBreadcrumbData(data) {
  if (!data || typeof data !== 'object') return sanitizeValue(data);

  const sanitizedData = sanitizeValue(data);
  // navigation breadcrumb 会记录 from/to，里面可能出现 /m3u8-player?url=...
  // 这些字段不需要保留 query，只保留页面路径即可，避免在 Sentry 中出现 ?url=[filtered]
  ['url', 'href', 'requestUrl', 'from', 'to'].forEach((key) => {
    if (typeof sanitizedData?.[key] === 'string') {
      sanitizedData[key] = sanitizeRequestUrl(sanitizedData[key]);
    }
  });

  return sanitizedData;
}

// 清洗 headers - 删除所有认证和 cookie 相关字段
function sanitizeHeaders(headers) {
  const sanitizedHeaders = {};

  Object.entries(headers || {}).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase();
    if (['cookie', 'set-cookie', 'authorization', 'proxy-authorization', 'x-api-key'].includes(normalizedKey)) {
      sanitizedHeaders[key] = '[filtered]';
      return;
    }

    // Referer/Referrer 最容易带上 ?url= 视频链接，统一保留路径并移除 query/hash
    if (['referer', 'referrer'].includes(normalizedKey) && typeof value === 'string') {
      sanitizedHeaders[key] = sanitizeRequestUrl(value);
      return;
    }

    sanitizedHeaders[key] = sanitizeString(value);
  });

  return sanitizedHeaders;
}

// 递归清洗任意对象 - 控制深度，避免异常对象过大或循环引用
function sanitizeValue(value, depth = 0) {
  if (depth > 6) return '[filtered-depth]';
  if (typeof value === 'string') return sanitizeString(value);
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, depth + 1));

  const sanitizedObject = {};
  Object.entries(value).forEach(([key, item]) => {
    const normalizedKey = key.toLowerCase();

    // token/cookie/auth 等字段必须整项替换，避免敏感值进入 Sentry
    if (shouldDropWholeField(normalizedKey)) {
      sanitizedObject[key] = '[filtered]';
      return;
    }

    // url/src/source 等字段不能直接整项过滤，否则会把 Sentry 的错误标题、value、culture 等正常字段误伤
    // 这里只清洗字段值中的视频链接和敏感 query，保留对象结构和普通错误 message
    if (isUrlLikeField(normalizedKey) && typeof item === 'string') {
      sanitizedObject[key] = sanitizeUrlLikeValue(normalizedKey, item);
      return;
    }

    sanitizedObject[key] = sanitizeValue(item, depth + 1);
  });

  return sanitizedObject;
}

// 清洗 URL 类字段 - 页面 URL 保留路径并移除 query/hash，媒体 URL 过滤成占位符
function sanitizeUrlLikeValue(key, value) {
  if (['url', 'href', 'referrer', 'referer'].includes(key)) {
    return sanitizeRequestUrl(value);
  }

  return sanitizeString(value);
}

// 清洗 request/referrer/page/navigation URL - 保留页面路径，删除 query/hash，避免 ?url= 泄露视频地址
function sanitizeRequestUrl(value) {
  if (typeof value !== 'string' || !value) return value;

  const isAbsoluteUrl = /^https?:\/\//i.test(value);
  const isRootRelativeUrl = value.startsWith('/');

  try {
    // Sentry 的 navigation breadcrumb 常用相对路径，例如 /m3u8-player?url=...
    // URL 构造器需要 base 才能解析相对路径，因此这里统一补一个临时域名
    const parsedUrl = new URL(value, 'https://metistools.local');
    const path = parsedUrl.pathname.toLowerCase();

    // 只有当 URL 自身路径就是媒体资源时才整条过滤；页面 URL 的 ?url= 参数只删除 query，不丢失页面路径
    if (sentrySettings.sensitiveMediaExtensions.some((extension) => path.includes(extension))) {
      return '[filtered-url]';
    }

    // 绝对 URL 用于 request.url / Referer，保留 origin + pathname；相对 URL 用于 navigation from/to，只保留 pathname
    if (isAbsoluteUrl) {
      parsedUrl.search = '';
      parsedUrl.hash = '';
      return parsedUrl.toString();
    }

    if (isRootRelativeUrl) {
      return parsedUrl.pathname || '/';
    }

    return sanitizeString(value);
  } catch {
    return sanitizeString(value);
  }
}

// 清洗字符串 - 过滤完整视频 URL、敏感 query 参数和 token 类内容
function sanitizeString(value) {
  if (typeof value !== 'string' || !value) return value;

  let output = value;

  // 先处理完整 URL：如果 URL 是媒体资源或带敏感参数，则替换为 [filtered-url]
  output = output.replace(/https?:\/\/[^\s"'<>]+/gi, (matchedUrl) => {
    if (isSensitiveUrl(matchedUrl)) return '[filtered-url]';
    return sanitizeUrlQuery(matchedUrl);
  });

  // 再处理裸 query 字符串中的敏感字段，例如 ?url=xxx 或 &token=xxx
  sentrySettings.sensitiveQueryKeys.forEach((key) => {
    const pattern = new RegExp(`([?&]${escapeRegExp(key)}=)[^&\\s]+`, 'gi');
    output = output.replace(pattern, '$1[filtered]');
  });

  return output;
}

// 判断是否要整项删除字段值 - 只针对明确敏感字段，不使用 includes('u') 这种容易误伤的规则
function shouldDropWholeField(key) {
  const exactSensitiveKeys = new Set([
    'token',
    'auth',
    'authorization',
    'proxy-authorization',
    'signature',
    'sig',
    'session',
    'cookie',
    'password',
    'secret',
    'credential',
    'api_key',
    'apikey',
    'x-api-key',
  ]);

  if (exactSensitiveKeys.has(key)) return true;

  // 只对较长的敏感词使用包含匹配，避免 culture/value/user 等正常字段被误过滤
  return [
    'token',
    'authorization',
    'signature',
    'password',
    'secret',
    'credential',
    'cookie',
  ].some((part) => key.includes(part));
}

// 判断是否是 URL 类字段 - URL 类字段只清洗字符串内容，不整项删除
function isUrlLikeField(key) {
  return sentrySettings.sensitiveFieldKeys.includes(key);
}

// 判断 query 参数名是否敏感 - query 参数允许更严格，因为这是 URL 参数而不是对象结构字段
function isSensitiveQueryKey(key) {
  const normalizedKey = key.toLowerCase();
  if (sentrySettings.sensitiveQueryKeys.includes(normalizedKey)) return true;

  return [
    'token',
    'auth',
    'authorization',
    'signature',
    'expires',
    'expire',
    'policy',
    'session',
    'cookie',
    'password',
    'secret',
    'credential',
  ].some((part) => normalizedKey.includes(part));
}

// 判断 URL 是否敏感 - 媒体后缀、视频参数、鉴权参数都属于敏感
function isSensitiveUrl(url) {
  const lowerUrl = url.toLowerCase();
  if (sentrySettings.sensitiveMediaExtensions.some((extension) => lowerUrl.includes(extension))) return true;

  try {
    const parsedUrl = new URL(url);
    return Array.from(parsedUrl.searchParams.keys()).some((key) => isSensitiveQueryKey(key));
  } catch {
    return false;
  }
}

// 清洗普通页面 URL 的 query 参数 - 保留页面路径，删除敏感参数值
function sanitizeUrlQuery(url) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.forEach((_, key) => {
      if (isSensitiveQueryKey(key)) {
        parsedUrl.searchParams.set(key, '[filtered]');
      }
    });
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

// 转义正则字符串 - 用于动态生成 query 参数过滤规则
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
