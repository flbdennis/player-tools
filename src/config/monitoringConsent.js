import { getLocaleFromPath } from './nav.js';

// 可选错误监控提示文案 - 与广告/CMP 同意分开管理，后续新增日文或繁中时只扩展这里
export const monitoringConsentText = {
  en: {
    title: 'Optional Error Monitoring',
    description:
      'Off by default. If allowed, it helps diagnose JavaScript and player errors. Video URLs are filtered and replay is disabled.',
    detailsLabel: 'Learn more',
    details:
      'Essential local storage remembers this choice. Google ads and analytics consent is handled separately through Google-certified consent messages where required.',
    statusNotSelected: 'Current optional monitoring status: Not selected.',
    statusOn: 'Current optional monitoring status: On.',
    statusOff: 'Current optional monitoring status: Off.',
    allowDesktop: 'Allow Optional Monitoring',
    allowMobile: 'Allow',
    deny: 'Keep Off',
    privacyLink: 'Read Privacy Policy',
    privacyHref: '/privacy-policy',
  },
  zh: {
    title: '可选错误监控',
    description:
      '默认关闭。开启后仅用于诊断 JavaScript 和播放器错误；视频链接会被过滤，且不会启用会话回放。',
    detailsLabel: '了解更多',
    details:
      '必要的本地存储只用于记住这个选择。Google 广告和统计同意由需要地区的 Google 认证同意消息单独处理。',
    statusNotSelected: '当前可选监控状态：尚未选择。',
    statusOn: '当前可选监控状态：已开启。',
    statusOff: '当前可选监控状态：已关闭。',
    allowDesktop: '允许错误监控',
    allowMobile: '允许',
    deny: '保持关闭',
    privacyLink: '阅读隐私政策',
    privacyHref: '/zh/privacy-policy',
  },
};

export function getMonitoringConsentText(pathname = '/') {
  return monitoringConsentText[getLocaleFromPath(pathname)] || monitoringConsentText.en;
}
