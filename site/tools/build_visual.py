"""Reuse the built Kitchen runtime, without its pantry UI, for the visual front door."""
import hashlib
import json
from pathlib import Path
import re
import shutil

SITE = Path(__file__).resolve().parents[1]
REPO = SITE.parent

def assemble():
    pub = SITE / 'public'
    source = SITE / 'visual'
    kitchen = (SITE / 'dist/index.html').read_text()
    target = pub / 'visual'
    shutil.copytree(source, target, dirs_exist_ok=True)
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', kitchen, re.S)
    # Explicit module headers: no Kitchen app, coupon dialog, lab or storage side effects.
    modules = ('POEM MANIFEST', 'ESSAY MANIFEST', 'INGREDIENT MANIFEST', 'THE BIG PANTRY', '— TASTES', 'THE DARTBOARD (', 'THE STYLE TREE', 'CUTOUT / ASSET MANIFEST', 'THE ENGINE', 'FALLBACK GRAPHICS', 'LAYOUT FAMILIES + RENDERER')
    runtime = '\n'.join(s for s in scripts if any(m in s[:250] for m in modules) or 'window.PCP.kits =' in s or 'P.DB_MIN =' in s)
    assert 'PCP.render = render' in runtime and 'PCP.engine = {' in runtime
    css = '\n'.join(re.findall(r'<style[^>]*>(.*?)</style>', kitchen, re.S))
    # Content-derived version covers data, renderer, kits, adapter, UI, CSS and all published artwork.
    h = hashlib.sha256()
    h.update(runtime.encode()); h.update(css.encode())
    paths = sorted(p for p in source.rglob('*') if p.is_file()) + sorted(p for p in (SITE/'dist/assets').rglob('*') if p.is_file())
    for p in paths:
        h.update(str(p.relative_to(SITE)).encode()); h.update(p.read_bytes())
    version = 'sha256:' + h.hexdigest()
    runtime += '\nwindow.PCP.visualBuild = ' + json.dumps(version) + ';\n'
    # Local Kitchen cutouts resolve correctly from /, /visual-picks/ and direct receipt links.
    runtime += '\nPCP.assets.forEach(function(a){if(a.src && !/^(https?:|data:|\\/)/.test(a.src))a.src="/kitchen/"+a.src;});\n'
    (target/'runtime.js').write_text(runtime)
    (target/'runtime.css').write_text(css)
    shutil.copyfile(source/'index.html', pub/'index.html')
    (pub/'visual-picks').mkdir(exist_ok=True)
    shutil.copyfile(source/'index.html',pub/'visual-picks/index.html')
    (target/'version.json').write_text(json.dumps({'build':version,'engine':'kitchen-adapter/1','prng':'cyrb128-sfc32/warmup15'},indent=2))
    print('visual:',version)

if __name__ == '__main__':
    assemble()
