import json
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).parent))
import scout
import gallery

class AtlasTests(unittest.TestCase):
    def test_deterministic_identifier(self):
        self.assertEqual(scout.stable_id("https://example.com/a"), scout.stable_id("https://example.com/a"))
        self.assertNotEqual(scout.stable_id("https://example.com/a"), scout.stable_id("https://example.com/b"))
    def test_url_guard(self):
        for bad in ("http://example.com", "javascript:alert(1)", "file:///etc/passwd", ""):
            self.assertEqual(gallery.safe_url(bad), "#")
    def test_seed_preserves_all_references(self):
        sources = json.loads(scout.SOURCES.read_text(encoding="utf-8"))
        seeded = scout.seed(sources)
        self.assertEqual(len(seeded), len([s for s in sources if s.get("url") and s["type"] in ("reference-link","arena-channel")]))
        self.assertTrue(all(p["rights"] != "approved_for_public_site" for p in seeded))
    def test_markup_escape(self):
        self.assertEqual(gallery.e('"><script>'), '&quot;&gt;&lt;script&gt;')

if __name__ == "__main__":
    unittest.main()
