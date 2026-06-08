// Stream Analyzer 浏览器脚本 - 只解析公开或授权的 M3U8/HLS、DASH/MPD 与 MP4 链接，不下载、不转码、不绕过访问控制
const M3U8_ATTRIBUTE_PATTERN = /([A-Z0-9-]+)=("[^"]*"|[^,]*)/gi;
const ISO_DURATION_PATTERN = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/i;
const SEGMENT_TIMEOUT_MS = 12000;
const SEGMENT_CHECK_CONCURRENCY = 6;
const MAX_RENDERED_FAILURES = 12;

function cleanLine(line) {
  return String(line || '').trim();
}

function parseAttributeList(value = '') {
  const attributes = {};
  for (const match of value.matchAll(M3U8_ATTRIBUTE_PATTERN)) {
    const key = match[1];
    const rawValue = match[2] || '';
    attributes[key] = rawValue.startsWith('"') && rawValue.endsWith('"')
      ? rawValue.slice(1, -1)
      : rawValue;
  }
  return attributes;
}

function parseExtValue(line) {
  const index = line.indexOf(':');
  return index === -1 ? '' : line.slice(index + 1).trim();
}

function parseIsoDuration(value = '') {
  const match = String(value || '').match(ISO_DURATION_PATTERN);
  if (!match) return 0;
  const [, years, months, days, hours, minutes, seconds] = match;
  return (
    Number(years || 0) * 365 * 24 * 3600 +
    Number(months || 0) * 30 * 24 * 3600 +
    Number(days || 0) * 24 * 3600 +
    Number(hours || 0) * 3600 +
    Number(minutes || 0) * 60 +
    Number(seconds || 0)
  );
}

function formatDuration(totalSeconds = 0) {
  const seconds = Number(totalSeconds || 0);
  if (!seconds) return 'Unknown';
  if (seconds < 60) return `${seconds.toFixed(seconds % 1 ? 2 : 0)} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m ${remainingSeconds}s`;
}

function formatBytes(value = '') {
  const bytes = Number(value);
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function isHttpUrl(value = '') {
  return /^https?:\/\//i.test(String(value || '').trim());
}

function isUriLine(line) {
  return line && !line.startsWith('#');
}

function resolveUri(uri = '', baseUrl = '') {
  const value = cleanLine(uri);
  if (!value) return '';
  if (isHttpUrl(value)) return value;
  if (value.startsWith('//')) return `${window.location.protocol}${value}`;
  if (!baseUrl) return '';
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return '';
  }
}

