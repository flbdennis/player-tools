// Guide 文章配置 - 统一管理文章元信息、内链入口和目录页展示，避免页面间重复硬编码
// 日期维护规则：dateModified 只在文章内容发生实质修改时手动更新；不要因为构建、提交、格式调整或批量同步而更新。
export const guideArticles = [
  {
    slug: 'how-to-test-m3u8-stream-online',
    href: '/guides/how-to-test-m3u8-stream-online',
    category: 'M3U8 / HLS',
    title: 'How to Test an M3U8 Stream Online',
    h1: 'How to Test an M3U8 Stream Online',
    description:
      'Learn how to test a public or authorized M3U8 stream online, check browser playback, read playback events and avoid common HLS testing mistakes.',
    summary:
      'A practical first test for HLS playlists, browser playback, Playback Log clues and access limits.',
    toolHref: '/m3u8-player',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-05-30',
    dateModified: '2026-05-30',
    image: {
      src: '/imgs/m3u8_1.webp',
      width: 1558,
      height: 1086,
      alt: 'Illustration of an M3U8 browser playback test with playback log context',
      caption: 'Use a direct M3U8 playlist URL, then compare browser playback events with source server evidence.',
    },
  },
  {
    slug: 'what-is-m3u8',
    href: '/guides/what-is-m3u8',
    category: 'M3U8 / HLS',
    title: 'What Is an M3U8 File?',
    h1: 'What Is an M3U8 File?',
    description:
      'Understand what an M3U8 file is, how it works with HLS streaming, why playlists use media segments and how to test one safely in a browser.',
    summary:
      'A plain-English explanation of M3U8 playlists, HLS segments, variants and safe testing boundaries.',
    toolHref: '/m3u8-player',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-05-29',
    dateModified: '2026-05-29',
    image: {
      src: '/imgs/m3u8_2.webp',
      width: 1448,
      height: 1086,
      alt: 'Illustration of an HLS playlist structure for M3U8 testing',
      caption: 'An M3U8 playlist works as a map: the browser must load playlists, variants and media segments.',
    },
  },
  {
    slug: 'm3u8-works-in-vlc-but-not-browser',
    href: '/guides/m3u8-works-in-vlc-but-not-browser',
    category: 'M3U8 / HLS',
    title: 'Why an M3U8 Stream Works in VLC but Not in the Browser',
    h1: 'Why an M3U8 Stream Works in VLC but Not in the Browser',
    description:
      'Compare VLC and browser HLS playback, including CORS, MediaSource support, codecs, mixed content, token rules and DRM-related limits.',
    summary:
      'A common HLS troubleshooting guide for streams that play in VLC but fail in web players.',
    toolHref: '/m3u8-player',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-06-01',
    dateModified: '2026-06-01',
    image: {
      src: '/imgs/m3u8_3.webp',
      width: 1448,
      height: 1086,
      alt: 'Illustration comparing browser playback checks with desktop media player checks',
      caption: 'Browser playback is stricter than desktop playback because CORS, codecs and MediaSource rules apply.',
    },
  },
  {
    slug: 'fix-m3u8-cors-error',
    href: '/guides/fix-m3u8-cors-error',
    category: 'M3U8 / HLS',
    title: 'How to Fix M3U8 CORS Errors',
    h1: 'How to Fix M3U8 CORS Errors',
    description:
      'Learn why M3U8 CORS errors happen in browsers and what stream owners can check in playlist, segment, key and CDN responses.',
    summary:
      'A careful CORS guide for stream owners, with browser-safe checks and no bypass advice.',
    toolHref: '/m3u8-player',
    toolLabel: 'M3U8 Player Online',
    priority: 'P0',
    datePublished: '2026-05-31',
    dateModified: '2026-05-31',
    image: {
      src: '/imgs/m3u8_4.webp',
      width: 1448,
      height: 1086,
      alt: 'Illustration of reviewing M3U8 CORS responses across playlist and segment requests',
      caption: 'For HLS CORS troubleshooting, check the first playlist, variant playlists, segments and key files.',
    },
  },
  {
    slug: 'mp4-url-not-playing',
    href: '/guides/mp4-url-not-playing',
    category: 'MP4',
    title: 'Why an MP4 URL May Not Play in the Browser',
    h1: 'Why an MP4 URL May Not Play in the Browser',
    description:
      'Troubleshoot MP4 URL playback issues in the browser, including MIME type, codec support, Range requests, expired links and server access rules.',
    summary:
      'A practical guide for direct MP4 links that fail in online players or browser video elements.',
    toolHref: '/mp4-player',
    toolLabel: 'MP4 Player Online',
    priority: 'P1',
    datePublished: '2026-06-02',
    dateModified: '2026-06-02',
    image: {
      src: '/imgs/mp4_1.webp',
      width: 1254,
      height: 1254,
      alt: 'Illustration of testing a direct MP4 URL in a browser player',
      caption: 'A direct MP4 URL needs a real video response, browser-supported codecs and useful server headers.',
    },
  },
  {
    slug: 'mpd-test-online',
    href: '/guides/mpd-test-online',
    category: 'DASH / MPD',
    title: 'How to Test an MPD Manifest Online',
    h1: 'How to Test an MPD Manifest Online',
    description:
      'Learn how to test a public or authorized MPEG-DASH MPD manifest online and review common manifest, segment, codec, DRM and CORS issues.',
    summary:
      'A focused guide for MPEG-DASH manifests, MPD playback checks and browser-side limitations.',
    toolHref: '/dash-player',
    toolLabel: 'MPEG-DASH Player',
    priority: 'P1',
    datePublished: '2026-06-03',
    dateModified: '2026-06-03',
    image: {
      src: '/imgs/dash_1.webp',
      width: 1448,
      height: 1086,
      alt: 'Illustration of testing an MPEG-DASH MPD manifest and segment requests',
      caption: 'A DASH test checks the MPD manifest plus initialization and media segment access.',
    },
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
