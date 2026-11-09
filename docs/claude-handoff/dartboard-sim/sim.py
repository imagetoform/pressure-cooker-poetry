"""Seeded simulation of the PCP dartboard (pcp-dartboard-system.md, sections 3-4).

Spec choices it leaves open, made explicit here:
  - recipe hash: FNV-1a over ingredient ids joined in order
  - per-dart randomness: mulberry32 seeded by hash + dart index
  - wobble width: base +/-W, plus (noise - order) / 3, clamped to 0..2W
Run: python3 sim.py
"""
import random, collections as C

def fnv1a(s):
    h = 0x811c9dc5
    for ch in s.encode():
        h = ((h ^ ch) * 0x01000193) & 0xffffffff
    return h

def mulberry32(a):
    def r():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xffffffff
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xffffffff
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xffffffff)) & 0xffffffff
        return ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
    return r

def throw(ing, seed, dart, W, fix=False):
    rnd = mulberry32((seed + dart * 0x9E3779B9) & 0xffffffff)
    width = max(0, min(2 * W, round(W + (ing['noise'] - ing['order']) / 3)))
    wob = round(rnd() * 2 * width) - width
    if not fix:                                   # the spec as written
        score = (ing['family'] * 10 + ing['intensity'] - 1 + wob) % 200
        return score // 10, score % 10 + 1
    # proposed fix: wobble moves intensity inside the wedge (clamped);
    # a separate small chance slips the family sideways, keeping intensity
    inten = min(10, max(1, ing['intensity'] + wob))
    fam = ing['family']
    if rnd() < abs(wob) / (2 * W + 1) * 0.5:
        fam = (fam + (1 if wob > 0 else -1)) % 20
    return fam, inten

def recipe_room(ings, W, fix=False):
    seed = fnv1a('|'.join(i['id'] for i in ings))
    darts = [throw(i, seed, k, W, fix) for k, i in enumerate(ings)]
    if len(darts) == 3:  # short recipe: darts 4-5 rethrown near dart 3
        b = ings[2]
        darts += [throw(b, seed ^ 0xA5A5, 3, W, fix), throw(b, seed ^ 0x5A5A, 4, W, fix)]
    return seed, darts

band = lambda x: 'mild' if x <= 3 else 'intense' if x >= 8 else 'middle'
FAM = ['Bitter Grief','Sour Agitation','Sweet Nostalgia','Salt Labor','Umami Comfort','Burnt Rage','Smoke Mysticism','Metallic Paranoia','Fermented Decay','Sugar Rush Infomercial','Chalk Bureaucracy','Citrus Joy','Ash Aftermath','Pepper Riot','Honey Tenderness','Brine Longing','Raw Exposure','Spoiled Satire','Bland Void','Spice Ecstasy']

def run(W, fix=False, N=100_000):
    g = random.Random(1)
    pantry = [dict(id=f'ing-{f:02d}-{i}-{k}', family=f, intensity=i,
                   noise=g.randint(0, 10), order=g.randint(0, 10))
              for f in range(20) for i in range(1, 11) for k in range(3)]
    st = C.Counter(); fams = C.Counter(); bands = C.Counter(); per_layer_fam = C.defaultdict(C.Counter)
    for _ in range(N):
        ings = g.sample(pantry, g.choice([3, 3, 4, 5, 5, 6, 7]))
        seed, darts = recipe_room(ings, W, fix)
        if seed == recipe_room(ings, W, fix)[0] and darts != recipe_room(ings, W, fix)[1]:
            st['nondeterministic'] += 1
        for k, (f, x) in enumerate(darts):
            home = ings[min(k, len(ings) - 1)] if not (len(ings) == 3 and k >= 3) else ings[2]
            st['darts'] += 1
            st['slip'] += f != home['family']
            hb, lb = band(home['intensity']), band(x)
            st['whisper_to_scream'] += hb == 'mild' and lb == 'intense'
            st['scream_to_whisper'] += hb == 'intense' and lb == 'mild'
            st['mild_homes'] += hb == 'mild'; st['intense_homes'] += hb == 'intense'
            st['wrap_grief_ecstasy'] += {home['family'], f} == {0, 19}
            fams[f] += 1; bands[lb] += 1
            per_layer_fam[min(k, 4)][f] += 1
        if len(ings) == 3:
            st['short'] += 1
            st['short_same_family'] += darts[3][0] == darts[2][0] and darts[4][0] == darts[2][0]
    D = st['darts']
    out = {
        'darts': D,
        'slip into a neighbouring family': st['slip'] / D,
        'whisper home landing as a scream': st['whisper_to_scream'] / st['mild_homes'],
        'scream home landing as a whisper': st['scream_to_whisper'] / st['intense_homes'],
        'grief <-> ecstasy wraparound': st['wrap_grief_ecstasy'] / D,
        'landing bands': {k: round(v / D, 3) for k, v in bands.items()},
        'family share min..max': (round(min(fams.values()) / D, 4), round(max(fams.values()) / D, 4)),
        'short recipes: motion+grit same family as bodies': st['short_same_family'] / st['short'],
        'non-deterministic rooms': st['nondeterministic'],
    }
    return out

if __name__ == '__main__':
    for W, fix in ((3, False), (6, False), (3, True), (6, True)):
        print(f'\n== wobble +/-{W} ', '(proposed fix)' if fix else '(spec as written)')
        for k, v in run(W, fix).items():
            print(f'  {k}: {v:.3f}' if isinstance(v, float) else f'  {k}: {v}')
