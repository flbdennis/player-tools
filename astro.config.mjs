import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Astro 配置 - 项目保持 JavaScript 工作流，不依赖 tsconfig，避免和 CLAUDE.md 中“禁止创建 tsconfig”规则冲突。
export default defineConfig({
  // 正式 URL 统一使用无尾斜杠；首页仍保持 "/"，内页使用 "/about" 这类规范路径。
  trailingSlash: 'never',
  build: {
    // 静态产物输出为 about.html / guides.html，避免静态托管把无尾斜杠路径再规范到目录斜杠路径。
    format: 'file',
  },
  // 关闭开发工具条，避免页面截图对比时出现额外悬浮 UI。
  devToolbar: {
    enabled: false,
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // DASH 只需要在线播放核心能力，使用 dash.js 的 mediaplayer 构建，避免把 offline/protection/reporting 等非首期功能打进播放引擎包。
        'dashjs/playback': fileURLToPath(
          new URL('./node_modules/dashjs/dist/modern/esm/dash.mediaplayer.min.js', import.meta.url),
        ),
      },
    },
    build: {
      // HLS/DASH/Sentry 都是用户触发后按需加载的独立包，不进入首屏关键 JS；阈值按最大懒加载播放器包设置，避免误报 500KB 警告。
      chunkSizeWarningLimit: 820,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 明确拆出播放器和监控依赖，方便后续在构建产物中检查懒加载包体积。
            if (id.includes('node_modules/hls.js')) return 'player-hls';
            if (id.includes('node_modules/dashjs')) return 'player-dash';
            if (id.includes('node_modules/@sentry')) return 'monitoring-sentry';
          },
        },
      },
    },
  },
});
