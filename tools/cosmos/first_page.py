"""Capture the public first page of a Cosmos collection as reference metadata.

This does not download or license any image. Later pages require a separate,
reviewed browser export; do not treat the Cosmos GraphQL endpoint as public API.
"""

import argparse
import json
import urllib.request
from pathlib import Path

BOARD = "https://www.cosmos.so/brandonrhodes/website-design-inspo"


def extract(html: str) -> dict:
    marker = '"clusterConnections":'
    start = 0
    while (start := html.find(marker, start)) >= 0:
        data, _ = json.JSONDecoder().raw_decode(html[start + len(marker) :])
        if isinstance(data, dict) and isinstance(data.get("items"), list):
            return data
        start += len(marker)
    raise ValueError("Collection items not found in page")


def normalize(data: dict) -> dict:
    items = []
    for index, connection in enumerate(data["items"], 1):
        element = connection["element"]
        source = element.get("source") or {}
        media = element.get("media") or {}
        owner = element.get("owner") or {}
        items.append(
            {
                "position": index,
                "cosmos_id": element["id"],
                "cosmos_url": element["shareUrl"],
                "saved_by": owner.get("username"),
                "source_url": source.get("url"),
                "source_author": source.get("author"),
                "cosmos_public_domain_flag": source.get("isPublicDomain"),
                "media_id": media.get("mediaId"),
                "media_width": media.get("width"),
                "media_height": media.get("height"),
                "generated_caption": (element.get("generatedCaption") or {}).get("text") or None,
                "rights_status": "unverified",
                "intake_status": "reference_only",
                "visual_review": "pending",
                "label": None,
                "categories": [],
                "emo": [],
                "cutup_note": None,
            }
        )
    return {
        "board_url": BOARD,
        "batch": 1,
        "collection_count_at_capture": data["meta"]["count"],
        "next_page_cursor": data["meta"].get("nextPageCursor"),
        "items": items,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--html", type=Path, help="Use a saved public page instead of fetching it")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    html = args.html.read_text(encoding="utf-8") if args.html else urllib.request.urlopen(BOARD, timeout=30).read().decode("utf-8")
    result = normalize(extract(html))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Captured {len(result['items'])} of {result['collection_count_at_capture']} references")


if __name__ == "__main__":
    main()
