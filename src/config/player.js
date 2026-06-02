// 播放器公共配置 - 三个播放器页面和首页快速测试共用的授权提示、诊断说明和日志文案
// 目的：把涉及 SEO、AdSense、版权、隐私和 Playback Log 的共享文本集中维护，避免各页面话术不一致

export const playerShared = {
  // 授权与版权提示 - 全站统一用于首页 Quick Test 和三个播放器页的 PermissionNotice
  // 文案强调“公开或已授权链接”，同时提醒版权和服务条款，符合 AdSense 对原创/授权内容和用户信任的要求
  policyNotice:
    'Use only public or authorized video links for testing. Respect copyright, privacy, and the source website’s terms of service.',

  // Playback Log 标题下方说明 - 合并“日志用途”和“仅供参考”两段说明，减少重复文案并保持用户可读性
  // 文案避免关键词堆砌，直接说明日志用于浏览器侧播放诊断，且结果可能受浏览器、网络、CORS、CDN、DRM、权限和服务端影响
  playbackLogDescription:
    'Displays browser-side playback events and diagnostic records to help troubleshoot public or authorized video links. Results are for reference only and may be affected by browser support, network conditions, CORS rules, CDN behavior, DRM, source permissions, server availability, MIME type, codec support, and Range request handling. This tool does not bypass CORS, DRM, private access controls, copyright restrictions, or source website permissions.',

  // Playback Log 默认提示 - 日志尚未开始时显示在输出框内，解释日志等级并提醒复制报告会隐藏视频 URL
  playbackLogNotice:
    'Playback Diagnostic Log\nINFO = normal progress, SUCCESS = playback milestone, WARNING = possible issue, ERROR = playback failure.\nVideo URLs are hidden from copied reports for privacy.',

  // CORS 修复建议 - 只在日志诊断到浏览器跨域/访问策略风险时输出，不提供代理或绕过功能
  corsFixSuggestion:
    'If you own the source server, enable CORS for playlists, manifests, media files, and media segments. Allow this site origin for GET, HEAD, and OPTIONS requests, and expose Content-Length, Content-Range, and Accept-Ranges when Range requests are used.',

  // 访问限制边界说明 - 明确工具不会绕过 CORS/DRM/私有访问控制，降低版权和 AdSense 合规风险
  accessBoundaryNotice:
    'This tool does not bypass CORS, DRM, private access controls, copyright restrictions, token rules, or source website permissions.',
};