function uniqueValues(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function createResult({
  mode,
  type,
  status = 'unsupported',
  conclusion,
  summary = [],
  main = [],
  warnings = [],
  advanced = [],
  segmentTargets = [],
}) {
  return {
    mode,
    type,
    status,
    conclusion,
    summary,
    main,
    warnings,
    advanced,
    segmentTargets,
  };
}

function createUnsupportedResult(mode, type, message) {
  return createResult({
    mode,
    type,
    status: 'unsupported',
    conclusion: {
      title: 'Unable to analyze or unsupported input',
      message,
    },
    summary: [
      ['Type', type],
      ['Duration', 'Unknown'],
      ['Renditions', 'Unknown'],
      ['Segments', 'Unknown'],
      ['Audio Tracks', 'Unknown'],
      ['Protection', 'Unknown'],
    ],
    main: [message],
    warnings: [message],
  });
}

function buildProtectionText(hasProtection, protectedCount, label) {
  if (!hasProtection) return 'Not detected';
  return `${protectedCount} ${label} detected`;
}

export function analyzeM3u8Text(text = '', manifestUrl = '') {
  const lines = String(text || '').split(/\r?\n/).map(cleanLine).filter(Boolean);
  const warnings = [];
  const variants = [];
  const segments = [];
  const keyTags = [];
  const audioMediaTags = [];
  let targetDuration = '';
  let version = '';
  let mediaSequence = '';
  let discontinuityCount = 0;
  let hasEndList = false;
  let hasMap = false;
  let uriCount = 0;
  let pendingSegmentDuration = null;

  if (!lines.length) {
    return createUnsupportedResult('m3u8', 'M3U8 / HLS', 'No playlist text was provided.');
  }

  if (lines[0] !== '#EXTM3U') {
    warnings.push('The playlist does not start with #EXTM3U.');
  }

  lines.forEach((line, index) => {
    if (line.startsWith('#EXT-X-VERSION:')) version = parseExtValue(line);
    if (line.startsWith('#EXT-X-TARGETDURATION:')) targetDuration = parseExtValue(line);
    if (line.startsWith('#EXT-X-MEDIA-SEQUENCE:')) mediaSequence = parseExtValue(line);
    if (line.startsWith('#EXT-X-MAP:')) hasMap = true;
    if (line === '#EXT-X-ENDLIST') hasEndList = true;
    if (line.startsWith('#EXT-X-DISCONTINUITY')) discontinuityCount += 1;
    if (line.startsWith('#EXT-X-KEY:')) keyTags.push(parseAttributeList(parseExtValue(line)));
    if (line.startsWith('#EXT-X-MEDIA:')) {
      const attributes = parseAttributeList(parseExtValue(line));
      if (String(attributes.TYPE || '').toUpperCase() === 'AUDIO') audioMediaTags.push(attributes);
    }
    if (line.startsWith('#EXTINF:')) {
      const duration = Number.parseFloat(parseExtValue(line).split(',')[0]);
      pendingSegmentDuration = Number.isFinite(duration) ? duration : null;
    } else if (isUriLine(line)) {
      uriCount += 1;
      if (pendingSegmentDuration !== null) {
        segments.push({
          index: segments.length + 1,
          uri: line,
          url: resolveUri(line, manifestUrl),
          duration: pendingSegmentDuration,
        });
        pendingSegmentDuration = null;
      }
    }
    if (line.startsWith('#EXT-X-STREAM-INF:')) {
      const attributes = parseAttributeList(parseExtValue(line));
      const nextUri = lines.slice(index + 1).find(isUriLine) || '';
      variants.push({
        bandwidth: attributes.BANDWIDTH || '',
        resolution: attributes.RESOLUTION || '',
        codecs: attributes.CODECS || '',
        uri: nextUri,
        url: resolveUri(nextUri, manifestUrl),
      });
    }
  });

  const activeKeyTags = keyTags.filter((key) => String(key.METHOD || '').toUpperCase() !== 'NONE');
  const playlistType = variants.length > 0
    ? 'Master playlist'
    : segments.length > 0
      ? 'Media playlist'
      : 'Unknown playlist';
  const estimatedDuration = segments.reduce((sum, segment) => sum + segment.duration, 0);
  const checkableSegmentCount = segments.filter((segment) => segment.url).length;
  const resolutions = uniqueValues(variants.map((variant) => variant.resolution));
  const durationText = formatDuration(estimatedDuration);
  const protectionText = buildProtectionText(activeKeyTags.length > 0, activeKeyTags.length, 'HLS key tag');
  const renditionText = variants.length
    ? `${pluralize(variants.length, 'variant')}${resolutions.length ? ` (${resolutions.slice(0, 4).join(', ')}${resolutions.length > 4 ? ', ...' : ''})` : ''}`
    : segments.length
      ? 'Single media playlist'
      : 'Unknown';

  if (playlistType === 'Unknown playlist') warnings.push('No HLS variants or media segments were detected.');
  if (activeKeyTags.length > 0) warnings.push('EXT-X-KEY tags were detected. Playback may require keys or protected access.');
  if (!hasEndList && segments.length > 0) warnings.push('No EXT-X-ENDLIST tag was found. This may be a live or unfinished playlist.');
  if (!targetDuration && segments.length > 0) warnings.push('No EXT-X-TARGETDURATION tag was found in this media playlist.');

  const status = playlistType === 'Unknown playlist' || lines[0] !== '#EXTM3U'
    ? 'unsupported'
    : warnings.length
      ? 'warning'
      : 'pass';
  const conclusion = status === 'pass'
    ? {
      title: 'Basic checks passed',
      message: variants.length
        ? 'This playlist structure looks normal and includes multiple playable variants.'
        : 'This media playlist structure looks normal and direct media segments were detected.',
    }
    : status === 'warning'
      ? {
        title: 'Possible playback issues found',
        message: warnings[0],
      }
      : {
        title: 'Unable to analyze or unsupported input',
        message: 'The text does not look like a complete HLS playlist.',
      };

  const main = [
    variants.length
      ? `Detected ${pluralize(variants.length, 'video variant')} in this HLS master playlist.`
      : `Detected ${pluralize(segments.length, 'media segment')} in this HLS media playlist.`,
    estimatedDuration
      ? `Estimated playlist duration is ${durationText}.`
      : 'Duration could not be estimated from the current playlist text.',
    activeKeyTags.length
      ? 'Protection-related HLS key tags were found, so playback may require authorized keys or access rules.'
      : 'No obvious HLS key tag was found in this manifest.',
    checkableSegmentCount
      ? 'Direct media segment URLs are available for Smart Check.'
      : segments.length
        ? 'Segment entries are present, but a source URL is needed to resolve relative segment paths for Smart Check.'
      : 'No direct media segment URLs were found. For a master playlist, open one variant playlist to inspect segments.',
  ];

  return createResult({
    mode: 'm3u8',
    type: 'M3U8 / HLS',
    status,
    conclusion,
    summary: [
      ['Type', playlistType],
      ['Duration', durationText],
      ['Renditions', renditionText],
      ['Segments', String(segments.length)],
      ['Audio Tracks', audioMediaTags.length ? `${audioMediaTags.length} declared` : 'Not declared'],
      ['Protection', protectionText],
    ],
    main,
    warnings,
    advanced: [
      ['HLS version', version || 'Not declared'],
      ['Target duration', targetDuration || 'Not declared'],
      ['Media sequence', mediaSequence || 'Not declared'],
      ['URI line count', String(uriCount)],
      ['Discontinuities', String(discontinuityCount)],
      ['Initialization map', hasMap ? 'Present' : 'Not detected'],
      ['Endlist', hasEndList ? 'Present' : 'Not detected'],
      ['Variant details', variants.length ? variants.slice(0, 12).map((variant, index) => `Variant ${index + 1}: ${variant.resolution || 'unknown resolution'}, ${variant.bandwidth || 'unknown bandwidth'}, ${variant.codecs || 'unknown codecs'}, ${variant.uri || 'no URI found'}`).join('\n') : 'No variants detected'],
      ['Key details', keyTags.length ? keyTags.slice(0, 6).map((key, index) => `Key ${index + 1}: method ${key.METHOD || 'unknown'}, URI ${key.URI ? 'present' : 'not declared'}`).join('\n') : 'No key tags detected'],
    ],
    segmentTargets: segments,
  });
}

function getElementsByLocalName(root, localName) {
  return [...root.getElementsByTagNameNS('*', localName)];
}

function getDirectChildText(element, localName) {
  const child = [...(element?.children || [])].find((candidate) => candidate.localName === localName);
  return cleanLine(child?.textContent || '');
}

function buildMpdBaseUrl(element, manifestUrl = '') {
  const ancestors = [];
  let current = element?.parentElement || null;
  while (current) {
    ancestors.unshift(current);
    current = current.parentElement;
  }
  let baseUrl = manifestUrl || '';
  ancestors.forEach((ancestor) => {
    const baseText = getDirectChildText(ancestor, 'BaseURL');
    if (baseText) {
      baseUrl = resolveUri(baseText, baseUrl) || (isHttpUrl(baseText) ? baseText : baseUrl);
    }
  });
  return baseUrl;
}

function resolveMpdSegmentUrl(segmentElement, mediaUrl, manifestUrl = '') {
  const baseUrl = buildMpdBaseUrl(segmentElement, manifestUrl);
  return resolveUri(mediaUrl, baseUrl || manifestUrl);
}

export function analyzeMpdText(text = '', manifestUrl = '') {
  const trimmedText = String(text || '').trim();
  if (!trimmedText) {
    return createUnsupportedResult('mpd', 'DASH / MPD', 'No MPD text was provided.');
  }

  const warnings = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmedText, 'application/xml');
  const parseError = getElementsByLocalName(doc, 'parsererror')[0];
  const mpd = getElementsByLocalName(doc, 'MPD')[0];

  if (parseError || !mpd) {
    return createUnsupportedResult('mpd', 'DASH / MPD', 'The XML could not be parsed as a valid MPD manifest.');
  }

  const periods = getElementsByLocalName(doc, 'Period');
  const adaptationSets = getElementsByLocalName(doc, 'AdaptationSet');
  const audioAdaptationSets = adaptationSets.filter((set) => {
    const contentType = String(set.getAttribute('contentType') || '').toLowerCase();
    const mimeType = String(set.getAttribute('mimeType') || '').toLowerCase();
    return contentType === 'audio' || mimeType.includes('audio');
  });
  const representations = getElementsByLocalName(doc, 'Representation');
  const contentProtection = getElementsByLocalName(doc, 'ContentProtection');
  const segmentTemplates = getElementsByLocalName(doc, 'SegmentTemplate');
  const segmentLists = getElementsByLocalName(doc, 'SegmentList');
  const segmentUrls = getElementsByLocalName(doc, 'SegmentURL');
  const baseUrls = getElementsByLocalName(doc, 'BaseURL');
  const mpdType = mpd.getAttribute('type') || 'static';
  const durationSeconds = parseIsoDuration(mpd.getAttribute('mediaPresentationDuration') || '');
  const durationText = formatDuration(durationSeconds);
  const segmentTargets = segmentUrls.map((segmentUrl, index) => {
    const mediaUrl = segmentUrl.getAttribute('media') || segmentUrl.getAttribute('sourceURL') || '';
    return {
      index: index + 1,
      uri: mediaUrl,
      url: resolveMpdSegmentUrl(segmentUrl, mediaUrl, manifestUrl),
      duration: 0,
    };
  }).filter((segment) => segment.uri);
  const resolutions = uniqueValues(representations.map((representation) => {
    const width = representation.getAttribute('width');
    const height = representation.getAttribute('height');
    return width && height ? `${width}x${height}` : '';
  }));

  if (!representations.length) warnings.push('No Representation elements were detected.');
  if (contentProtection.length > 0) warnings.push('ContentProtection elements were detected. Playback may require DRM or license access.');
  if (mpdType === 'dynamic') warnings.push('This is a dynamic MPD manifest, usually used for live streams.');
  if (!segmentTemplates.length && !segmentLists.length && !baseUrls.length) {
    warnings.push('No SegmentTemplate, SegmentList or BaseURL elements were detected.');
  }
  if (!segmentTargets.length && segmentTemplates.length) {
    warnings.push('SegmentTemplate markers were found, but this analyzer does not expand templated segment URLs yet.');
  }

  const status = !representations.length
    ? 'unsupported'
    : warnings.length
      ? 'warning'
      : 'pass';
  const conclusion = status === 'pass'
    ? {
      title: 'Basic checks passed',
      message: 'This MPD structure looks normal and playable representations were detected.',
    }
    : status === 'warning'
      ? {
        title: 'Possible playback issues found',
        message: warnings[0],
      }
      : {
        title: 'Unable to analyze or unsupported input',
        message: 'The MPD was parsed, but no playable Representation elements were detected.',
      };

  const main = [
    `Detected ${pluralize(representations.length, 'representation')} across ${pluralize(adaptationSets.length, 'adaptation set')}.`,
    durationSeconds ? `Declared MPD duration is ${durationText}.` : 'No clear mediaPresentationDuration value was found.',
    contentProtection.length
      ? 'ContentProtection markers were found, so playback may require DRM license access.'
      : 'No obvious DASH ContentProtection marker was found.',
    segmentTargets.length
      ? `Found ${pluralize(segmentTargets.length, 'explicit SegmentURL')} for Smart Check.`
      : 'No explicit SegmentURL list is available for direct segment checking.',
  ];

  return createResult({
    mode: 'mpd',
    type: 'DASH / MPD',
    status,
    conclusion,
    summary: [
      ['Type', `MPD ${mpdType}`],
      ['Duration', durationText],
      ['Renditions', `${representations.length} representations${resolutions.length ? ` (${resolutions.slice(0, 4).join(', ')}${resolutions.length > 4 ? ', ...' : ''})` : ''}`],
      ['Segments', segmentTargets.length ? String(segmentTargets.length) : 'Not explicit'],
      ['Audio Tracks', audioAdaptationSets.length ? `${audioAdaptationSets.length} adaptation sets` : 'Not declared'],
      ['Protection', buildProtectionText(contentProtection.length > 0, contentProtection.length, 'ContentProtection marker')],
    ],
    main,
    warnings,
    advanced: [
      ['Period count', String(periods.length)],
      ['AdaptationSet count', String(adaptationSets.length)],
      ['Representation count', String(representations.length)],
      ['SegmentTemplate count', String(segmentTemplates.length)],
      ['SegmentList count', String(segmentLists.length)],
      ['SegmentURL count', String(segmentUrls.length)],
      ['BaseURL count', String(baseUrls.length)],
      ['Minimum buffer time', mpd.getAttribute('minBufferTime') || 'Not declared'],
      ['Profiles', mpd.getAttribute('profiles') || 'Not declared'],
      ['Representation details', representations.length ? representations.slice(0, 12).map((representation, index) => {
        const width = representation.getAttribute('width');
        const height = representation.getAttribute('height');
        const resolution = width && height ? `${width}x${height}` : 'unknown resolution';
        return `Representation ${index + 1}: ${representation.getAttribute('id') || 'no id'}, ${resolution}, ${representation.getAttribute('bandwidth') || 'unknown bandwidth'}, ${representation.getAttribute('codecs') || 'unknown codecs'}`;
      }).join('\n') : 'No representations detected'],
    ],
    segmentTargets,
  });
}

