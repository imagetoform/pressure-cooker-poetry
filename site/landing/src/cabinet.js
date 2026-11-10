/* The cabinet avalanche: doors open, phrase tiles pour out, then it hands over to the card picker. */
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const STYLE = {
  food:        { bg: '#f5f2ec', fg: '#151110', font: '600 %px "Fraunces"' },
  memory:      { bg: '#1d1816', fg: '#efe7da', font: 'italic 900 %px "Fraunces"' },
  object:      { bg: '#b9bdb9', fg: '#121212', font: '700 %px "Space Mono"' },
  institution: { bg: '#d42a1f', fg: '#fff4e6', font: '400 %px "Anton"', caps: 1 },
  concept:     { bg: '#ffffff', fg: '#111111', font: '400 %px "Special Elite"' },
  absurdity:   { bg: '#e7b51f', fg: '#1c1305', font: '400 %px "Bungee"', caps: 1, shine: 1 }
};
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

function start(canvas, items, onDone) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { onDone('nogl'); return { stop() {} }; }
  let DPR = Math.min(devicePixelRatio, 1.5); renderer.setPixelRatio(DPR);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#120e0c'); scene.fog = new THREE.Fog('#120e0c', 18, 34);
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80);
  const camTarget = new THREE.Vector3(0, 2.1, 1.2), camDir = new THREE.Vector3(0, 3.9, 11.6).normalize(); let camDist = 12.3;
  scene.add(new THREE.HemisphereLight(0xf1ebe1, 0x1a0f0c, 0.55));
  const spot = new THREE.SpotLight(0xfff0d8, 320, 0, 0.72, 0.55, 2); spot.position.set(2.5, 11, 6.5); spot.target.position.set(0, 1.6, 1);
  spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0004; spot.shadow.normalBias = 0.02; scene.add(spot, spot.target);
  const rim = new THREE.DirectionalLight(0xd42a1f, 0.9); rim.position.set(-8, 3, -2); scene.add(rim);

  function tex(w, h, draw, rep) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ roughness: .55, map: tex(256, 256, (g, w) => { const s = w / 8; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? '#2b1714' : '#16110f'; g.fillRect(x * s, y * s, s, s); } }, [7, 7]) }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 16), new THREE.MeshStandardMaterial({ color: '#211b18', roughness: .9 })); wall.position.set(0, 8, -1.75); scene.add(wall);

  const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -16, 0) }); world.broadphase = new CANNON.SAPBroadphase(world); world.allowSleep = true;
  const tm = new CANNON.Material('t'), hm = new CANNON.Material('h');
  world.addContactMaterial(new CANNON.ContactMaterial(tm, tm, { friction: .35, restitution: .12 }));
  world.addContactMaterial(new CANNON.ContactMaterial(tm, hm, { friction: .45, restitution: .22 }));
  const plane = (p, e) => { const b = new CANNON.Body({ mass: 0, material: hm, shape: new CANNON.Plane() }); b.position.set(...p); b.quaternion.setFromEuler(...e); world.addBody(b); };
  plane([0, 0, 0], [-Math.PI / 2, 0, 0]); plane([0, 0, -1.75], [0, 0, 0]); plane([0, 0, 5.2], [0, Math.PI, 0]); plane([-7.2, 0, 0], [0, Math.PI / 2, 0]); plane([7.2, 0, 0], [0, -Math.PI / 2, 0]);
  const enamel = new THREE.MeshStandardMaterial({ color: '#2a2320', roughness: .55, metalness: .1 });
  const foil = new THREE.MeshStandardMaterial({ color: '#c99a1c', roughness: .28, metalness: .85, emissive: '#3a2600', emissiveIntensity: 0 });
  function box(c, h, mat) { const b = new CANNON.Body({ mass: 0, material: hm, shape: new CANNON.Box(new CANNON.Vec3(...h)) }); b.position.set(...c); world.addBody(b); const m = new THREE.Mesh(new THREE.BoxGeometry(h[0] * 2, h[1] * 2, h[2] * 2), mat); m.position.set(...c); m.castShadow = m.receiveShadow = true; scene.add(m); }
  box([0, 0.93, -0.85], [5.2, 0.93, 0.9], enamel);
  box([0, 1.9, -0.8], [5.35, 0.05, 1.0], new THREE.MeshStandardMaterial({ color: '#7d8381', roughness: .32, metalness: .75 }));
  const CAB = { w: 4.2, h: 2.6, d: 1.3, cy: 4.3, back: -1.6, T: 0.1 }; CAB.front = CAB.back + CAB.d; CAB.bottom = CAB.cy - CAB.h / 2; CAB.top = CAB.cy + CAB.h / 2;
  const mz = CAB.back + CAB.d / 2;
  box([0, CAB.cy, CAB.back + CAB.T / 2], [CAB.w / 2, CAB.h / 2, CAB.T / 2], foil);
  box([-CAB.w / 2 + CAB.T / 2, CAB.cy, mz], [CAB.T / 2, CAB.h / 2, CAB.d / 2], enamel);
  box([CAB.w / 2 - CAB.T / 2, CAB.cy, mz], [CAB.T / 2, CAB.h / 2, CAB.d / 2], enamel);
  box([0, CAB.top - CAB.T / 2, mz], [CAB.w / 2, CAB.T / 2, CAB.d / 2], enamel);
  box([0, CAB.bottom + CAB.T / 2, mz], [CAB.w / 2, CAB.T / 2, CAB.d / 2], enamel);
  const cabLight = new THREE.PointLight(0xffc54a, 0, 5, 2); cabLight.position.set(0, CAB.cy, -0.7); scene.add(cabLight);
  function door(side) {
    const pivot = new THREE.Group(); pivot.position.set(side * CAB.w / 2, CAB.cy, CAB.front + 0.035); const dw = CAB.w / 2 - 0.01;
    const face = new THREE.MeshStandardMaterial({ roughness: .6, map: tex(256, 320, (g, w, h) => { g.fillStyle = '#2b2421'; g.fillRect(0, 0, w, h); g.strokeStyle = '#14100e'; g.lineWidth = 6; g.strokeRect(18, 18, w - 36, h - 36); g.fillStyle = '#e7b51f'; g.textAlign = 'center'; g.font = '400 70px "Anton"'; g.fillText(side < 0 ? 'PAN' : 'TRY', w / 2 - side * 18, h * .5); }) });
    const m = new THREE.Mesh(new THREE.BoxGeometry(dw, CAB.h - 0.02, 0.06), [enamel, enamel, enamel, enamel, face, foil]); m.position.x = -side * dw / 2; m.castShadow = true; pivot.add(m); scene.add(pivot); return pivot;
  }
  const doors = [door(-1), door(1)]; let doorT = REDUCE ? 1 : 0;

  const TH = 0.34, TD = 0.085, PX = 200, mc = document.createElement('canvas').getContext('2d');
  const tiles = [], queue = items.slice(0, 120);
  function spawn(it) {
    const st = STYLE[it.cat] || STYLE.food, txt = st.caps ? it.text.toUpperCase() : it.text, f = st.font.replace('%', Math.round(TH * PX * .48));
    mc.font = f; const w = Math.max(.62, Math.min(3.0, (mc.measureText(txt).width + TH * PX * .7) / PX));
    const map = tex(Math.round(w * PX), Math.round(TH * PX), (g, cw, ch) => { g.fillStyle = st.bg; g.fillRect(0, 0, cw, ch); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, cw - 3, ch - 3); let s = Math.round(ch * .48); g.font = st.font.replace('%', s); while (g.measureText(txt).width > cw - ch * .5 && s > 9) { s--; g.font = st.font.replace('%', s); } g.fillStyle = st.fg; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, cw / 2, ch / 2 + s * .06); });
    const face = new THREE.MeshStandardMaterial({ map, roughness: st.shine ? .32 : .72, metalness: st.shine ? .45 : 0 });
    const edge = new THREE.MeshStandardMaterial({ color: new THREE.Color(st.bg).multiplyScalar(.72), roughness: .7 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, TH, TD), [edge, edge, edge, edge, face, face]); mesh.castShadow = mesh.receiveShadow = true;
    const body = new CANNON.Body({ mass: .2, material: tm, shape: new CANNON.Box(new CANNON.Vec3(w / 2, TH / 2, TD / 2)), linearDamping: .04, angularDamping: .12, sleepSpeedLimit: .18, sleepTimeLimit: .6 });
    const xr = Math.max(0, CAB.w / 2 - CAB.T - w / 2 - .08), up = Math.random() < .5;
    const y0 = up ? CAB.cy + .25 : CAB.bottom + CAB.T + .22, y1 = up ? CAB.top - CAB.T - .22 : CAB.cy - .25;
    if (REDUCE) body.position.set((Math.random() - .5) * 9, 2.6 + Math.random() * 2, Math.random() * 3.8 + .3);
    else { body.position.set((Math.random() * 2 - 1) * xr, y0 + Math.random() * (y1 - y0), CAB.back + .35 + Math.random() * .7); body.velocity.set((Math.random() - .5) * 3.2, .6 + Math.random() * 2.6, 1.9 + Math.random() * 3.4); body.angularVelocity.set((Math.random() - .5) * 9, (Math.random() - .5) * 6, (Math.random() - .5) * 9); }
    body.quaternion.setFromEuler((Math.random() - .5) * .5, (Math.random() - .5) * .6, (Math.random() - .5) * .5);
    world.addBody(body); scene.add(mesh); tiles.push({ mesh, body });
  }
  function resize() { const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); camDist = Math.max(12.3, 5.6 / (half * camera.aspect)); camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();
  const back = x => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  let last = performance.now(), t0 = last, acc = 0, alive = true, done = false, q = 0, qa = 0, qn = 0, raf = 0;
  function finish(why) { if (done) return; done = true; onDone(why); }
  function frame(now) {
    if (!alive) return;
    const raw = (now - last) / 1000, dt = Math.min(.05, raw); last = now;
    if (raw < 1 && queue.length) { qa += raw; qn++; if (qn >= 40) { if (qa / qn > .034 && q < 3) { q++; if (q === 1) DPR = 1; else if (q === 2) spot.castShadow = false; else DPR = .7; renderer.setPixelRatio(DPR); resize(); } qa = 0; qn = 0; } }
    doorT = Math.min(1, doorT + dt / .9); const e = back(doorT); doors[0].rotation.y = -1.95 * e; doors[1].rotation.y = 1.95 * e;
    cabLight.intensity = 9 * Math.min(1, doorT * 1.4); foil.emissiveIntensity = .9 * doorT;
    if (queue.length && doorT > .35) { acc += dt * (REDUCE ? 999 : 55); while (acc >= 1 && queue.length) { spawn(queue.shift()); acc--; } }
    world.step(1 / 60, dt, 4);
    for (const t of tiles) { t.mesh.position.copy(t.body.position); t.mesh.quaternion.copy(t.body.quaternion); }
    camera.position.copy(camTarget).addScaledVector(camDir, camDist); camera.lookAt(camTarget);
    renderer.render(scene, camera);
    const el = (now - t0) / 1000;
    if (!queue.length && tiles.length && (el > 9 || (el > 3.5 && tiles.every(t => t.body.sleepState === CANNON.Body.SLEEPING || t.body.velocity.lengthSquared() < .15)))) finish('settled');
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return { stop() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', resize); try { renderer.dispose(); renderer.forceContextLoss(); } catch (e) {} }, count: () => tiles.length };
}
window.PCPCabinet = { start };
window.dispatchEvent(new Event('pcp-cabinet-ready'));
