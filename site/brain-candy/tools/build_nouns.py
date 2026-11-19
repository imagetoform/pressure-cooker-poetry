# Builds bench/nouns.json for the N+7 station. Needs: pip install wordfreq; npm install wordnet-db (run inside a scratch folder).
# N+7 dictionary: common English words whose WordNet senses are mostly nouns, sorted A-Z.
import re, json
from wordfreq import zipf_frequency
D = "node_modules/wordnet-db/dict/"
def counts(pos):
    out = {}
    for line in open(D+"index."+pos, encoding="latin-1"):
        if line.startswith(" "): continue
        f = line.split()
        out[f[0]] = int(f[2])
    return out
n, v, a, r = counts("noun"), counts("verb"), counts("adj"), counts("adv")
# keep only lemmas WordNet spells lowercase somewhere (drops Aaron, Pepsi, Libya...)
lower = set(); bad = {"nazi","nazism","fascist"}
for line in open(D+"data.noun", encoding="latin-1"):
    if line.startswith(" "): continue
    f = line.split(); wc = int(f[3], 16)
    for i in range(wc):
        w = f[4+2*i]
        if w == w.lower(): lower.add(w)
    gloss = line.split("|",1)[1].lower() if "|" in line else ""
    if any(k in gloss for k in ("slur","offensive","disparag","derogatory","obscene","vulgar")):
        for i in range(wc): bad.add(f[4+2*i].lower())
STOP = set("""a about above after again against all am an and any are as at be been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other ought our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves also yet ever never every much many may might must shall upon thus whose whom whatever whoever per via plus""".split())
keep = []
for w, c in n.items():
    if not re.fullmatch(r"[a-z]{3,14}", w) or w not in lower: continue
    other = v.get(w,0) + a.get(w,0) + r.get(w,0)
    if c < other or w in bad or w in STOP: continue
    z = zipf_frequency(w, "en")
    if z < 3.0: continue
    keep.append(w)
keep.sort()
json.dump(keep, open("../nouns.json","w"))
print(len(keep), "nouns;", keep[:5], "...", [w for w in keep if w.startswith("lib")])
