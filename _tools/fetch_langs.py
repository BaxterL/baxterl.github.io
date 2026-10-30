"""Fetch per-repo language breakdowns (bytes) from the GitHub API and cache them.

The repo list only exposes a single "primary" language, which misfiles repos like
maison-des-mots (CSS) or campus_food (PLpgSQL). This pulls the full byte map so the
site can show the real dominant *code* language and a global language mix.

Usage: python _tools/fetch_langs.py
"""

from __future__ import annotations

import json
import pathlib
import time
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
REF = ROOT.parent / "_ref"
REPOS = REF / "gh-repos.json"
CACHE = REF / "lang-stats.json"

DB_LANGS = {"PLpgSQL", "SQL", "TSQL", "PLSQL", "MySQL", "SQLPL", "PLSQL"}


def get(url: str):
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "baxterl-site-build",
        },
    )
    with urllib.request.urlopen(req, timeout=25) as res:
        remaining = res.headers.get("x-ratelimit-remaining")
        return json.loads(res.read().decode("utf-8")), remaining


def main() -> None:
    repos = json.loads(REPOS.read_text(encoding="utf-8"))
    cache: dict[str, dict[str, int]] = {}
    if CACHE.exists():
        cache = json.loads(CACHE.read_text(encoding="utf-8"))

    targets = [r["name"] for r in repos if not r.get("fork") and r["name"] != "BaxterL"]
    todo = [name for name in targets if name not in cache]
    print(f"{len(targets)} repos, {len(todo)} to fetch")

    for i, name in enumerate(todo, 1):
        url = f"https://api.github.com/repos/BaxterL/{name}/languages"
        try:
            data, remaining = get(url)
            cache[name] = data
            print(f"[{i}/{len(todo)}] {name}: {len(data)} langs (remaining {remaining})")
        except urllib.error.HTTPError as err:
            print(f"[{i}/{len(todo)}] {name}: HTTP {err.code} — stop")
            break
        except Exception as err:  # noqa: BLE001
            print(f"[{i}/{len(todo)}] {name}: {err} — skip")
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
        time.sleep(0.35)

    # summary
    totals: dict[str, int] = {}
    for langs in cache.values():
        for lang, size in langs.items():
            totals[lang] = totals.get(lang, 0) + size
    clean = {k: v for k, v in totals.items() if k not in DB_LANGS}
    top = sorted(clean.items(), key=lambda kv: kv[1], reverse=True)[:8]
    grand = sum(clean.values()) or 1
    print("\ncode languages across repos:")
    for lang, size in top:
        print(f"  {lang:14s} {size / grand * 100:5.1f}%")


if __name__ == "__main__":
    main()
