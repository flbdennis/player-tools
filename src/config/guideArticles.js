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
      src: '/imgs/guide-screenshots/how-to-test-m3u8-stream-online.webp',
      width: 1602,
      height: 1500,
      alt: 'Screenshot of the MetisTools M3U8 Player testing a public HLS playlist with Playback Log events',
      caption: 'A browser-side M3U8 test keeps the playlist URL, playback state and diagnostic log in one view.',
    },
  },
  {
    slug: 'browser-video-format-support',
    href: '/guides/browser-video-format-support',
    category: 'Browser Support',
    title: 'M3U8, MP4 and DASH Browser Support: Chrome, Safari, Firefox and Edge',
    h1: 'M3U8, MP4 and DASH Browser Support',
    description:
      'Compare how M3U8/HLS, MP4 and MPEG-DASH playback behave across Chrome, Safari, Firefox and Edge, and learn which browser to test first.',
    summary:
      'A practical browser comparison for HLS/M3U8, MP4 and MPEG-DASH playback tests.',
    toolHref: '/m3u8-player',
    toolLabel: 'M3U8 Player Online',
    priority: 'P1',
    datePublished: '2026-06-04',
    dateModified: '2026-06-04',
    image: {
      src: '/imgs/guide-screenshots/how-to-test-m3u8-stream-online.webp',
      width: 1602,
      height: 1500,
      alt: 'Screenshot of browser-side video playback testing with MetisTools Playback Log events',
      caption: 'A browser-side test helps compare what the web player can load, decode and report for the same video source.',
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
      src: '/imgs/guide-screenshots/what-is-m3u8.webp',
      width: 1606,
      height: 802,
      alt: 'Screenshot of an M3U8 playlist URL loaded in the MetisTools M3U8 Player',
      caption: 'An M3U8 URL points the browser player to an HLS playlist, which then loads media for playback.',
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
      src: '/imgs/guide-screenshots/m3u8-works-in-vlc-but-not-browser.webp',
      width: 1598,
      height: 1038,
      alt: 'Screenshot of a browser-side M3U8 playback failure with Playback Log details',
      caption: 'A browser failure can expose different issues than VLC because web security, codecs and access rules apply.',
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
      src: '/imgs/guide-screenshots/fix-m3u8-cors-error.webp',
      width: 1528,
      height: 762,
      alt: 'Screenshot of the MetisTools Playback Log used to review browser-side HLS loading events',
      caption: 'Use the Playback Log as a browser-side clue, then confirm the exact playlist or segment response on the source server.',
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
      src: '/imgs/guide-screenshots/mp4-url-not-playing.webp',
      width: 1590,
      height: 1496,
      alt: 'Screenshot of the MetisTools MP4 Player testing a public MP4 URL with playback diagnostics',
      caption: 'A direct MP4 test checks whether the browser can load the media file, play it and record useful playback events.',
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
      src: '/imgs/guide-screenshots/mpd-test-online.webp',
      width: 1588,
      height: 1474,
      alt: 'Screenshot of the MetisTools DASH Player testing a public MPD manifest with Playback Log events',
      caption: 'A DASH test checks whether the browser can load the MPD manifest, render media and report playback events.',
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