function headersToObject(headers) {
  const output = {};
  headers.forEach((value, key) => {
    output[key.toLowerCase()] = value;
  });
  return output;
}

export async function analyzeMp4Url(url = '') {
  const normalizedUrl = cleanLine(url);
  if (!normalizedUrl) {
    return createUnsupportedResult('mp4', 'MP4 Link', 'No MP4 URL was provided.');
  }
  if (!isHttpUrl(normalizedUrl)) {
    return createUnsupportedResult('mp4', 'MP4 Link', 'Use a full http:// or https:// MP4 URL.');
  }

  try {
    const startedAt = performance.now();
    const response = await fetch(normalizedUrl, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
    });
    const elapsedMs = Math.round(performance.now() - startedAt);
    const headers = headersToObject(response.headers);
    const contentType = headers['content-type'] || 'Unknown';
    const contentLength = headers['content-length'] || '';
    const acceptRanges = headers['accept-ranges'] || 'Not declared';
    const normalizedAcceptRanges = acceptRanges.toLowerCase();
    const looksLikeMp4 = /video\/mp4|application\/mp4|\.mp4(?:$|\?)/i.test(`${contentType} ${normalizedUrl}`);
    const warnings = [];

    if (!response.ok) warnings.push(`The MP4 URL returned HTTP ${response.status}.`);
    if (!looksLikeMp4) warnings.push('The response does not clearly look like an MP4 video.');
    if (normalizedAcceptRanges === 'none') warnings.push('The server explicitly reports that byte-range requests are not supported.');

    const status = response.ok && looksLikeMp4 ? (warnings.length ? 'warning' : 'pass') : 'warning';
    return createResult({
      mode: 'mp4',
      type: 'MP4 Link',
      status,
      conclusion: status === 'pass'
        ? {
          title: 'Basic checks passed',
          message: 'The MP4 link responded successfully and looks like a direct video file.',
        }
        : {
          title: 'Possible playback issues found',
          message: warnings[0] || 'The MP4 link responded, but important playback headers are missing or unclear.',
        },
      summary: [
        ['Type', contentType],
        ['Duration', 'Unknown from HEAD'],
        ['Renditions', 'Single file'],
        ['Segments', 'Not segmented'],
        ['Audio Tracks', 'Unknown from headers'],
        ['Protection', 'None detected from headers'],
      ],
      main: [
        `The MP4 URL returned HTTP ${response.status} in ${elapsedMs} ms.`,
        contentLength ? `Declared file size is ${formatBytes(contentLength)}.` : 'No Content-Length header was exposed to the browser.',
        normalizedAcceptRanges === 'bytes'
          ? 'The server declares byte-range support, which is usually helpful for browser seeking.'
          : normalizedAcceptRanges === 'none'
            ? 'The server explicitly declares that byte-range requests are not supported, so seeking may behave poorly.'
            : 'The Accept-Ranges header was not exposed to this browser. This is informational, not a failure by itself.',
        'MP4 Checker uses a browser HEAD request only; it does not download the video file.',
      ],
      warnings,
      advanced: [
        ['HTTP status', `${response.status} ${response.statusText}`.trim()],
        ['Response time', `${elapsedMs} ms`],
        ['Content-Type', contentType],
        ['Content-Length', contentLength ? formatBytes(contentLength) : 'Not exposed'],
        ['Accept-Ranges', acceptRanges],
        ['Last-Modified', headers['last-modified'] || 'Not exposed'],
        ['Cache-Control', headers['cache-control'] || 'Not exposed'],
      ],
    });
  } catch {
    return createUnsupportedResult(
      'mp4',
      'MP4 Link',
      'The browser could not check this MP4 URL. It may be blocked by CORS, network rules, login, token expiry or server policy.'
    );
  }
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function setButtonDisabled(button, disabled) {
  if (!button) return;
  button.disabled = disabled;
  button.classList.toggle('cursor-not-allowed', disabled);
  button.classList.toggle('opacity-55', disabled);
  button.classList.toggle('shadow-none', disabled);
}

