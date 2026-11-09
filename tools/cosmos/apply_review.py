"""Copy first-pass visual notes into a Cosmos reference-only batch file."""

import argparse
import json
import re
from pathlib import Path

EMOTIONS = set(
    "ecstasy joy serenity admiration trust acceptance terror fear apprehension "
    "amazement surprise distraction grief sadness pensiveness loathing disgust boredom "
    "rage anger annoyance vigilance anticipation interest love submission awe "
    "disapproval remorse contempt aggressiveness optimism overwhelm".split()
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("batch", type=Path)
    parser.add_argument("notes", type=Path)
    args = parser.parse_args()
    batch = json.loads(args.batch.read_text(encoding="utf-8"))
    reviewed = set()
    for line in args.notes.read_text(encoding="utf-8").splitlines():
        if not re.match(r"^\|\s*\d+\s*\|", line):
            continue
        parts = [part.strip() for part in line.strip().strip("|").split("|")]
        if len(parts) != 6:
            raise ValueError(f"Expected six columns: {line}")
        position = int(parts[0])
        item = batch["items"][position - 1]
        cosmos_id = int(re.search(r"\[(\d+)\]", parts[1]).group(1))
        if item["position"] != position or item["cosmos_id"] != cosmos_id:
            raise ValueError(f"Position or ID mismatch at {position}")
        emotions = [word.strip() for word in parts[4].split(",")]
        if len(emotions) < 2 or len(emotions) > 4 or not set(emotions) <= EMOTIONS:
            raise ValueError(f"Invalid emotion tags at {position}: {emotions}")
        item.update(
            label=parts[2],
            categories=[category.strip() for category in parts[3].split(",")],
            emo=emotions,
            cutup_note=parts[5],
            visual_review="reviewed_first_pass",
        )
        reviewed.add(position)
    if reviewed != set(range(1, len(batch["items"]) + 1)):
        raise ValueError("Visual notes do not cover the full batch")
    args.batch.write_text(json.dumps(batch, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Reviewed {len(reviewed)} references; rights remain unverified")


if __name__ == "__main__":
    main()
