"""Unpack delivery zips into their own folders, dropping any image already received.

Usage: python3 tools/cutouts/unpack.py DEST_DIR ZIP [ZIP ...]

Each zip goes into DEST_DIR/<zip name>/ (never into the repo). Every PNG is compared by
sha256 with every PNG already under DEST_DIR (earlier deliveries; link older delivery
folders in so they count); repeats are skipped and removed from the zip's sidecar, so
ingest.py only sees new pieces. Prints one line per zip with Muse's own count note.
Zips are read, never executed; names are reduced to their basename.
"""
import glob, hashlib, json, os, sys, zipfile

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
H = lambda b: hashlib.sha256(b).hexdigest()


def main():
    dest, zips = sys.argv[1], sys.argv[2:]
    os.makedirs(dest, exist_ok=True)
    seen = set()
    for f in glob.glob(os.path.join(dest, '*', '*.png')):
        seen.add(H(open(f, 'rb').read()))
    whole = set()
    for f in glob.glob(os.path.join(dest, '*.zip.sha256')):
        whole.add(open(f).read().strip())
    for z in zips:
        name = os.path.splitext(os.path.basename(z))[0]
        name = name.split('-', 1)[1] if len(name) > 9 and name[8] == '-' else name   # drop upload prefixes like 470a9b49-
        raw = open(z, 'rb').read()
        if H(raw) in whole:
            print(f'{name:34} SKIPPED: identical to a zip already unpacked'); continue
        out = os.path.join(dest, name)
        os.makedirs(out, exist_ok=True)
        zf = zipfile.ZipFile(z); pngs = dup = 0; dups = []
        for i in zf.infolist():
            b = os.path.basename(i.filename)
            if not b or b.startswith('.'):
                continue
            data = zf.read(i)
            if b.lower().endswith('.png'):
                pngs += 1
                h = H(data)
                if h in seen:
                    dup += 1; dups.append(b); continue
                seen.add(h)
            open(os.path.join(out, b), 'wb').write(data)
        sc = os.path.join(out, 'cutouts.json'); note = ''; n = 0
        if os.path.exists(sc):
            s = json.load(open(sc))
            if isinstance(s, dict):
                s['cutouts'] = [r for r in s.get('cutouts', []) if (r.get('file') or r['id'] + '.png') not in dups]
                n = len(s['cutouts']); note = str(s.get('count_note', ''))[:100]
            else:
                s = [r for r in s if r.get('file') not in dups]; n = len(s)
            json.dump(s, open(sc, 'w'), indent=1)
        else:
            note = 'NO cutouts.json sidecar'
        open(os.path.join(dest, name + '.zip.sha256'), 'w').write(H(raw))
        print(f'{name:34} pngs {pngs:3}  repeats {dup:2}  new {n:3} | {note}')


if __name__ == '__main__':
    main()