function renderConclusion(container, result) {
  if (!container) return;
  const colorClass = result.status === 'pass'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
    : result.status === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-red-200 bg-red-50 text-red-900';
  container.className = `rounded-xl border p-3 ${colorClass}`;
  container.replaceChildren(
    createTextElement('p', 'text-[14px] font-black', result.conclusion?.title || 'Analysis completed'),
    createTextElement('p', 'mt-1 text-[13px] font-semibold leading-snug opacity-85', result.conclusion?.message || '')
  );
}

function renderSummary(container, items = []) {
  if (!container) return;
  container.replaceChildren();
  items.forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'rounded-lg border border-orange-100 bg-[#fffaf4]/80 px-3 py-2 shadow-sm shadow-orange-50/70';
    card.append(
      createTextElement('p', 'text-[12px] font-black uppercase tracking-[0.04em] text-gray-500', label),
      createTextElement('p', 'mt-1 break-words text-[13px] font-extrabold text-gray-950', value)
    );
    container.append(card);
  });
}

function renderBullets(container, items = [], emptyText = '') {
  if (!container) return;
  const safeItems = items.length ? items : [emptyText];
  const list = document.createElement('ul');
  list.className = 'space-y-2';
  safeItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'rounded-lg bg-[#fffaf4]/80 px-3 py-2';
    li.textContent = item;
    list.append(li);
  });
  container.replaceChildren(list);
}

