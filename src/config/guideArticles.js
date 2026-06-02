// Guide 文章配置 - 统一管理文章元信息、内链入口和目录页展示，避免页面间重复硬编码
export const guideArticles = [
  {
    slug: 'how-to-test-m3u8-stream-online',
    href: '/guides/how-to-test-m3u8-stream-online/',
    category: 'M3U8 / HLS',
    title: 'How to Test an M3U8 Stream Online',
    h1: 'How to Test an M3U8 Stream Online',
    description:
      'Learn how to test a public or authorized M3U8 stream online, check browser playback, read playback events and avoid common HLS testing mistakes.',
    summary:
      'A practical first test for HLS playlists, browser playback, Playback Log clues and access limits.',
    toolHref: '/m3u8-player/',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
  {
    slug: 'what-is-m3u8',
    href: '/guides/what-is-m3u8/',
    category: 'M3U8 / HLS',
    title: 'What Is an M3U8 File?',
    h1: 'What Is an M3U8 File?',
    description:
      'Understand what an M3U8 file is, how it works with HLS streaming, why playlists use media segments and how to test one safely in a browser.',
    summary:
      'A plain-English explanation of M3U8 playlists, HLS segments, variants and safe testing boundaries.',
    toolHref: '/m3u8-player/',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
  {
    slug: 'm3u8-works-in-vlc-but-not-browser',
    href: '/guides/m3u8-works-in-vlc-but-not-browser/',
    category: 'M3U8 / HLS',
    title: 'Why an M3U8 Stream Works in VLC but Not in the Browser',
    h1: 'Why an M3U8 Stream Works in VLC but Not in the Browser',
    description:
      'Compare VLC and browser HLS playback, including CORS, MediaSource support, codecs, mixed content, token rules and DRM-related limits.',
    summary:
      'A common HLS troubleshooting guide for streams that play in VLC but fail in web players.',
    toolHref: '/m3u8-player/',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
  {
    slug: 'fix-m3u8-cors-error',
    href: '/guides/fix-m3u8-cors-error/',
    category: 'M3U8 / HLS',
    title: 'How to Fix M3U8 CORS Errors',
    h1: 'How to Fix M3U8 CORS Errors',
    description:
      'Learn why M3U8 CORS errors happen in browsers and what stream owners can check in playlist, segment, key and CDN responses.',
    summary:
      'A careful CORS guide for stream owners, with browser-safe checks and no bypass advice.',
    toolHref: '/m3u8-player/',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
  {
    slug: 'mp4-url-not-playing',
    href: '/guides/mp4-url-not-playing/',
    category: 'MP4',
    title: 'Why an MP4 URL May Not Play in the Browser',
    h1: 'Why an MP4 URL May Not Play in the Browser',
    description:
      'Troubleshoot MP4 URL playback issues in the browser, including MIME type, codec support, Range requests, expired links and server access rules.',
    summary:
      'A practical guide for direct MP4 links that fail in online players or browser video elements.',
    toolHref: '/mp4-player/',
    toolLabel: 'MP4 Player Online',
    priority: 'P1',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
  {
    slug: 'mpd-test-online',
    href: '/guides/mpd-test-online/',
    category: 'DASH / MPD',
    title: 'How to Test an MPD Manifest Online',
    h1: 'How to Test an MPD Manifest Online',
    description:
      'Learn how to test a public or authorized MPEG-DASH MPD manifest online and review common manifest, segment, codec, DRM and CORS issues.',
    summary:
      'A focused guide for MPEG-DASH manifests, MPD playback checks and browser-side limitations.',
    toolHref: '/dash-player/',
    toolLabel: 'MPEG-DASH Player',
    priority: 'P1',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
  },
];

export const getGuideArticle = (slug) => guideArticles.find((article) => article.slug === slug);

export const getRelatedGuides = (slug, limit = 3) => {
  const current = getGuideArticle(slug);
  const sameCategory = guideArticles.filter(
    (article) => article.slug !== slug && article.category === current?.category
  );
  const otherArticles = guideArticles.filter(
    (article) => article.slug !== slug && article.category !== current?.category
  );
  return [...sameCategory, ...otherArticles].slice(0, limit);
};
