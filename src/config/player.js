// 播放器公共配置 - 三个播放器页面和首页快速测试共用的授权提示、诊断说明和日志文案
// 目的：把涉及 SEO、AdSense、版权、隐私和 Playback Log 的共享文本集中维护，避免各页面话术不一致

export const playerShared = {
  // 授权与版权提示 - 全站统一用于首页 Quick Test 和三个播放器页的 PermissionNotice
  // 文案强调“公开或已授权链接”，同时提醒版权和服务条款，符合 AdSense 对原创/授权内容和用户信任的要求
  policyNotice:
    'Test only public or authorized video links. Respect copyright, privacy, and the source site’s terms.',

  // Playback Log 标题下方说明 - 合并“日志用途”和“仅供参考”两段说明，减少重复文案并保持用户可读性
  // 文案避免关键词堆砌，压缩为低高度提示，同时保留授权、诊断限制和不绕过权限的合规边界
  playbackLogDescription:
    'Logs browser-side playback events for public or authorized links. Results depend on browser, network, CORS, CDN, server, MIME/codec, Range and access settings; MetisTools does not bypass CORS, DRM, copyright or source permissions.',

  // Playback Log 可见短提示 - 详细限制放在问号提示中，避免日志区被长文案压高
  playbackLogShortDescription:
    'Logs browser-side playback events for authorized links.',

  // Embed 区可见短提示 - 核心合规边界必须默认可见，不能只隐藏在 tooltip 里
  embedShortNotice:
    'Embed public or authorized streams only.',

  // Embed 区问号提示 - 用人类可读的方式说明私有/签名 URL 的实际边界
  embedDetailNotice:
    'For private or signed URLs, use short-lived links and source-side access rules. The embed does not hide or proxy the video URL.',

  // Embed 敏感链接提示 - 当 URL 看起来包含 token、signature、expires 等参数时显示
  embedSensitiveNotice:
    'This looks like a private or signed URL. Use a short-lived link and remember viewers may still inspect media requests.',

  // Embed 当前链接缺失提示 - 用户选择带当前 URL 的 iframe 但输入框没有有效 URL 时显示
  embedMissingUrlNotice:
    'Paste a valid URL above to include it in the iframe, or use the empty player.',

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