function renderAdvanced(container, items = []) {
  if (!container) return;
  if (!items.length) {
    container.replaceChildren(createTextElement('p', 'rounded-lg bg-[#fffaf4]/80 px-3 py-2', 'No advanced information available.'));
    return;
  }
  const dl = document.createElement('dl');
  dl.className = 'grid gap-2 md:grid-cols-2';
  items.forEach(([label, value]) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'rounded-lg bg-[#fffaf4]/80 px-3 py-2';
    const dt = createTextElement('dt', 'text-[12px] font-black uppercase tracking-[0.04em] text-gray-500', label);
    const dd = createTextElement('dd', 'mt-1 whitespace-pre-wrap break-words text-[13px] font-semibold text-gray-800', value);
    wrapper.append(dt, dd);
    dl.append(wrapper);
  });
  container.replaceChildren(dl);
}

function renderWarnings(elements, warnings = []) {
  if (!elements.warningsSection || !elements.warnings) return;
  const hasWarnings = warnings.length > 0;
  elements.warningsSection.classList.toggle('hidden', !hasWarnings);
  if (!hasWarnings) {
    elements.warnings.replaceChildren();
    return;
  }
  renderBullets(elements.warnings, warnings, '');
}

function renderSegmentUnavailable(elements, message) {
  elements.segmentSummary?.replaceChildren(
    createTextElement('p', 'col-span-full whitespace-nowrap text-[13px] font-semibold leading-snug text-gray-600', message)
  );
  elements.segmentFailures?.classList.add('hidden');
  elements.segmentFailures?.replaceChildren();
  setButtonDisabled(elements.smartButton, true);
  setButtonDisabled(elements.allButton, true);
  setButtonDisabled(elements.copyFailedButton, true);
}

function createSegmentMetric(label, value) {
  const card = document.createElement('div');
  card.className = 'rounded-lg border border-orange-100 bg-[#fffaf4]/80 px-3 py-2';
  card.append(
    createTextElement('p', 'text-[12px] font-black uppercase tracking-[0.04em] text-gray-500', label),
    createTextElement('p', 'mt-1 text-[13px] font-extrabold text-gray-950', value)
  );
  return card;
}

