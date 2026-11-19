#!/usr/bin/env python3
"""Bulk collector for actual object images, not a list of inspiration URLs.

Each run searches the Art Institute of Chicago collection API for public-domain
objects; downloads and cuts images; records provenance, tags and failures.
No asset is published merely because it was found.
"""
import argparse, datetime, hashlib, importlib.util, json, os, pathlib, random, re, sys, time
from collections import Counter
import requests
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("pcp_cutouts", ROOT / "tools/cutouts/run.py")
core = importlib.util.module_from_spec(spec)
spec.loader.exec_module(core)
CAT = ROOT / "library/catalog.json"
BASE = ROOT / "library/cutouts/bulk"
OUT = BASE / "assets"
INDEX = BASE / "manifest.json"
API = "https://api.artic.edu/api/v1/artworks/search"
# Multiple distinct search strata: these are discovery terms, NOT factual style
# attributions. An individual artwork may not belong to the query's movement.
STRATA = {
 "dada": ["photomontage", "collage", "absurd", "assemblage"],
 "constructivism": ["geometric abstraction", "industrial poster", "machinery", "typography"],
 "art-nouveau": ["ornamental design", "botanical illustration", "decorative arts", "floral motif"],
 "surrealism": ["dream", "mask", "strange creature", "disembodied"],
 "punk": ["protest", "satire", "political cartoon", "woodcut"],
 "expressionism": ["woodcut", "linocut", "distorted portrait", "expressionist print"],
 "futurism": ["machine", "movement", "speed", "locomotive"],
 "art-deco": ["streamline", "architectural ornament", "advertising poster", "jazz"],
 "psychedelia": ["optical pattern", "mandala", "spiral ornament", "vision"],
 "brutalism": ["concrete architecture", "industrial building", "sculptural mass", "grid"],
 "vintage-ephemera": ["matchbox", "ticket", "label", "advertisement", "trade card"],
 "symbolic": ["hand", "eye", "skull", "key", "bird", "serpent", "sun"]
}
UA = {"User-Agent":"PressureCookerPoetry-bulk-research/1.0 (+https://github.com/imagetoform/pressure-cooker-poetry)"}
def load(path, default):
    return json.loads(path.read_text()) if path.exists() else default
def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(".tmp")
    temp.write_text(json.dumps(value, ensure_ascii=False, indent=2)+"\n")
    temp.replace(path)
