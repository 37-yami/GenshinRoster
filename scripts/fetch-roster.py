# -*- coding: utf-8 -*-
"""
从 BWIKI（wiki.biligame.com）拉取崩坏：星穹铁道 / 绝区零 全量角色数据与头像：

1. SMW ask API 拉取角色（名称/稀有度/属性/命途或特性阵营/实装日期/版本）
2. 过滤：剔除未实装（无日期）与实装日期晚于 今日+7天 的角色（与 BWIKI 图鉴口径一致）
3. 合并：同名角色的不同形态（开拓者 5 命途、三月七 2 命途）合并为一条，取最早实装形态
4. 生成 src/data/{hsr,zzz}/characters.ts（id=中文名）
5. 下载头像到 src/portraits/{hsr,zzz}/{名}.png（已存在则跳过）
   - HSR: 文件:{名}头像.png（128×128）
   - ZZZ: 文件:角色头像-{名}.png（方形）

用法：python scripts/fetch-roster.py
依赖：仅 Python 标准库
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) roster-fetch/1.0"}
RELEASE_CUTOFF = date.today() + timedelta(days=7)
REQUEST_INTERVAL = 0.4  # 每次请求间隔（秒），避免触发 BWIKI 限流

# Windows 控制台默认 GBK，遇到 •、「」等字符会崩溃，强制 UTF-8 输出
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

GAMES = {
    "hsr": {
        "api": "https://wiki.biligame.com/sr/api.php",
        "ask": "[[分类:角色]]|?名称|?稀有度|?命途|?元素属性|?实装日期|?实装版本|sort=实装日期|order=desc|limit=500",
        "rarity": {"5星": 5, "4星": 4},
        # 常规角色为 {名}头像.png；•变体角色（姬子•启行等）无此文件，回退 {名}.png（160×160）
        "avatar_titles": lambda name: [f"文件:{name}头像.png", f"文件:{name}.png"],
    },
    "zzz": {
        "api": "https://wiki.biligame.com/zzz/api.php",
        "ask": "[[分类:角色]]|?稀有度|?属性|?特性|?阵营|?实装日期|?实装版本|sort=实装日期|order=desc|limit=500",
        "rarity": {"S": 5, "A": 4},
        "avatar_titles": lambda name: [f"文件:角色头像-{name}.png"],
    },
}


def fetch_url(url: str, retries: int = 4) -> bytes:
    last_err: Exception | None = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=120) as resp:
                data = resp.read()
            time.sleep(REQUEST_INTERVAL)
            return data
        except Exception as e:  # 网络/限流错误统一重试
            last_err = e
            wait = 2 * (attempt + 1)
            print(f"  [重试 {attempt + 1}/{retries}] {e}，{wait}s 后重试")
            time.sleep(wait)
    raise last_err  # type: ignore[misc]


def get_json(url: str):
    return json.loads(fetch_url(url).decode("utf-8"))


def api_url(api: str, **params) -> str:
    return api + "?" + urllib.parse.urlencode(params)


def parse_date(s: str):
    m = re.match(r"(\d{4})年(\d{2})月(\d{2})日", s or "")
    return date(int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None


def fetch_roster(game: str, spec: dict) -> list[dict]:
    data = get_json(api_url(spec["api"], action="ask", query=spec["ask"], format="json"))
    rows = []
    for page, obj in data["query"]["results"].items():
        p = obj["printouts"]
        rel = p.get("实装日期", [])
        rel_date = parse_date(rel[0]) if rel else None
        if rel_date is None:
            continue  # 未实装
        if rel_date > RELEASE_CUTOFF:
            continue  # 与 BWIKI 图鉴口径一致：一周内将实装的不计入
        name = (p.get("名称") or [page])[0]
        rar_raw = (p.get("稀有度") or [""])[0]
        if rar_raw not in spec["rarity"]:
            raise ValueError(f"{game} {name}: 未知稀有度 {rar_raw!r}")
        row = {
            "page": page,
            "name": name,
            "rarity": spec["rarity"][rar_raw],
            "rel_date": rel_date,
            "version": (p.get("实装版本") or [""])[0],
        }
        if game == "hsr":
            row["element"] = (p.get("元素属性") or [""])[0]
            row["group"] = (p.get("命途") or [""])[0]
            row["tag"] = None
        else:
            row["element"] = (p.get("属性") or [""])[0]
            row["group"] = (p.get("阵营") or [""])[0]
            row["tag"] = (p.get("特性") or [""])[0]
        for k in ("element", "group"):
            if not row[k]:
                raise ValueError(f"{game} {name}: 缺少 {k}")
        if game == "zzz" and not row["tag"]:
            raise ValueError(f"zzz {name}: 缺少特性")
        rows.append(row)

    # 同名角色（同一角色表的多形态）合并为一条，取最早实装形态
    merged: dict[str, dict] = {}
    for row in sorted(rows, key=lambda r: (r["rel_date"], r["page"])):
        if row["name"] not in merged:
            merged[row["name"]] = row
    return sorted(merged.values(), key=lambda r: (r["rel_date"], r["page"]))


def download_avatars(game: str, spec: dict, rows: list[dict]) -> list[str]:
    out_dir = ROOT / "src" / "portraits" / game
    out_dir.mkdir(parents=True, exist_ok=True)
    todo = [r for r in rows if not (out_dir / (r["name"] + ".png")).exists()]
    if not todo:
        return []
    # 批量查询文件 URL（每批 50 个标题），避免逐个请求触发限流
    all_titles: list[str] = []
    for r in todo:
        all_titles.extend(spec["avatar_titles"](r["page"]))
    title_to_url: dict[str, str] = {}
    for i in range(0, len(all_titles), 50):
        batch = all_titles[i : i + 50]
        info = get_json(
            api_url(
                spec["api"],
                action="query",
                titles="|".join(batch),
                prop="imageinfo",
                iiprop="url",
                format="json",
            )
        )
        for page_obj in info["query"]["pages"].values():
            img = (page_obj.get("imageinfo") or [{}])[0]
            if img.get("url"):
                title_to_url[page_obj["title"]] = img["url"]
    missing = []
    for row in todo:
        # 按回退链取第一个存在的文件
        url = next(
            (title_to_url[t] for t in spec["avatar_titles"](row["page"]) if t in title_to_url),
            None,
        )
        if not url:
            missing.append(spec["avatar_titles"](row["page"])[0])
            continue
        (out_dir / (row["name"] + ".png")).write_bytes(fetch_url(url))
        print(f"  头像 {game}/{row['name']}.png 已下载")
    return missing


def emit_ts(game: str, rows: list[dict]):
    header = {
        "hsr": (
            "/**\n"
            " * 崩坏：星穹铁道角色数据（由 scripts/fetch-roster.py 生成，请勿手工编辑）\n"
            " *\n"
            " * 字段：id/name（同名多形态已合并，如开拓者/三月七取初始形态）、element（属性）、\n"
            " * rarity（5/4）、group（命途）、rel（实装日期，排序用）\n"
            " */\n"
            "export interface HsrCharacter {\n"
            "  id: string;\n  name: string;\n  element: string;\n  rarity: 4 | 5;\n  group: string;\n  rel: string;\n}\n\n"
            "export const HSR_CHARACTERS: HsrCharacter[] = [\n"
        ),
        "zzz": (
            "/**\n"
            " * 绝区零代理人数据（由 scripts/fetch-roster.py 生成，请勿手工编辑）\n"
            " *\n"
            " * 字段：id/name、element（属性）、rarity（内部 5=S级 / 4=A级，显示层映射）、\n"
            " * group（阵营）、tag（特性）、rel（实装日期，排序用）\n"
            " */\n"
            "export interface ZzzCharacter {\n"
            "  id: string;\n  name: string;\n  element: string;\n  rarity: 4 | 5;\n  group: string;\n  tag: string;\n  rel: string;\n}\n\n"
            "export const ZZZ_CHARACTERS: ZzzCharacter[] = [\n"
        ),
    }[game]
    lines = []
    for r in rows:
        tag_field = f', tag: "{r["tag"]}"' if game == "zzz" else ""
        lines.append(
            f'  {{ id: "{r["name"]}", name: "{r["name"]}", element: "{r["element"]}", '
            f'rarity: {r["rarity"]}, group: "{r["group"]}"{tag_field}, rel: "{r["rel_date"].isoformat()}" }},'
        )
    body = "\n".join(lines) + "\n];\n"
    out = ROOT / "src" / "data" / game / "characters.ts"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(header + body, encoding="utf-8", newline="\n")


def main():
    for game, spec in GAMES.items():
        print(f"== {game} ==")
        rows = fetch_roster(game, spec)
        n5 = sum(1 for r in rows if r["rarity"] == 5)
        n4 = len(rows) - n5
        print(f"角色 {len(rows)} 名（5★ {n5} / 4★ {n4}），最新：{rows[-1]['name']}（{rows[-1]['version']}）")
        emit_ts(game, rows)
        missing = download_avatars(game, spec, rows)
        if missing:
            print(f"  [警告] {len(missing)} 张头像未找到：{missing}", file=sys.stderr)


if __name__ == "__main__":
    main()
