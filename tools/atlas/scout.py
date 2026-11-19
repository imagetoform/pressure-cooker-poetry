#!/usr/bin/env python3
"""PCP Atlas scout: bounded, source-first discovery. Only captures metadata.
No scraped code executed, no unauthorized image downloads or website publishing.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import sys
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[2]
SOURCES = ROOT / "library/atlas/sources.json"
OUT = ROOT / "library/atlas/discoveries.json"
ALLOWED_APIS = {"api.github.com", "api.are.na"}

def stable_id(url):
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]

def fetch_json(url, token=None):
    from urllib.parse import urlparse
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname not in ALLOWED_APIS:
        raise ValueError("Disallowed API host")
    headers = {"User-Agent": "PCP-Visual-Atlas/1.0 (source-preserving research)",
               "Accept": "application/vnd.github+json" if parsed.hostname == "api.github.com" else "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = Request(url, headers=headers)
    with urlopen(req, timeout=14) as response:
        if response.status != 200:
            raise ValueError("HTTP " + str(response.status))
        if int(response.headers.get("Content-Length", "0")) > 2_000_000:
            raise ValueError("Response too large")
        raw = response.read(2_000_001)
        if len(raw) > 2_000_000:
            raise ValueError("Response too large")
        return json.loads(raw)

def make_record(url, title, platform, kind, source_id, tags, **extra):
    return {"id": stable_id(url), "url": url, "title": (title or "Untitled")[:180],
            "platform": platform, "kind": kind, "source_id": source_id,
            "tags": list(dict.fromkeys(tags))[:12],
            "rights": extra.pop("rights", "reference_only"),
            "status": "research", **extra}

def seed(sources):
    return [make_record(s["url"], s["title"], s["platform"], "source-board", s["id"],
                        s.get("tags", []), rights=s.get("rights", "reference_only"))
            for s in sources if s["type"] in ("reference-link", "arena-channel") and s.get("url")]

def github_items(source, limit):
    url = "https://api.github.com/search/repositories?" + urlencode({
        "q": source["query"], "sort": "updated", "order": "desc", "per_page": limit})
    data = fetch_json(url, os.getenv("GITHUB_TOKEN"))
    for repo in data.get("items", [])[:limit]:
        link = repo.get("html_url", "")
        if not link.startswith("https://github.com/"):
            continue
        license_info = repo.get("license") or {}
        spdx = license_info.get("spdx_id") or "UNVERIFIED"
        yield make_record(link, repo.get("full_name", ""), "github", "code-repository",
                          source["id"], source.get("tags", []),
                          rights="verify_before_reuse", license_spdx=spdx,
                          description=(repo.get("description") or "")[:400],
                          language=repo.get("language"),
                          stars=int(repo.get("stargazers_count", 0)))

def arena_items(source, limit):
    slug = source["slug"]
    url = "https://api.are.na/v3/channels/" + slug + "/contents?" + urlencode({"page": 1, "per": limit})
    data = fetch_json(url, os.getenv("ARENA_ACCESS_TOKEN"))
    for block in data.get("data", [])[:limit]:
        ident = block.get("id")
        if not ident:
            continue
        link = block.get("url") or "https://www.are.na/block/" + str(ident)
        if not isinstance(link, str) or not link.startswith("https://"):
            link = "https://www.are.na/block/" + str(ident)
        title = block.get("title") or block.get("name") or block.get("description") or "Are.na block"
        if not isinstance(title, str):
            title = "Are.na block"
        yield make_record(link, title, "are.na", "visual-reference", source["id"],
                          source.get("tags", []), rights="reference_only",
                          block_id=str(ident), block_type=str(block.get("type", "block")))

def collect(offline=False, limit=5):
    sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    old = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else []
    records = {r["url"]: r for r in old if isinstance(r, dict) and r.get("url")}
    additions, errors = 0, []
    for record in seed(sources):
        if record["url"] not in records:
            records[record["url"]] = record
            additions += 1
    if not offline:
        feeds = [s for s in sources if s["type"] in ("github-query", "arena-channel")]
        for source in feeds:
            try:
                stream = github_items(source, limit) if source["type"] == "github-query" else arena_items(source, limit)
                for record in stream:
                    if record["url"] not in records:
                        records[record["url"]] = record
                        additions += 1
                time.sleep(1)
            except (HTTPError, URLError, TimeoutError, ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
                errors.append(source["id"] + ": " + type(exc).__name__ + " " + str(exc)[:140])
    output = sorted(records.values(), key=lambda r: (r.get("platform", ""), r.get("url", "")))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"total": len(output), "new": additions, "errors": errors}, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--offline", action="store_true", help="Seed references only, no requests")
    p.add_argument("--limit", type=int, default=5)
    args = p.parse_args()
    if not 1 <= args.limit <= 20:
        sys.exit("limit must be 1..20")
    sys.exit(collect(args.offline, args.limit))
