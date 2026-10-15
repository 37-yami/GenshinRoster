# -*- coding: utf-8 -*-
"""
将 src/portraits/{genshin,hsr,zzz}/*.png 压缩为 WebP（卡片显示尺寸约 130px，
压缩到最长边 208px / 质量 80 已足够清晰），使单文件离线版体积减半以上。

- 不放大小图（短边小于目标的原样转换）
- 幂等：只处理存在的 .png，转换后删除原 .png
- 配合 scripts/fetch-roster.py：新拉取的头像为 PNG，跑本脚本后转为 WebP

用法：python scripts/compress-portraits.py
依赖：pip install pillow
"""
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PORTRAITS = ROOT / "src" / "portraits"
MAX_SIDE = 208
QUALITY = 80

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

def main() -> None:
    pngs = list(PORTRAITS.rglob("*.png"))
    if not pngs:
        print("没有待压缩的 PNG")
        return
    total_before = 0
    total_after = 0
    for png in pngs:
        img = Image.open(png)
        if img.mode not in ("RGB", "RGBA"):
            img = img.convert("RGBA")
        w, h = img.size
        scale = min(1.0, MAX_SIDE / max(w, h))
        if scale < 1.0:
            img = img.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        out = png.with_suffix(".webp")
        img.save(out, "WEBP", quality=QUALITY, method=6)
        before, after = png.stat().st_size, out.stat().st_size
        total_before += before
        total_after += after
        png.unlink()
        print(f"  {out.relative_to(ROOT)}  {before/1024:.0f}KB -> {after/1024:.0f}KB")
    print(
        f"共 {len(pngs)} 张，{total_before/1024/1024:.1f}MB -> {total_after/1024/1024:.1f}MB"
        f"（压缩到 {total_after / max(total_before, 1) * 100:.0f}%）"
    )


if __name__ == "__main__":
    main()