function renderSegmentReady(elements, text, targetCount) {
  elements.segmentSummary?.replaceChildren(
    createSegmentMetric('Ready URLs', String(targetCount)),
    createSegmentMetric('Checked', '0'),
    createSegmentMetric('Failed', '0'),
    createSegmentMetric('Average', 'Not checked')
  );
  elements.segmentNote.textContent = text.smartNote || '';
  elements.segmentFailures?.classList.add('hidden');
  elements.segmentFailures?.replaceChildren();
  setButtonDisabled(elements.smartButton, false);
  setButtonDisabled(elements.allButton, false);
  setButtonDisabled(elements.copyFailedButton, true);
}

function renderSegmentRunning(elements, count) {
  elements.segmentSummary?.replaceChildren(
    createSegmentMetric('Checking', String(count)),
    createSegmentMetric('Succeeded', '...'),
    createSegmentMetric('Failed', '...'),
    createSegmentMetric('Average', '...')
  );
  setButtonDisabled(elements.smartButton, true);
  setButtonDisabled(elements.allButton, true);
  setButtonDisabled(elements.copyFailedButton, true);
}

function renderSegmentResults(elements, results = []) {
  const successCount = results.filter((result) => result.ok).length;
  const failureCount = results.length - successCount;
  const averageMs = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.elapsedMs, 0) / results.length)
    : 0;
  const failures = results.filter((result) => !result.ok);

  elements.segmentSummary?.replaceChildren(
    createSegmentMetric('Checked', String(results.length)),
    createSegmentMetric('Succeeded', String(successCount)),
    createSegmentMetric('Failed', String(failureCount)),
    createSegmentMetric('Average', results.length ? `${averageMs} ms` : 'Not checked')
  );

  if (failures.length) {
    const wrapper = document.createElement('div');
    wrapper.className = 'rounded-lg border border-amber-200 bg-amber-50 p-3';
    wrapper.append(createTextElement('p', 'text-[13px] font-black text-amber-900', `Failed segments (${failures.length})`));
    const list = document.createElement('ul');
    list.className = 'mt-2 space-y-1.5 text-[12.5px] font-semibold leading-snug text-amber-900';
    failures.slice(0, MAX_RENDERED_FAILURES).forEach((failure) => {
      const li = document.createElement('li');
      li.className = 'break-words rounded-md bg-white/70 px-2 py-1.5';
      li.textContent = `#${failure.index}: ${failure.reason} - ${failure.url}`;
      list.append(li);
    });
    if (failures.length > MAX_RENDERED_FAILURES) {
      list.append(createTextElement('li', 'px-2 py-1.5', `${failures.length - MAX_RENDERED_FAILURES} more failed segments are available in Copy Failed List.`));
    }
    wrapper.append(list);
    elements.segmentFailures?.classList.remove('hidden');
    elements.segmentFailures?.replaceChildren(wrapper);
  } else {
    elements.segmentFailures?.classList.add('hidden');
    elements.segmentFailures?.replaceChildren();
  }

  setButtonDisabled(elements.smartButton, false);
  setButtonDisabled(elements.allButton, false);
  setButtonDisabled(elements.copyFailedButton, !failures.length);
}

function renderResult(elements, result, text) {
  renderConclusion(elements.conclusion, result);
  renderSummary(elements.summary, result.summary);
  renderBullets(elements.main, result.main, 'No main result available.');
  renderWarnings(elements, result.warnings);
  renderAdvanced(elements.advanced, result.advanced);

  const checkableTargets = result.segmentTargets.filter((segment) => segment.url);
  if (checkableTargets.length) {
    renderSegmentReady(elements, text.segmentCheck || {}, checkableTargets.length);
  } else {
    renderSegmentUnavailable(elements, text.segmentCheck?.unavailable || 'No direct segment URLs are ready to check yet.');
  }
}

function renderPending(elements, title, description) {
  renderConclusion(elements.conclusion, {
    status: 'warning',
    conclusion: { title, message: description },
  });
}

function timestamp() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}

function renderLog(logElement, entries, emptyText) {
  if (!logElement) return;
  if (!entries.length) {
    logElement.textContent = emptyText;
    return;
  }
  logElement.textContent = entries.map((entry) => `[${entry.time}] ${entry.message}`).join('\n');
  const scrollBox = logElement.closest('.playback-log-resize-shell');
  if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
}

function getSmartSample(targets = []) {
  const count = targets.length;
  if (count <= 10) return targets;
  if (count <= 60) return targets.slice(0, 10);

  const middleStart = Math.min(Math.max(Math.floor(count / 2) - 2, 5), count - 10);
  const sample = [
    ...targets.slice(0, 5),
    ...targets.slice(middleStart, middleStart + 5),
    ...targets.slice(count - 5),
  ];
  const seen = new Set();
  return sample.filter((target) => {
    if (seen.has(target.index)) return false;
    seen.add(target.index);
    return true;
  });
}

