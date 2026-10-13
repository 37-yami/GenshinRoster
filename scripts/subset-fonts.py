# -*- coding: utf-8 -*-
"""
字体离线子集脚本：从 Google Fonts 下载 Noto Sans SC / ZCOOL XiaoWei / Cinzel，
按项目源码中实际用到的字符（src/** + index.html）生成 woff2 子集到 src/fonts/，
供 index.css 中 @font-face 本地引用，使单文件构建完全离线可用。

用法：python scripts/subset-fonts.py
依赖：pip install fonttools brotli
"""
import re
import sys
import urllib.request
from pathlib import Path

from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
FONTS_DIR = SRC / "fonts"

FAMILIES = [
    # (css2 family 参数, 输出文件名前缀, 字体族名, weights)
    ("Noto+Sans+SC:wght@300;400;500;700;900", "notosanssc", "Noto Sans SC", [300, 400, 500, 700, 900]),
    ("ZCOOL+XiaoWei", "zcoolxiaowei", "ZCOOL XiaoWei", [400]),
    ("Cinzel:wght@500;700", "cinzel", "Cinzel", [500, 700]),
]

# 额外保底字符：常见标点/符号/数字全角等（即使源码暂未用到也一并子集，防运行时动态拼接）
EXTRA_CHARS = (
    "0123456789０１２３４５６７８９"
    "·×—–―…、。》《」』【】（）：；！？，．“”‘’#%＠＆＋－＝／"
    "★☆✓✔▼▲◆●○①②③④⑤⑥⑦⑧⑨⑩"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
)


def collect_text() -> str:
    chars = set(EXTRA_CHARS)
    files = list(SRC.rglob("*")) + [ROOT / "index.html"]
    for path in files:
        if path.is_file() and path.suffix in {".ts", ".tsx", ".css", ".html"}:
            chars.update(path.read_text(encoding="utf-8", errors="ignore"))
    # 去掉控制字符与空白（保留空格）
    chars = {c for c in chars if (c == " " or ord(c) >= 0x20) and not c.isspace()}
    return "".join(sorted(chars))


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def css_font_urls(family_param: str) -> dict[int, str]:
    css = fetch(f"https://fonts.googleapis.com/css2?family={family_param}&display=swap").decode("utf-8")
    result: dict[int, str] = {}
    for block in css.split("@font-face"):
        weight = re.search(r"font-weight:\s*(\d+)", block)
        url = re.search(r"url\((\S+?)\)", block)
        if weight and url:
            result[int(weight.group(1))] = url.group(1)
    return result


def subset_font(ttf_bytes: bytes, text: str, out_path: Path) -> int:
    import io

    font = TTFont(io.BytesIO(ttf_bytes))
    opts = Options()
    opts.layout_features = ["*"]
    opts.name_IDs = [1, 2]
    opts.notdef_outline = True
    subsetter = Subsetter(options=opts)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff2"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "wb") as f:
        font.save(f)
    return out_path.stat().st_size


def main() -> None:
    text = collect_text()
    print(f"字符集大小: {len(text)}")
    FONTS_DIR.mkdir(parents=True, exist_ok=True)
    css_blocks: list[str] = []
    for family_param, slug, family_name, weights in FAMILIES:
        urls = css_font_urls(family_param)
        for weight in weights:
            if weight not in urls:
                print(f"[跳过] {family_name} {weight}: css 中未找到", file=sys.stderr)
                continue
            print(f"下载 {family_name} {weight} ...")
            data = fetch(urls[weight])
            out = FONTS_DIR / f"{slug}-{weight}.woff2"
            size = subset_font(data, text, out)
            print(f"  -> {out.name}  {size / 1024:.0f} KB")
            css_blocks.append(
                "@font-face {\n"
                f"  font-family: '{family_name}';\n"
                "  font-style: normal;\n"
                f"  font-weight: {weight};\n"
                "  font-display: swap;\n"
                f"  src: url('./fonts/{out.name}') format('woff2');\n"
                "}"
            )
    (FONTS_DIR / "README.txt").write_text(
        "本目录字体为 scripts/subset-fonts.py 生成的项目专用子集，\n"
        "修改 UI 文案或新增角色后请重新运行该脚本。\n",
        encoding="utf-8",
    )
    print("\n生成的 @font-face 块：\n")
    print("\n".join(css_blocks))


if __name__ == "__main__":
    main()
