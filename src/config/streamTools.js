import { featureFlags } from './features.js';

// Analyzer 工具配置 - 低风险诊断工具与现有 Player 工具同级，后续可继续扩展 DASH/MPD、segment、key 等分析能力
export const analyzerTool = {
  id: 'analyzer',
  name: 'M3U8 Analyzer',
  shortName: 'Analyzer',
  description: 'Inspect public or authorized M3U8/HLS playlists and DASH MPD manifests.',
  href: '/m3u8-analyzer',
  icon: 'FileText',
};

// 高风险流处理草稿配置 - 当前不公开、不进导航、不进 sitemap，只给后续开发预留明确路由和风险分层
export const draftStreamTools = [
  {
    id: 'm3u8-to-mp4',
    name: 'M3U8 to MP4 Converter',
    href: '/tools/m3u8-to-mp4',
    risk: 'medium',
  },
  {
    id: 'ts-to-mp4',
    name: 'TS to MP4 Converter',
    href: '/tools/ts-to-mp4',
    risk: 'medium',
  },
  {
    id: 'merge-ts-files',
    name: 'Merge TS Files',
    href: '/tools/merge-ts-files',
    risk: 'medium',
  },
  {
    id: 'm3u8-downloader',
    name: 'M3U8 Downloader',
    href: '/tools/m3u8-downloader',
    risk: 'high',
  },
  {
    id: 'hls-downloader',
    name: 'HLS Downloader',
    href: '/tools/hls-downloader',
    risk: 'high',
  },
  {
    id: 'video-url-extractor',
    name: 'Video URL Extractor',
    href: '/tools/video-url-extractor',
    risk: 'high',
  },
];

// 对外导出的草稿路由集合 - sitemap 和生产检查共用，确保关闭状态不会漏进公开索引面
export const disabledDraftStreamRoutes = featureFlags.enableStreamToolDraftPages
  ? []
  : draftStreamTools.map((tool) => tool.href);
