// 独立 FAQ 页面配置 - 不复用首页 FAQ，避免重复内容并提升审核可读性
export const faqPageGroups = [
  {
    title: 'M3U8 and HLS',
    items: [
      {
        question: 'What is the best way to test an M3U8 stream online?',
        answer:
          'Use the direct .m3u8 playlist URL, make sure you are allowed to test it, then open it in the M3U8 Player Online. A browser test can show playlist loading, segment access, CORS behavior and playback errors that desktop players may not reveal.',
      },
      {
        question: 'Can MetisTools play every HLS stream?',
        answer:
          'No. Playback depends on browser support, stream packaging, codecs, CORS headers, segment availability, token rules and whether the stream requires DRM or a private player flow.',
      },
      {
        question: 'Why does an M3U8 stream work in VLC but fail here?',
        answer:
          'VLC is a desktop application and does not follow the same browser security model. Browser playback can fail because of CORS, MediaSource support, mixed content, unsupported codecs, signed URLs or DRM requirements.',
      },
      {
        question: 'Does MetisTools fix M3U8 CORS errors?',
        answer:
          'MetisTools can help identify likely CORS-related playback failures, but it does not bypass CORS. If you own the source, fix CORS on your origin, CDN or storage service for the playlist, variants, segments and key files.',
      },
      {
        question: 'Can I test a private or signed M3U8 URL?',
        answer:
          'Only test private or signed URLs if you own them or are authorized to use them. Some private links expire quickly or require cookies, referrer rules, IP restrictions or an authenticated player environment.',
      },
    ],
  },
  {
    title: 'MP4 Playback',
    items: [
      {
        question: 'Why does an MP4 URL not play in the browser?',
        answer:
          'Common causes include an expired URL, an HTML page returned instead of video, the wrong MIME type, unsupported codecs, missing Range request support, CORS restrictions or private access rules.',
      },
      {
        question: 'Is the MP4 Player Online a downloader or converter?',
        answer:
          'No. It is a browser playback test for direct MP4 URLs. It does not download, convert, capture, copy or redistribute video content.',
      },
      {
        question: 'What does “No video with supported format and MIME type found” mean?',
        answer:
          'It usually means the browser cannot use the response as playable video. Check whether the server returns a real MP4 file, a suitable MIME type and codecs supported by the browser and device.',
      },
      {
        question: 'Why are Range requests important for MP4 playback?',
        answer:
          'Browsers often use byte Range requests to load metadata, buffer efficiently and seek inside larger MP4 files. If the server or CDN does not support them correctly, playback or seeking may fail.',
      },
    ],
  },
  {
    title: 'MPEG-DASH and MPD',
    items: [
      {
        question: 'What is an MPD manifest?',
        answer:
          'An MPD manifest is the document used by MPEG-DASH. It describes periods, representations, codecs, segment locations and timing information needed for adaptive playback.',
      },
      {
        question: 'How do I test an MPD manifest online?',
        answer:
          'Paste the direct MPD URL into the MPEG-DASH Player. Make sure the MPD and all referenced initialization and media segments are public or authorized for browser playback.',
      },
      {
        question: 'Can this tool play DRM-protected DASH streams?',
        answer:
          'Not as a plain public MPD test. DRM-protected streams require the correct browser support, license server flow and authorization. MetisTools does not bypass DRM or license checks.',
      },
      {
        question: 'Why does a DASH stream load the MPD but not play?',
        answer:
          'The MPD may load while segment requests fail. Check segment URLs, CORS headers, codec declarations, token expiry, HTTPS consistency and whether the stream requires DRM.',
      },
    ],
  },
  {
    title: 'Playback Log and Troubleshooting',
    items: [
      {
        question: 'What does the Playback Log record?',
        answer:
          'The Playback Log records browser-side playback events, loading events, warnings and errors. It is useful for clues, but it is not a replacement for origin server logs, CDN logs or full streaming infrastructure diagnostics.',
      },
      {
        question: 'Does a playback error prove the video source is broken?',
        answer:
          'No. A browser playback error only proves that this browser session could not play the link under current conditions. The cause may be browser support, CORS, network conditions, access rules or the source server.',
      },
      {
        question: 'Can I copy a diagnostic report safely?',
        answer:
          'The diagnostic report filters the source URL and focuses on tool type, engine, status, warnings and playback events. Do not manually paste private video URLs into support messages or public reports.',
      },
      {
        question: 'Why does HTTPS matter for video testing?',
        answer:
          'If the website is loaded over HTTPS, browsers may block insecure HTTP media requests as mixed content. Use HTTPS video URLs when possible and check source server redirects.',
      },
    ],
  },
  {
    title: 'Privacy, Copyright and Advertising',
    items: [
      {
        question: 'Does MetisTools store my submitted video URL on its server?',
        answer:
          'MetisTools does not intentionally store submitted video URLs on its server. Video URLs are used inside your browser for playback testing, and diagnostic reports filter the source URL.',
      },
      {
        question: 'Can I test copyrighted or restricted content?',
        answer:
          'Only test content you own, manage or are authorized to access. Do not use MetisTools to access, copy, redistribute or test restricted content without permission.',
      },
      {
        question: 'Does MetisTools bypass CORS, DRM or login walls?',
        answer:
          'No. MetisTools does not bypass CORS, DRM, license servers, login requirements, token rules, geo restrictions, copyright restrictions or source website permissions.',
      },
      {
        question: 'Why does the site use advertising and analytics scripts?',
        answer:
          'Google Analytics helps measure site traffic and Google AdSense may support the free tools with advertising. Consent Mode is initialized before Google tags, and region-specific advertising consent should be handled through Google-certified consent tools where required.',
      },
    ],
  },
];

export const faqPageItems = faqPageGroups.flatMap((group) => group.items);
