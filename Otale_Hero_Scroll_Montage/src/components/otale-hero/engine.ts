/**
 * Otale Hero – Scroll-Montage (Render-Engine, framework-unabhaengig)
 *
 * Wird per dynamic import geladen, damit three.js in einem eigenen Chunk landet.
 * Geometrie: 1:1 aus der Master-SVG (logo-data.json).
 * Alle Gestaltungswerte stehen fest in LOOK – bewusst ohne Einstellmoeglichkeiten.
 */
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import LOGO from "./logo-data.json";

type ShapeData = { o: string; h: string[] };
type RingKey = "A" | "B";
type PartKey = "body" | "accLight" | "accDeep" | "band";
type LogoData = { parts: Record<RingKey, Record<PartKey, ShapeData[]>>; pivot: Record<RingKey, [number, number]> };
const DATA = LOGO as unknown as LogoData;

// ---------------- Feste Gestaltungswerte ----------------
const LOOK = {
  lockPoint: 0.58,      // Anteil der Scroll-Strecke bis zum Einrasten
  hold: 0.06,           // kurzer Haltepunkt am Anfang
  ringSpread: 1.2,      // Abstand der Ringe in der Explosionszeichnung
  layerSpread: 0.9,     // Abstand der Ebenen (Band ueber Ring)
  startTwist: 0.55,     // Anfangsdrehung der Ringe
  camTilt: 0.24,        // Blick leicht von oben am Anfang
  ringColor: 0x5a2a84,  // Markenviolett, fuer Metall minimal aufgehellt
  exposure: 1.0,
  flash: 0.35,          // sanfter Lichtschwenk beim Einrasten
  drift: 0.12,          // ruhige Lichtbewegung im Stand
  bloom: 0.1,           // nur echte Spitzlichter strahlen leicht
  inertia: 0.1,         // Nachlauf der Bewegung hinter dem Scroll
};

type Tier = { dpr: number; samples: number; post: boolean; coat: boolean; aniso: boolean };
const TIERS: Record<"high" | "medium" | "low", Tier> = {
  high: { dpr: 1.75, samples: 4, post: true, coat: true, aniso: true },
  medium: { dpr: 1.5, samples: 2, post: true, coat: true, aniso: true },
  low: { dpr: 1, samples: 0, post: false, coat: false, aniso: false },
};

export type MontageOptions = {
  /** Scroll-Fortschritt 0..1 der Hero-Section */
  getProgress: () => number;
  /** Zielrahmen des fertigen Logos (Platzhalter-Element), relativ zum Viewport */
  getTarget: () => DOMRect;
  /** Hintergrundfarbe der Seite, damit Canvas und Seite nahtlos ineinander uebergehen */
  background: string;
  /** true = fertiges Logo, keine Bewegung (prefers-reduced-motion) */
  still?: boolean;
  /** Fortschritt der Schlussphase 0..1 – steuert die Ueberschrift */
  onPhase?: (b: number) => void;
  onReady?: () => void;
};
export type MontageHandle = { setActive: (on: boolean) => void; destroy: () => void };

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const LOGO_W = 8.8, LOGO_H = 5.84;

function pickTier(): keyof typeof TIERS {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 4, cores = nav.hardwareConcurrency ?? 4;
  if (mem <= 3 || cores <= 4) return "low";
  return window.matchMedia("(pointer: coarse)").matches ? "medium" : "high";
}

/** Ruhiges Fotostudio aus weichen Leuchtflaechen (Lightformer-Prinzip) */
function studio(renderer: THREE.WebGLRenderer) {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x050407);
  const geo = new THREE.PlaneGeometry(1, 1);
  const add = (w: number, h: number, pos: [number, number, number], color: string, k: number) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.scale.set(w, h, 1); m.position.set(...pos); m.lookAt(0, 0, 0); s.add(m);
  };
  add(40, 40, [0, 0, 14], "#ffffff", 0.55);    // weiche Grundhelligkeit von vorn
  add(16, 2.2, [0, 6, 8], "#ffffff", 2.6);     // breite Softbox oben
  add(2.2, 12, [-7, 0, 7], "#ffffff", 1.8);    // Softbox links
  add(1.8, 12, [7, 0, 6], "#eee6ff", 1.5);     // Softbox rechts, kuehl-lila
  add(1.4, 10, [2.5, 0, 10], "#ffffff", 1.3);  // schmaler Streifen fast frontal
  add(12, 2.5, [0, -6, 6], "#6b3a90", 1.0);    // zurueckhaltendes Bodenlicht
  add(14, 20, [-12, 0, 0], "#ffffff", 0.25);
  add(14, 20, [12, 0, 0], "#ffffff", 0.25);
  const pm = new THREE.PMREMGenerator(renderer);
  const tex = pm.fromScene(s, 0.03).texture;
  pm.dispose(); geo.dispose();
  return tex;
}

