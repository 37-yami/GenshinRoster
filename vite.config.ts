import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 双模式构建：
 *  - 默认（网页版，部署 GitHub Pages）：标准多文件产物，图片/字体为独立资源，
 *    配合 <img loading="lazy"> 按需加载，首屏秒开。输出到 dist/。
 *  - `vite build --mode single`（离线分享版）：所有资源内联进单个 HTML，
 *    双击即可在 file:// 下运行。输出到 dist-single/。
 */
const SINGLE_OUT_DIR = 'dist-single'

// 自定义插件：单文件模式下去除内联 script 的 type="module" 和 crossorigin 属性
// 这两个属性会导致 file:// 协议下浏览器 CORS 拦截，使 JS 不执行（页面纯黑）
function stripModuleAttributes(outDir: string) {
  return {
    name: 'strip-module-attributes',
    closeBundle() {
      const htmlPath = resolve(__dirname, `${outDir}/index.html`);
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
export default defineConfig(({ command, mode }) => {
  const isSingle = mode === 'single'
  const outDir = isSingle ? SINGLE_OUT_DIR : 'dist'

  const singleOnly = isSingle
    ? [
        viteSingleFile(),
        stripModuleAttributes(outDir),
      ]
    : []

  return {
    base: './',
    build: {
      outDir,
      // 网页版无 sourcemap；单文件版也无（内联产物无需 map）
      sourcemap: false,
      cssCodeSplit: !isSingle,
      // 单文件模式：所有资源内联（含头像/字体）；网页模式走默认 4KB 内联阈值
      assetsInlineLimit: isSingle ? 100000000 : undefined,
      chunkSizeWarningLimit: 100000000,
      rollupOptions: isSingle
        ? {
            output: {
              // 输出 IIFE 格式，去除 type="module"，使产物可在 file:// 下直接执行
              format: 'iife',
              inlineDynamicImports: true,
            },
          }
        : undefined,
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
      ...singleOnly,
    ],
  }
})