async function checkSegmentUrl(target) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SEGMENT_TIMEOUT_MS);
  const startedAt = performance.now();
  try {
    const response = await fetch(target.url, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    const elapsedMs = Math.round(performance.now() - startedAt);
    window.clearTimeout(timeoutId);
    return {
      ...target,
      ok: response.ok,
      status: response.status,
      elapsedMs,
      reason: response.ok ? 'OK' : `HTTP ${response.status}`,
    };
  } catch (error) {
    const elapsedMs = Math.round(performance.now() - startedAt);
    window.clearTimeout(timeoutId);
    return {
      ...target,
      ok: false,
      status: 0,
      elapsedMs,
      reason: error?.name === 'AbortError' ? 'Timeout' : 'CORS, network or HEAD request blocked',
    };
  }
}

async function runLimited(items, worker, limit = SEGMENT_CHECK_CONCURRENCY) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await worker(items[currentIndex]);
    }
  });
  await Promise.all(runners);
  return results;
}

async function fetchManifest(url) {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function parseUiText(root) {
  try {
    return JSON.parse(root.dataset.uiText || '{}');
  } catch {
    return {};
  }
}

function collectElements(root) {
  return {
    form: root.querySelector('#stream-analyzer-form'),
    urlInput: root.querySelector('#stream-analyzer-url'),
    textInput: root.querySelector('#stream-analyzer-text'),
    advancedInput: root.querySelector('#stream-analyzer-advanced-input'),
    sampleButton: root.querySelector('#stream-analyzer-load-sample'),
    clearButton: root.querySelector('#stream-analyzer-clear'),
    submitLabel: root.querySelector('#stream-analyzer-submit-label'),
    modeButtons: [...root.querySelectorAll('[data-player-tab-button][data-tab-id]')],
    conclusion: root.querySelector('#stream-analyzer-conclusion'),
    summary: root.querySelector('#stream-analyzer-summary'),
    main: root.querySelector('#stream-analyzer-main'),
    warningsSection: root.querySelector('#stream-analyzer-warnings-section'),
    warnings: root.querySelector('#stream-analyzer-warnings'),
    advanced: root.querySelector('#stream-analyzer-advanced'),
    segmentNote: root.querySelector('#stream-analyzer-segment-note'),
    segmentSummary: root.querySelector('#stream-analyzer-segment-summary'),
    segmentFailures: root.querySelector('#stream-analyzer-segment-failures'),
    smartButton: root.querySelector('#stream-analyzer-smart-check'),
    allButton: root.querySelector('#stream-analyzer-check-all'),
    copyFailedButton: root.querySelector('#stream-analyzer-copy-failed'),
    log: root.querySelector('#stream-analyzer-log-output'),
    clearLogButton: root.querySelector('#stream-analyzer-clear-log'),
    copyLogButton: root.querySelector('#stream-analyzer-copy-log'),
  };
}

export function initStreamAnalyzer() {
  const root = document.querySelector('[data-stream-analyzer]');
  if (!root) return;

  const text = parseUiText(root);
  const elements = collectElements(root);
  const state = {
    currentMode: elements.modeButtons.find((button) => button.dataset.state === 'active')?.dataset.tabId || 'm3u8',
    lastResult: null,
    segmentResults: [],
    logEntries: [],
  };

  const addLog = (message) => {
    state.logEntries.push({ time: timestamp(), message });
    renderLog(elements.log, state.logEntries, text.log?.empty || '');
  };
  const getMode = () => state.currentMode || 'm3u8';

  const updateModeButtons = () => {
    elements.modeButtons.forEach((button) => {
      const isActive = button.dataset.tabId === getMode();
      button.dataset.state = isActive ? 'active' : 'inactive';
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const updateModeDefaults = () => {
    const mode = getMode();
    updateModeButtons();
    if (elements.urlInput) {
      elements.urlInput.placeholder = text.input?.urlPlaceholders?.[mode] || text.input?.urlPlaceholder || '';
    }
    if (elements.submitLabel) {
      elements.submitLabel.textContent = text.input?.buttonLabels?.[mode] || text.input?.buttonLabel || 'Analyze Manifest';
    }
    elements.advancedInput?.classList.toggle('hidden', mode === 'mp4');
    if (elements.textInput && !elements.textInput.value.trim() && mode !== 'mp4') {
      elements.textInput.placeholder = root.dataset[`${mode}Sample`] || '';
    }
    renderSegmentUnavailable(elements, text.segmentCheck?.unavailable || 'No direct segment URLs are ready to check yet.');
  };

  const runSegmentCheck = async (strategy = 'smart') => {
    const availableTargets = (state.lastResult?.segmentTargets || []).filter((segment) => segment.url);
    if (!availableTargets.length) {
      addLog('no checkable segment URLs found');
      renderSegmentUnavailable(elements, text.segmentCheck?.unavailable || 'No direct segment URLs are ready to check yet.');
      return;
    }

    const selectedTargets = strategy === 'all' ? availableTargets : getSmartSample(availableTargets);
    addLog(`${strategy === 'all' ? 'full segment check' : 'smart segment check'} started (${selectedTargets.length} of ${availableTargets.length})`);
    renderSegmentRunning(elements, selectedTargets.length);
    state.segmentResults = await runLimited(selectedTargets, checkSegmentUrl);
    renderSegmentResults(elements, state.segmentResults);
    const failedCount = state.segmentResults.filter((result) => !result.ok).length;
    addLog(`${state.segmentResults.length - failedCount} segments OK, ${failedCount} failed`);
    addLog('segment check completed');
  };

  const analyzeCurrentInput = async () => {
    const mode = getMode();
    const pastedText = elements.textInput?.value.trim() || '';
    const url = elements.urlInput?.value.trim() || '';
    state.segmentResults = [];

    addLog('analysis started');
    try {
      let result;
      if (mode === 'mp4') {
        addLog('checking MP4 link with browser HEAD request');
        renderPending(elements, 'Checking MP4 link', 'Sending a browser HEAD request to read response metadata.');
        result = await analyzeMp4Url(url);
      } else {
        let manifestText = pastedText;
        if (!manifestText && url) {
          addLog('fetching manifest');
          renderPending(elements, text.results?.fetching || 'Fetching manifest', text.results?.fetching || 'Fetching manifest');
          manifestText = await fetchManifest(url);
          addLog('manifest loaded');
        }
        if (!manifestText) {
          result = mode === 'mpd'
            ? analyzeMpdText('', url)
            : analyzeM3u8Text('', url);
        } else {
          addLog('parsing manifest text');
          renderPending(elements, text.results?.parsing || 'Parsing manifest text', text.results?.parsing || 'Parsing manifest text');
          result = mode === 'mpd'
            ? analyzeMpdText(manifestText, url)
            : analyzeM3u8Text(manifestText, url);
        }
      }

      state.lastResult = result;
      renderResult(elements, result, text);
      addLog(`${result.type} analysis completed`);

      // 默认只执行智能抽样检测，避免全量检测在大清单上造成大量浏览器请求
      if (result.segmentTargets.filter((segment) => segment.url).length) {
        await runSegmentCheck('smart');
      }
    } catch {
      const failure = createUnsupportedResult(
        mode,
        mode === 'mpd' ? 'DASH / MPD' : 'M3U8 / HLS',
        text.results?.fetchFailed || 'The browser could not fetch this URL.'
      );
      state.lastResult = failure;
      renderResult(elements, failure, text);
      addLog('analysis failed');
    }
  };

  elements.modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.currentMode = button.dataset.tabId || 'm3u8';
      addLog(`mode changed to ${state.currentMode}`);
      updateModeDefaults();
      button.blur();
    });
  });

  elements.sampleButton?.addEventListener('click', () => {
    const mode = getMode();
    if (mode === 'mp4') {
      if (elements.urlInput) elements.urlInput.value = root.dataset.mp4Sample || '';
      if (elements.textInput) elements.textInput.value = '';
    } else if (elements.textInput) {
      if (elements.urlInput) elements.urlInput.value = '';
      elements.textInput.value = root.dataset[`${mode}Sample`] || '';
    }
    addLog(`${mode.toUpperCase()} sample loaded`);
  });

  elements.clearButton?.addEventListener('click', () => {
    if (elements.urlInput) elements.urlInput.value = '';
    if (elements.textInput) elements.textInput.value = '';
    state.lastResult = null;
    state.segmentResults = [];
    renderConclusion(elements.conclusion, {
      status: 'warning',
      conclusion: {
        title: text.results?.emptyTitle || 'Ready to analyze',
        message: text.results?.emptyDescription || '',
      },
    });
    renderSummary(elements.summary, []);
    renderBullets(elements.main, [], 'No analysis result yet.');
    renderWarnings(elements, []);
    renderAdvanced(elements.advanced, []);
    renderSegmentUnavailable(elements, text.segmentCheck?.unavailable || 'No direct segment URLs are ready to check yet.');
    addLog('input cleared');
  });

  elements.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    analyzeCurrentInput();
  });

  elements.textInput?.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      elements.form?.requestSubmit();
    }
  });

  elements.smartButton?.addEventListener('click', () => runSegmentCheck('smart'));
  elements.allButton?.addEventListener('click', () => runSegmentCheck('all'));

  elements.copyFailedButton?.addEventListener('click', async () => {
    const failures = state.segmentResults.filter((result) => !result.ok);
    if (!failures.length) return;
    try {
      await navigator.clipboard.writeText(failures.map((failure) => failure.url).join('\n'));
      addLog(`copied ${pluralize(failures.length, 'failed segment URL')}`);
    } catch {
      addLog('copy failed list blocked by browser permissions');
    }
  });

  elements.clearLogButton?.addEventListener('click', () => {
    state.logEntries = [];
    renderLog(elements.log, state.logEntries, text.log?.empty || '');
  });

  elements.copyLogButton?.addEventListener('click', async () => {
    if (!state.logEntries.length) return;
    try {
      await navigator.clipboard.writeText(state.logEntries.map((entry) => `[${entry.time}] ${entry.message}`).join('\n'));
      addLog('log copied');
    } catch {
      addLog('copy log blocked by browser permissions');
    }
  });

  updateModeDefaults();
  renderLog(elements.log, state.logEntries, text.log?.empty || '');
}
