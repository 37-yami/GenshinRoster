import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
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
      let html: string;
      try {
        html = readFileSync(htmlPath, 'utf-8');
      } catch (e) {
        console.warn('[strip-module-attributes] 跳过:', (e as Error).message);
        return;
      }
      // 匹配任意属性顺序的 module script 起始标签（如 <script type="module" crossorigin>）
      // 去除后变为同步 classic script，需确保 main.tsx 中用 DOMContentLoaded 包裹 createRoot
      let count = 0;
      const updated = html.replace(
        /<script\b[^>]*\btype="module"[^>]*>/g,
        () => {
          count += 1;
          return '<script>';
        },
      );
      if (count === 0 && html.includes('type="module"')) {
        // 存在 module script 但正则未匹配到（如 Vite 升级改变了输出格式），
        // 静默跳过会导致 file:// 下产物白屏，因此直接让构建失败
        throw new Error(
          '[strip-module-attributes] 检测到 type="module" 但正则未匹配，请检查产物格式并更新插件',
        );
      }
      if (count > 0) {
        writeFileSync(htmlPath, updated, 'utf-8');
        console.log(`[strip-module-attributes] 已去除 ${count} 处 type="module"`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  build: {
    // 单文件产物无需 sourcemap，避免 dist 残留无引用的 .map 文件
    sourcemap: false,
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
      // 开发定位器仅用于 dev server，避免 build 走 Babel 全量转译拖慢构建
      babel:
        command === 'serve'
          ? { plugins: ['react-dev-locator'] }
          : undefined,
    }),
    tsconfigPaths(),
    viteSingleFile(),
    stripModuleAttributes(),
  ],
}))