def search(query, page, count):
    # Filter at BOTH API and object level. Metadata is not a licence inference.
    params={"q":query,"page":page,"limit":count,
      "query[term][is_public_domain]":"true",
      "fields":"id,title,image_id,artist_display,date_display,is_public_domain,classification_title,artwork_type_title"}
    r=requests.get(API,params=params,headers=UA,timeout=30);r.raise_for_status()
    return r.json().get("data",[])
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--target",type=int,default=200,help="Maximum freshly cut PNGs to stage")
    ap.add_argument("--per-query",type=int,default=20)
    ap.add_argument("--pages",type=int,default=3)
    ap.add_argument("--max-attempts",type=int,default=900)
    ap.add_argument("--vision",action="store_true",help="Use OpenRouter image model for contextual tags")
    ap.add_argument("--model",default=os.getenv("PCP_MODEL","google/gemini-2.5-flash"))
    ap.add_argument("--seed",type=int,default=20261111)
    a=ap.parse_args()
    if not 1 <= a.target <= 300: ap.error("--target must be 1..300 per run")
    if a.vision and not os.environ.get("OPENROUTER_API_KEY"): ap.error("--vision needs OPENROUTER_API_KEY")
    vocabulary=load(CAT,{})
    movements={m["id"]:m for m in vocabulary.get("movements",[])}
    existing=load(INDEX,[])
    by_id={x["id"]:x for x in existing}
    seen_sha={x.get("sha256") for x in existing if x.get("sha256")}
    quests=[(family,q) for family,queries in STRATA.items() for q in queries]
    random.Random(a.seed).shuffle(quests)
    stats=Counter();failures=[];attempts=0
    stamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    OUT.mkdir(parents=True,exist_ok=True)
    for family,q in quests:
        if stats["added"] >= a.target or attempts >= a.max_attempts: break
        for page in range(1,a.pages+1):
            if stats["added"] >= a.target or attempts >= a.max_attempts: break
            try: found=search(q,page,min(100,max(1,a.per_query)))
            except Exception as exc:
                failures.append({"stage":"search","query":q,"error":str(exc)[:180]});stats["search_fail"]+=1;break
            if not found: break
            for obj in found:
                if stats["added"] >= a.target or attempts >= a.max_attempts: break
                aid=obj.get("id"); iid="aic-"+str(aid)
                if not aid or iid in by_id or not obj.get("is_public_domain") or not obj.get("image_id"):
                    stats["duplicates_or_ineligible"]+=1;continue
                attempts+=1
                image_id=obj["image_id"]
                url="https://www.artic.edu/iiif/2/"+image_id+"/full/1200,/0/default.jpg"
                try:
                    raw=core.http_get(url,binary=True,timeout=45)
                    rawsha=hashlib.sha256(raw).hexdigest()
                    if rawsha in seen_sha: stats["duplicate_bytes"]+=1;continue
                    source_image=Image.open(__import__("io").BytesIO(raw))
                    if min(source_image.size)<200: stats["too_small"]+=1;continue
                    # Existing pipeline's rembg + trimming, not a mere source thumbnail.
                    cutout,coverage=core.cut(raw)
                    if cutout.width<80 or cutout.height<80:stats["bad_crop"]+=1;continue
                    if cutout.mode!="RGBA":cutout=cutout.convert("RGBA")
                    if cutout.getchannel("A").getextrema()==(255,255):
                        # Full rectangular reproduction is NOT a cutout.
                        stats["no_alpha"]+=1;continue
                    if a.vision and family in movements:
                        candidate={"label":obj.get("title") or q,"emo":[],"cats":[]}
                        tags=core.tag(candidate,movements[family],cutout,vocabulary,a.model,False)
                        emotions=tags.get("emo",[])
                        category=tags.get("cats",[])
                        tag_method="vision_on_cutout"
                    else:
                        emotions=[];category=[]
                        tag_method="unreviewed_no_visual_tagging"
                    rel="library/cutouts/bulk/assets/"+iid+".png"
                    output=ROOT / rel
                    output.parent.mkdir(parents=True,exist_ok=True)
                    cutout.save(output,optimize=True)
                    item={"id":iid,"type":"image/png","file":rel,
                      "source":{"institution":"Art Institute of Chicago","object_id":aid,
                        "page_url":"https://www.artic.edu/artworks/"+str(aid),
                        "image_url":url,"title":obj.get("title"),"creator":obj.get("artist_display"),
                        "date":obj.get("date_display"),"classification":obj.get("classification_title"),
                        "is_public_domain":True,"license":"public domain, museum API flag"},
                      "discovery":{"query":q,"suggested_family":family},
                      "editorial":{"family":family,"tag_status":"unreviewed",
                        "emotions":emotions,"categories":category,"method":tag_method,
                        "rationale":"Family inferred from search stratum; not an art historical attribution"},
                      "image":{"width":cutout.width,"height":cutout.height,
                        "alpha_coverage":round(coverage,3),"source_sha256":rawsha},
                      "sha256":rawsha,"publication_status":"review","ingested_at":stamp}
                    existing.append(item);by_id[iid]=item;seen_sha.add(rawsha);stats["added"]+=1
                    if stats["added"]%20==0:
                        save(INDEX,existing);print("Staged",stats["added"],"actual PNG cutouts",flush=True)
                except Exception as exc:
                    stats["processing_fail"]+=1
                    if len(failures)<100:
                        failures.append({"stage":"cut","id":iid,"query":q,"error":str(exc)[:180]})
                time.sleep(0.15)
            time.sleep(0.35)
    save(INDEX,existing)
    summary={"date":stamp,"requested_cutouts":a.target,"attempted_objects":attempts,
        "new_cutouts":stats["added"],"total_manifest":len(existing),
        "stats":dict(stats),"failures":failures,"vision_enabled":a.vision,
        "note":"Only PNGs committed in assets count as cutouts; query labels are unreviewed until visually verified."}
    save(BASE/"last-run.json",summary)
    print(json.dumps({k:v for k,v in summary.items() if k!="failures"},indent=2))
    if stats["added"]==0: sys.exit("No new cutouts created. Check last-run.json and upstream API.")
if __name__=="__main__":main()