function grain() {
  const n = 256, cv = document.createElement("canvas");
  cv.width = cv.height = n;
  const g = cv.getContext("2d")!, img = g.createImageData(n, n);
  for (let i = 0; i < n * n; i++) {
    const v = 116 + Math.random() * 28;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0); g.filter = "blur(1px)"; g.drawImage(cv, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4);
  return t;
}

function parsePath<T extends THREE.Path>(str: string, target: T): T {
  const t = str.split(" "); let i = 0;
  const n = () => parseFloat(t[i++]);
  while (i < t.length) {
    const c = t[i++];
    if (c === "M") target.moveTo(n(), n());
    else if (c === "L") target.lineTo(n(), n());
    else if (c === "C") target.bezierCurveTo(n(), n(), n(), n(), n(), n());
  }
  return target;
}

export function createMontage(canvas: HTMLCanvasElement, opts: MontageOptions): MontageHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.NeutralToneMapping; // farbtreu: Markenviolett bleibt Markenviolett
  renderer.toneMappingExposure = LOOK.exposure;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background);
  scene.environment = studio(renderer);
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 200);

  const bump = grain();
  const M: Record<PartKey, THREE.MeshPhysicalMaterial> = {
    body: new THREE.MeshPhysicalMaterial({ color: LOOK.ringColor, metalness: 1, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.12, bumpMap: bump, bumpScale: 0.003 }),
    band: new THREE.MeshPhysicalMaterial({ color: 0xf2f0f6, metalness: 1, roughness: 0.18, anisotropy: 0.6, bumpMap: bump, bumpScale: 0.002 }),
    accLight: new THREE.MeshPhysicalMaterial({ color: 0xb497c7, metalness: 1, roughness: 0.28, clearcoat: 0.6, clearcoatRoughness: 0.12 }),
    accDeep: new THREE.MeshPhysicalMaterial({ color: 0x3f1a56, metalness: 1, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.12 }),
  };
  const Z: Record<PartKey, number> = { body: 0, accLight: 0.04, accDeep: 0.04, band: 0.1 };
  const EXPLODE: Record<PartKey, number> = { body: 0, accLight: 0.45, accDeep: 0.45, band: 1 };
  const DEPTH = 0.32;
  const geometries: THREE.BufferGeometry[] = [];

  type Ring = THREE.Group & { userData: { rest: THREE.Vector3; meshes: THREE.Mesh[] } };
  const buildRing = (key: RingKey) => {
    const [px, py] = DATA.pivot[key];
    const grp = new THREE.Group() as Ring, inner = new THREE.Group();
    inner.position.set(-px, -py, 0); grp.add(inner);
    const meshes: THREE.Mesh[] = [];
    (["body", "accLight", "accDeep", "band"] as PartKey[]).forEach((part) => {
      const list = DATA.parts[key][part];
      if (!list.length) return;
      const shapes = list.map((s) => {
        const sh = parsePath(s.o, new THREE.Shape());
        s.h.forEach((h) => sh.holes.push(parsePath(h, new THREE.Path())));
        return sh;
      });
      const geo = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, curveSegments: 24, bevelEnabled: true, bevelThickness: 0.045, bevelSize: 0.018, bevelSegments: 5 });
      geo.translate(0, 0, Z[part] - DEPTH / 2);
      geometries.push(geo);
      const m = new THREE.Mesh(geo, M[part]); m.userData.part = part;
      inner.add(m); meshes.push(m);
    });
    grp.userData = { rest: new THREE.Vector3(px, py, 0), meshes };
    return grp;
  };
  const logo = new THREE.Group(); scene.add(logo);
  const A = buildRing("A"), B = buildRing("B");
  logo.add(A, B);

  // Post-Processing: MSAA + sehr dezenter Bloom, Tone Mapping am Ende (OutputPass)
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), LOOK.bloom, 0.35, 0.98);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let tierName = pickTier(), tier = TIERS[tierName];
  const applyTier = () => {
    tier = TIERS[tierName];
    for (const r of [composer.renderTarget1, composer.renderTarget2]) { r.samples = tier.samples; r.dispose(); }
    M.body.clearcoat = M.accLight.clearcoat = M.accDeep.clearcoat = tier.coat ? 0.6 : 0;
    M.band.anisotropy = tier.aniso ? 0.6 : 0;
    resize();
  };

  // Layout
  let viewH = 1, dist = 25, endScale = 0.4, endY = 0;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio, tier.dpr);
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr); composer.setSize(w, h);
    camera.aspect = w / h;
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const widthFrac = camera.aspect < 1 ? 0.62 : 0.5; // Hochformat: Logo groesser
    dist = Math.max(LOGO_W / widthFrac / (2 * tanH * camera.aspect), LOGO_H / 0.55 / (2 * tanH));
    viewH = 2 * tanH * dist;
    camera.updateProjectionMatrix();
    // Endposition = Platzhalter im Layout (gleiche Groesse und Lage wie das alte Logo)
    const c = canvas.getBoundingClientRect(), t = opts.getTarget();
    const pxPerUnit = h / viewH;
    endScale = t.width / (LOGO_W * pxPerUnit);
    endY = (0.5 - (t.top - c.top + t.height / 2) / h) * viewH;
    dirty = true;
  }

  // Animation
  let pSmooth = opts.still ? 1 : 0, lockAt: number | null = null, locked = false, dirty = true;
  let mx = 0, my = 0, tx = 0, ty = 0;
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mx = (e.clientX / window.innerWidth) * 2 - 1; my = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  const pose = (t: number, pRaw: number) => {
    const p = clamp((pRaw - LOOK.hold) / (1 - LOOK.hold));
    const a = inOutCubic(clamp(p / LOOK.lockPoint));
    const b = inOutCubic(clamp((p - LOOK.lockPoint - 0.04) / (1 - LOOK.lockPoint - 0.04)));
    const loose = 1 - a, tw = LOOK.startTwist;
    for (const R of [A, B]) { R.position.copy(R.userData.rest); R.rotation.set(0, 0, 0); }
    A.position.x -= LOOK.ringSpread * loose; B.position.x += LOOK.ringSpread * loose;
    A.position.z = 0.5 * loose; B.position.z = -0.5 * loose;
    A.rotation.set(-0.25 * loose + Math.sin(t * 0.5) * 0.04 * loose, tw * loose + Math.sin(t * 0.4) * 0.08 * loose, 0.06 * loose);
    B.rotation.set(0.25 * loose + Math.sin(t * 0.45 + 1) * 0.04 * loose, -tw * loose + Math.sin(t * 0.35 + 2) * 0.08 * loose, -0.06 * loose);
    for (const R of [A, B]) R.userData.meshes.forEach((m) => {
      const e = EXPLODE[m.userData.part as PartKey] * loose * LOOK.layerSpread;
      m.position.set(0, m.userData.part === "band" ? e * 0.12 : 0, e);
    });
    if (a >= 0.999 && !locked) { locked = true; lockAt = t; }
    if (a < 0.98 && locked) { locked = false; lockAt = null; }
    let click = 0, flash = 0;
    if (lockAt !== null) {
      const lt = t - lockAt;
      if (lt < 0.4) click = Math.exp(-lt * 14) * Math.sin(lt * 62) * 0.035;
      if (lt < 1.6) flash = Math.sin(Math.PI * inOutCubic(clamp(lt / 1.6)));
    }
    A.position.x += click; B.position.x -= click;
    logo.scale.setScalar(lerp(1, endScale, b));
    logo.position.y = lerp(0, endY, b);
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    logo.rotation.x = (Math.sin(t * 0.3) * 0.02 - ty * 0.08) * a;
    logo.rotation.y = (Math.sin(t * 0.4) * 0.035 + tx * 0.12) * a;
    const tilt = LOOK.camTilt * loose;
    camera.position.set(0, Math.sin(tilt) * dist, Math.cos(tilt) * dist);
    camera.lookAt(0, 0, 0);
    scene.environmentRotation.y = Math.sin(p * Math.PI) * 0.35 + flash * LOOK.flash + Math.sin(t * 0.25) * LOOK.drift;
    opts.onPhase?.(b);
    return Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002 || (lockAt !== null && t - lockAt < 1.7);
  };

  // Render-Schleife: nur rechnen, wenn sich etwas bewegt; im Stand 30 fps
  let raf = 0, active = false, ready = false, skip = false, last = 0;
  let frames: number[] = [];
  const draw = () => { tier.post ? composer.render() : renderer.render(scene, camera); };
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const t = now / 1000, target = opts.still ? 1 : opts.getProgress();
    pSmooth += (target - pSmooth) * (opts.still ? 1 : LOOK.inertia);
    const scrolling = Math.abs(target - pSmooth) > 0.0004;
    if (!scrolling && !dirty) {
      const busy = pose(t, pSmooth);
      if (opts.still && !busy) return;
      skip = !skip; if (skip) return;
    } else pose(t, pSmooth);
    draw(); dirty = false;
    if (!ready) { ready = true; opts.onReady?.(); }
    const dt = now - last; last = now;
    if (scrolling && dt < 200) {
      frames.push(dt); if (frames.length > 90) frames.shift();
      // bei dauerhaft > 24 ms pro Bild eine Qualitaetsstufe herunterschalten
      if (frames.length === 90 && frames.reduce((x, y) => x + y) / 90 > 24 && tierName !== "low") {
        tierName = tierName === "high" ? "medium" : "low"; frames = []; applyTier();
      }
    }
  };

  const ro = new ResizeObserver(resize); ro.observe(canvas);
  applyTier();
  renderer.compile(scene, camera);
  pose(0, pSmooth); draw();
  ready = true; opts.onReady?.();

  return {
    setActive(on) {
      if (on === active) return;
      active = on; cancelAnimationFrame(raf);
      if (on) { dirty = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    },
    destroy() {
      active = false; cancelAnimationFrame(raf); ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geometries.forEach((g) => g.dispose());
      Object.values(M).forEach((m) => m.dispose());
      bump.dispose(); scene.environment?.dispose();
      composer.dispose(); renderer.dispose();
    },
  };
}
