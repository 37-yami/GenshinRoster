import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// 自定义插件：在构建产物写入磁盘后，去除内联 script 的 type="module" 和 crossorigin 属性
// 这两个属性会导致 file:// 协议下浏览器 CORS 拦截，使 JS 不执行（页面纯黑）
function stripModuleAttributes() {
  return {
    name: 'strip-module-attributes',
    closeBundle() {
      const htmlPath = resolve(__dirname, 'dist/index.html');
      try {
        const html = readFileSync(htmlPath, 'utf-8');
        // 去除 type="module" crossorigin（这些属性在 file:// 下会触发 CORS 拦截）
        // 注意：去除后变为同步 classic script，需确保 main.tsx 中用 DOMContentLoaded 包裹 createRoot
        const updated = html.replace(
          /<script\s+type="module"\s+crossorigin>/g,
          '<script>',
        );
        writeFileSync(htmlPath, updated, 'utf-8');
        console.log('[strip-module-attributes] 已去除 type="module" crossorigin');
      } catch (e) {
        console.warn('[strip-module-attributes] 跳过:', (e as Error).message);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    sourcemap: 'hidden',
    // 单文件输出：所有 JS/CSS 内联到 index.html，双击即可打开
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    rollupOptions: {
      output: {
        // 输出 IIFE 格式，去除 type="module"，使产物可在 file:// 下直接执行
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }),
    tsconfigPaths(),
    viteSingleFile(),
    stripModuleAttributes(),
  ],
})
