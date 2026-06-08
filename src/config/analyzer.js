import { playerShared } from './player.js';

// Analyzer 页面配置 - 页面只负责组合组件，SEO、文案、FAQ 和工具说明全部集中在这里
export const analyzerPage = {
  seo: {
    title: 'M3U8 Analyzer Online - HLS Playlist, MPD Parser & MP4 Link Checker',
    description:
      'Use a browser-based M3U8 analyzer to inspect HLS playlists, MPD manifests and MP4 links. Check variants, segments, CORS, token and playback issues without downloading media.',
  },
  breadcrumb: [
    { label: 'Home', href: '/' },
    { label: 'M3U8 Analyzer', href: '/m3u8-analyzer' },
  ],
  hero: {
    title: 'M3U8 Analyzer Online',
    description:
      'Analyze HLS playlists, DASH MPD manifests and MP4 links in your browser. Check variants, segments, protection markers, CORS signals, tokens and common playback problems before you test or share a stream.',
    // Analyzer 暂用现有 M3U8 素材占位，后续有专用插图再替换
    image: '/imgs/m3u8_2.webp',
    imageAlt: '3D playlist file illustration for M3U8, HLS and MPD manifest analysis',
    imageWidth: 1448,
    imageHeight: 1086,
    imageLayout: {
      mobile: {
        width: '142px',
        height: 'auto',
        right: '-8px',
        top: '42px',
        bottom: 'auto',
        zIndex: '20',
        opacity: '0.96',
        cardPaddingRight: '118px',
        sectionHeight: '194px',
        cardMinHeight: '158px',
      },
      desktop: {
        width: '300px',
        height: 'auto',
        right: '-16px',
        top: '-24px',
        zIndex: '20',
        opacity: '1',
      },
    },
  },
  tabs: [
    { id: 'm3u8', label: 'M3U8 Player', href: '/m3u8-player' },
    { id: 'mp4', label: 'MP4 Player', href: '/mp4-player' },
    { id: 'dash', label: 'DASH Player', href: '/dash-player' },
    { id: 'analyzer', label: 'Analyzer', href: '/m3u8-analyzer' },
  ],
  analyzer: {
    policyHint: playerShared.policyNotice,
    modes: [
      {
        label: 'M3U8',
        value: 'm3u8',
        icon: 'ListVideo',
        description: 'HLS playlists, variants and media segments.',
      },
      {
        label: 'MPD',
        value: 'mpd',
        icon: 'FileCode2',
        description: 'DASH manifests, representations and protection markers.',
      },
      {
        label: 'MP4',
        value: 'mp4',
        icon: 'FileVideo',
        description: 'Direct MP4 link response and browser access checks.',
      },
    ],
    input: {
      urlLabel: 'Stream URL',
      urlPlaceholder: 'https://example.com/stream.m3u8',
      urlPlaceholders: {
        m3u8: 'https://example.com/stream.m3u8',
        mpd: 'https://example.com/manifest.mpd',
        mp4: 'https://example.com/video.mp4',
      },
      urlHint: 'Paste an authorized M3U8, MPD, or MP4 URL. Browser checks still follow CORS, tokens, and source rules.',
      textLabel: 'Advanced Input',
      textPlaceholder: '#EXTM3U\n#EXT-X-VERSION:3\n#EXTINF:6.0,\nsegment-1.ts',
      textHint: 'Paste raw M3U8 playlist text or MPD XML here when the browser cannot fetch the URL.',
      advancedSummary: 'Advanced input: paste M3U8 / MPD raw text',
      buttonLabel: 'Analyze Manifest',
      buttonLabels: {
        m3u8: 'Analyze Manifest',
        mpd: 'Analyze Manifest',
        mp4: 'Check MP4 Link',
      },
      sampleLabel: 'Load Sample',
      clearLabel: 'Clear',
    },
    segmentCheck: {
      title: 'Segment Check',
      smartLabel: 'Smart Check',
      allLabel: 'Check All Segments',
      copyFailedLabel: 'Copy Failed List',
      smartNote:
        'Smart check is not a full segment scan. It is only used to quickly identify obvious link, segment, or access permission issues.',
      unavailable: 'No direct segment URLs are ready to check yet.',
    },
    log: {
      title: 'Analyzer Log',
      description:
        'Logs browser-side analyzer events for public or authorized links. Results depend on browser, network, CORS, CDN, server, MIME, response headers and access settings; MetisTools does not bypass CORS, DRM, copyright or source permissions.',
      shortDescription: 'Logs browser-side analyzer events for authorized links.',
      readyStatus: 'Status: Ready.',
      readyInstruction: 'Paste a public or authorized link or manifest text, then run the analyzer.',
      dragHint: 'Drag the lower-left corner to expand the log area and review more analyzer lines.',
      clearLabel: 'Clear Log',
      copyLabel: 'Copy Log',
      empty: 'Analyzer events will appear here after you run a check.',
    },
    results: {
      title: 'Analysis Result',
      emptyTitle: 'Ready to analyze a stream manifest',
      emptyDescription: 'Choose a mode, paste a URL or raw manifest text, then run the analyzer.',
      fetching: 'Fetching manifest in your browser...',
      parsing: 'Parsing manifest text...',
      fetchFailed: 'The browser could not fetch this URL. Paste the manifest text directly, or check CORS, access tokens and network rules.',
    },
    samples: {
      m3u8: [
        '#EXTM3U',
        '#EXT-X-VERSION:3',
        '#EXT-X-TARGETDURATION:6',
        '#EXT-X-MEDIA-SEQUENCE:0',
        '#EXTINF:6.0,',
        'segment-0001.ts',
        '#EXTINF:6.0,',
        'segment-0002.ts',
        '#EXT-X-ENDLIST',
      ].join('\n'),
      mpd: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<MPD type="static" mediaPresentationDuration="PT12S" minBufferTime="PT2S" xmlns="urn:mpeg:dash:schema:mpd:2011">',
        '  <Period>',
        '    <AdaptationSet mimeType="video/mp4" codecs="avc1.4d401f">',
        '      <Representation id="video-720p" bandwidth="1800000" width="1280" height="720">',
        '        <BaseURL>video-720p.mp4</BaseURL>',
        '      </Representation>',
        '    </AdaptationSet>',
        '  </Period>',
        '</MPD>',
      ].join('\n'),
      mp4: 'https://vjs.zencdn.net/v/oceans.mp4',
    },
  },
  guide: {
    title: 'How to Use the Analyzer',
    steps: [
      {
        icon: 'MousePointerClick',
        title: 'Choose the right mode',
        description: 'Use M3U8 Analyzer for .m3u8 playlists, MPD Analyzer for DASH XML manifests, and MP4 Checker for direct .mp4 links.',
      },
      {
        icon: 'Link',
        title: 'Paste the URL first',
        description: 'A URL lets the analyzer resolve relative segment paths, so segment checks can test the real media URLs instead of only reading text.',
      },
      {
        icon: 'FileText',
        title: 'Use raw text when the URL is blocked',
        description: 'If the browser cannot fetch the manifest because of CORS, login, token or network rules, paste the raw M3U8 or MPD text into Advanced Input.',
      },
      {
        icon: 'SearchCheck',
        title: 'Read the conclusion first',
        description: 'The top card tells you whether the basic structure looks normal, whether there are likely playback issues, or whether the input cannot be analyzed.',
      },
      {
        icon: 'ListChecks',
        title: 'Check the six key fields',
        description: 'Focus on type, duration, rendition count, segment count, audio tracks and protection status before opening advanced technical details.',
      },
      {
        icon: 'Gauge',
        title: 'Run Smart Check before Check All',
        description: 'Smart Check samples segments for a quick signal. Check All Segments is heavier and should be used only when you need a full access scan.',
      },
      {
        icon: 'Shield',
        title: 'Respect access boundaries',
        description: 'The analyzer does not bypass DRM, login, token, geo, CORS, copyright restrictions or source website permissions.',
      },
    ],
  },
  infoCards: [
    {
      title: 'What This M3U8 and HLS Playlist Analyzer Checks',
      image: '/imgs/m3u8_3.webp',
      imageAlt: 'Placeholder online video checklist illustration for stream manifest analysis',
      bullets: [
        'Checks whether an M3U8 playlist is a master playlist, a media playlist, or malformed text that is likely to fail.',
        'Shows HLS variants, media segments, target duration, estimated duration, audio declarations, key tags and discontinuities.',
        'Works as a practical MPD parser for DASH manifests by reading periods, adaptation sets, representations, SegmentURL items and protection markers.',
        'Checks direct MP4 links with browser-safe response metadata when the source server allows CORS access.',
      ],
    },
    {
      title: 'Common M3U8, HLS and MPD Manifest Warnings',
      image: '/imgs/dash_2.webp',
      imageAlt: 'Placeholder MPD manifest illustration for stream analyzer warnings',
      bullets: [
        'Missing #EXTM3U, missing segments, invalid XML, empty MPD documents or missing representations can prevent playback.',
        'EXT-X-KEY tags, SAMPLE-AES markers or DASH ContentProtection elements usually mean the stream needs keys, licenses or protected access.',
        'Live playlists without ENDLIST and dynamic MPD manifests can be valid, but they should be tested differently from VOD files.',
        'Segment failures such as 403, 404, timeouts or CORS blocks usually mean the manifest is readable but the media files are not accessible from this browser.',
      ],
    },
    {
      title: 'Analyzer Boundaries: Browser Checks, CORS and Protected Streams',
      image: '/imgs/m3u8_1.webp',
      imageAlt: 'Placeholder browser-based tool illustration for analyzer access boundaries',
      bullets: [
        'Parsing runs in your browser and is designed for public or authorized URLs and manifest text.',
        'Browser checks still follow CORS, tokens, login rules and source-server permissions, so private or signed links may fail.',
        'This is a video stream analyzer, not a downloader. It does not download, convert, merge, decrypt or redistribute media content.',
        'Smart Check is a sample scan. Use Check All Segments only when a full segment access review is worth the extra browser requests.',
      ],
    },
  ],
  faq: {
    title: 'M3U8 Analyzer FAQ',
    idPrefix: 'analyzer-faq',
    items: [
      {
        question: 'What is an M3U8 analyzer?',
        answer:
          'An M3U8 analyzer reads an HLS playlist and shows practical details such as variants, segment count, duration, key tags and common browser playback issues.',
      },
      {
        question: 'Can this tool parse MPD manifests?',
        answer:
          'Yes. The MPD parser checks DASH manifests for representations, duration, SegmentURL entries, SegmentTemplate markers and content protection signals when they are present.',
      },
      {
        question: 'Can it check MP4 links?',
        answer:
          'Yes. MP4 Checker sends a browser-safe HEAD request and reports response status, content type, file size when exposed, byte-range support and likely playback warnings.',
      },
      {
        question: 'Is this analyzer the same as a downloader?',
        answer:
          'No. It is a browser-based video stream analyzer. It checks playlist and link metadata, but it does not download, merge, convert, decrypt or bypass access controls.',
      },
      {
        question: 'Why can a URL fail while pasted manifest text works?',
        answer:
          'A browser fetch must follow CORS, token, login, geo and network rules. Pasted text can be parsed locally even when the source URL blocks browser access.',
      },
      {
        question: 'Can it analyze encrypted HLS or DRM DASH streams?',
        answer:
          'It can detect encryption tags and content protection markers, but it does not request keys, request licenses, decrypt media or bypass access controls.',
      },
      {
        question: 'Which analyzer should I choose?',
        answer:
          'Choose M3U8 Analyzer for .m3u8 playlists, MPD Analyzer for XML documents whose root element is MPD, and MP4 Checker for direct .mp4 links.',
      },
      {
        question: 'What is Smart Check?',
        answer:
          'Smart Check samples segment URLs instead of checking every segment by default. It checks all segments when there are 10 or fewer, the first 10 when there are 11 to 60, and the first 5, middle 5 and last 5 when there are more than 60.',
      },
      {
        question: 'Why not check every segment automatically?',
        answer:
          'Large playlists can contain many media files. Checking all of them by default can be slow, noisy and unnecessary. Smart Check gives a fast first signal, while Check All Segments stays available for deeper troubleshooting.',
      },
    ],
  },
};
