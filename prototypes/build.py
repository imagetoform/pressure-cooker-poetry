"""Bundle the reader edition with the private manuscript into one standalone page.

    python3 build.py                 -> dist/pressure-cooker.html (full corpus, never commit)
    python3 build.py --sample        -> dist/pressure-cooker.sample.html (public excerpts)
    python3 build.py forme.html      -> dist/forme.html (same, for THE FORME)

The committed index.html carries only the sample excerpts. The full corpus lives in
corpus/corpus.txt, which is gitignored; this script inlines it so the page runs
anywhere without a server.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent
sample = "--sample" in sys.argv
corpus = (ROOT / "corpus" / ("corpus.sample.txt" if sample else "corpus.txt")).read_text(encoding="utf-8")
if "</script" in corpus.lower():
    sys.exit("corpus contains '</script', refusing to inline")
page_name = next((a for a in sys.argv[1:] if a.endswith(".html")), "index.html")
page = (ROOT / page_name).read_text(encoding="utf-8")
block = re.compile(r'(<script type="text/plain" id="corpus" data-source=")[^"]*(">)(.*?)(</script>)', re.S)
if not block.search(page):
    sys.exit("corpus block not found in index.html")
source = "sample" if sample else "full"
page = block.sub(lambda m: m.group(1) + source + m.group(2) + "\n" + corpus.strip() + "\n" + m.group(4), page, count=1)
stem = "pressure-cooker" if page_name == "index.html" else pathlib.Path(page_name).stem
out = ROOT / "dist" / (f"{stem}.sample.html" if sample else f"{stem}.html")
out.parent.mkdir(exist_ok=True)
out.write_text(page, encoding="utf-8")
poems = corpus.count("=POEM ")
print(f"wrote {out.relative_to(ROOT)}: {poems} poems, {len(page) // 1024} KB")
