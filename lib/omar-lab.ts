/**
 * Omar's lab: the real Memoji behind his laptop, and the agents he builds
 * hopping out of it to their places around him. Framework-free; three is
 * passed in so the page decides when to load it. renderAt(t) draws time t.
 */
type Three = typeof import('three');
export type LabLabel = { x: number; y: number; alpha: number };
export type LabOptions = {
  me: string; meWave: string; agents: unknown[];
  onLabels?: (labels: LabLabel[]) => void; still?: boolean; dpr?: number;
};

export function createOmarLab(THREE: Three, canvas: HTMLCanvasElement, opts: LabOptions) {
  const SIGNAL = 0xF2541A, INK = 0x0F0F0E;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!opts.still });
  renderer.setPixelRatio(Math.min(2, opts.dpr || window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

  (function env() {
    const s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0xbdbab5, side: THREE.BackSide })));
    const panel = (w: number, h: number, c: number, x: number, y: number, z: number) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
    panel(16, 10, 0xffffff, -6, 10, 10); panel(10, 8, 0xfff1e6, 12, 4, 6); panel(6, 14, 0xffd9c7, 0, 4, -14);
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(s, 0.04).texture;
  })();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2ca, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(-3, 8, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -4, near: 1, far: 25 });
  scene.add(key);

  const loader = new THREE.TextureLoader();
  const texOf = (src: string) => { const t = loader.load(src); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const texMe = texOf(opts.me), texWave = texOf(opts.meWave);

  // the Memoji, cut out, standing behind the desk edge
  const S = 3.3;
  const omarMat = new THREE.MeshBasicMaterial({ map: texMe, transparent: true, alphaTest: 0.02, toneMapped: false });
  const omar = new THREE.Mesh(new THREE.PlaneGeometry(S, S), omarMat);
  omar.position.set(0, S / 2 - 0.02, 0); scene.add(omar);
  const shadowCaster = new THREE.Mesh(new THREE.PlaneGeometry(S, S), new THREE.MeshBasicMaterial({ map: texMe, alphaTest: 0.5, colorWrite: false, depthWrite: false }));
  shadowCaster.castShadow = true; omar.add(shadowCaster);

  // desk: a thin slab the laptop sits on, with a soft contact shadow
  const deskMat = new THREE.MeshPhysicalMaterial({ color: 0xE9E8E3, roughness: 0.55, clearcoat: 0.4 });
  const desk = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.09, 3.9), deskMat);
  desk.position.set(0, -0.045, -0.65); desk.receiveShadow = true; scene.add(desk);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: SIGNAL }));
  edge.position.set(0, -0.005, 1.3); scene.add(edge);
  const blob = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!; const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(15,15,14,.30)'); r.addColorStop(1, 'rgba(15,15,14,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.9), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, 0.002, 0.1); scene.add(contact);

  // ── the works behind him: a refinery feeding a factory that builds agents ──
  const M = (color: number, o: Record<string, unknown> = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.55, ...o });
  const wall = M(0xEFEDE8, { clearcoat: 0.2 }), roof = M(0xD3D0C9), steel = M(0xBFC2C6, { metalness: 0.6, roughness: 0.35 });
  const dark = M(INK, { roughness: 0.4 }), band = M(SIGNAL, { roughness: 0.4, clearcoat: 0.6 });
  const glow = new THREE.MeshStandardMaterial({ color: 0xFFB08A, emissive: SIGNAL, emissiveIntensity: 0.9 });
  const put = (geo: ConstructorParameters<Three['Mesh']>[0], m: InstanceType<Three['Material']>, parent: InstanceType<Three['Object3D']>, x: number, y: number, z: number) => {
    const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
  };
  const tube = (pts: number[][], r: number, m: InstanceType<Three['Material']>, parent: InstanceType<Three['Object3D']>) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(q[0], q[1], q[2])));
    put(new THREE.TubeGeometry(curve, 48, r, 10, false), m, parent, 0, 0, 0);
    return curve;
  };

  // factory: hall, sawtooth roof with lit glass, chimneys, a glowing door and a conveyor
  const factory = new THREE.Group(); factory.position.set(-2.05, 0, -1.75); scene.add(factory);
  put(new THREE.BoxGeometry(1.5, 0.78, 1.05), wall, factory, 0, 0.39, 0);
  const tooth = new THREE.Shape(); tooth.moveTo(0, 0); tooth.lineTo(0.35, 0); tooth.lineTo(0.35, 0.3); tooth.lineTo(0, 0);
  const toothGeo = new THREE.ExtrudeGeometry(tooth, { depth: 1.46, bevelEnabled: false });
  for (let i = 0; i < 3; i++) {
    const t = put(toothGeo, roof, factory, 0.73, 0.78, -0.525 + i * 0.35); t.rotation.y = -Math.PI / 2;
    const glass = put(new THREE.PlaneGeometry(1.42, 0.27), glow, factory, 0, 0.78 + 0.15, -0.525 + i * 0.35 + 0.352);
    glass.castShadow = false;
  }
  const chimneys = [new THREE.Vector3(-0.5, 0, -0.3), new THREE.Vector3(-0.2, 0, -0.38)].map((c, i) => {
    const h = 0.95 + i * 0.2;
    put(new THREE.CylinderGeometry(0.075, 0.09, h, 16), wall, factory, c.x, 0.78 + h / 2, c.z);
    const ring = put(new THREE.TorusGeometry(0.083, 0.018, 8, 24), band, factory, c.x, 0.78 + h - 0.12, c.z); ring.rotation.x = Math.PI / 2;
    return new THREE.Vector3(c.x, 0.78 + h, c.z).add(factory.position);
  });
  put(new THREE.BoxGeometry(0.56, 0.48, 0.04), dark, factory, 0.25, 0.24, 0.53);
  const door = put(new THREE.PlaneGeometry(0.46, 0.4), glow, factory, 0.25, 0.22, 0.553); door.castShadow = false;
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xFFB08A, emissive: SIGNAL, emissiveIntensity: 0.9 }); door.material = doorMat;
  // conveyor out of the door toward the front
  const beltTex = (() => { const c = document.createElement('canvas'); c.width = 32; c.height = 128; const g = c.getContext('2d')!; g.fillStyle = '#1d1d1c'; g.fillRect(0, 0, 32, 128); g.fillStyle = '#3a3a38'; for (let y = 0; y < 128; y += 16) g.fillRect(0, y, 32, 4); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 6); return t; })();
  put(new THREE.BoxGeometry(0.4, 0.05, 1.5), new THREE.MeshStandardMaterial({ map: beltTex, roughness: 0.8 }), scene, -1.8, 0.1, -0.5);
  for (const sx of [-1, 1]) put(new THREE.BoxGeometry(0.03, 0.09, 1.5), steel, scene, -1.8 + sx * 0.215, 0.1, -0.5);
  for (const z of [-1.1, -0.5, 0.1]) for (const sx of [-1, 1]) put(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8), steel, scene, -1.8 + sx * 0.18, 0.04, z);

  // refinery: two tanks, a distillation column with platforms, a flare stack, pipework
  const refinery = new THREE.Group(); refinery.position.set(2.05, 0, -1.7); scene.add(refinery);
  const tank = (r: number, h: number, x: number, z: number) => {
    put(new THREE.CylinderGeometry(r, r, h, 40), wall, refinery, x, h / 2, z);
    put(new THREE.SphereGeometry(r, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), wall, refinery, x, h, z).scale.y = 0.35;
    const b = put(new THREE.TorusGeometry(r + 0.004, 0.025, 8, 40), band, refinery, x, h * 0.62, z); b.rotation.x = Math.PI / 2;
  };
  tank(0.34, 0.6, -0.35, 0.15); tank(0.25, 0.46, 0.3, 0.4);
  put(new THREE.CylinderGeometry(0.15, 0.17, 1.9, 24), wall, refinery, 0.3, 0.95, -0.3);
  for (const y of [0.55, 0.95, 1.35, 1.75]) { const r = put(new THREE.TorusGeometry(0.2, 0.018, 6, 32), dark, refinery, 0.3, y, -0.3); r.rotation.x = Math.PI / 2; }
  put(new THREE.SphereGeometry(0.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), wall, refinery, 0.3, 1.9, -0.3);
  put(new THREE.CylinderGeometry(0.035, 0.045, 1.35, 12), steel, refinery, -0.6, 0.675, -0.45);
  const flame = put(new THREE.ConeGeometry(0.06, 0.2, 16), glow, refinery, -0.6, 1.45, -0.45); flame.castShadow = false;
  tube([[-0.35, 0.45, 0.15], [-0.05, 0.75, -0.05], [0.3, 0.7, -0.3]], 0.03, steel, refinery);
  tube([[0.3, 0.35, 0.4], [0.4, 0.45, 0.05], [0.3, 0.4, -0.3]], 0.03, steel, refinery);
  // the pipeline: refinery to factory, low behind Omar; data packets ride it
  const pipe = tube([[1.55, 0.3, -1.85], [0.6, 0.3, -2.0], [-0.6, 0.3, -2.0], [-1.3, 0.35, -1.85]], 0.045, steel, scene);
  const packets = Array.from({ length: 5 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 8), glow); scene.add(m); return m; });
  // steam from the chimneys
  const puffMat = () => new THREE.MeshBasicMaterial({ color: 0xD6D3CD, transparent: true, opacity: 0.8, depthWrite: false });
  const puffs = chimneys.flatMap((c, ci) => Array.from({ length: 5 }, (_, j) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), puffMat()); scene.add(m); return { m, c, phase: j / 5 + ci * 0.1 }; }));
  const DOOR = new THREE.Vector3(-1.8, 0.25, -1.2), BELT_END = new THREE.Vector3(-1.8, 0.25, 0.15);

  // agents
  const botMat = new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.1 });
  const visorMat = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.15, clearcoat: 1 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xFFC2A0 });
  // a halo of finished agents over his head
  const SLOTS = [[-2.25, 2.55, 0.3], [2.25, 2.55, 0.3], [-1.35, 3.25, 0.3], [1.35, 3.25, 0.3], [0, 3.55, 0.3]];
  const N = Math.min(SLOTS.length, opts.agents.length);
  const bots: { g: InstanceType<Three['Group']>; eyes: InstanceType<Three['Mesh']>[]; link: InstanceType<Three['Line']>; slot: InstanceType<Three['Vector3']> }[] = [];
  for (let i = 0; i < N; i++) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.16, 10, 32), botMat); body.castShadow = true; g.add(body);
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 16), visorMat); face.scale.set(1, 0.68, 0.6); face.position.set(0, 0.05, 0.11); g.add(face);
    const eyes = [];
    for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), eyeMat); e.position.set(s * 0.06, 0.06, 0.205); e.scale.set(1, 1.3, 0.5); g.add(e); eyes.push(e); }
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.14, 8), visorMat); ant.position.y = 0.38; g.add(ant);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), tipMat); tip.position.y = 0.47; g.add(tip);
    scene.add(g);
    const link = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.5 }));
    scene.add(link);
    bots.push({ g, eyes, link, slot: new THREE.Vector3(...SLOTS[i]) });
  }

  const CYCLE = 10, FIRST = 0.5, GAP = 0.8, SHIP = 7.4;
  const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
  const eio = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const eob = (k: number) => { const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  let waveUntil = -1, now = 0;
  const LID = new THREE.Vector3(0, 1.12, -0.12);
  const v = new THREE.Vector3();
  let W = 1, H = 1;

  function size(w: number, h: number) { W = w; H = h; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }

  function renderAt(T: number) {
    now = T;
    const t = ((T % CYCLE) + CYCLE) % CYCLE;
    ptr.sx += (ptr.x - ptr.sx) * 0.08; ptr.sy += (ptr.y - ptr.sy) * 0.08;
    const az = ptr.sx * 0.12 + Math.sin((T / CYCLE) * Math.PI * 2) * 0.03, el = ptr.sy * 0.06;
    camera.position.set(Math.sin(az) * 11.6, 3.7 + el * 6, Math.cos(az) * 11.6);
    camera.lookAt(0, 1.95, -0.4);

    // each launch is an Enter press: he dips a little
    let press = 0;
    for (let i = 0; i < N; i++) { const b = FIRST + i * GAP; press = Math.max(press, Math.sin(Math.PI * seg(t, b - 0.12, b + 0.08))); }
    const waving = T < waveUntil;
    omarMat.map = waving ? texWave : texMe; shadowCaster.material.map = omarMat.map;
    omar.scale.set(1 + press * 0.012, 1 - press * 0.02 + Math.sin(T * 1.6) * 0.006, 1);
    omar.position.y = (S / 2 - 0.02) * omar.scale.y;

    // the works: belt runs, steam rises, the flare flickers, data flows to the factory
    beltTex.offset.y = -T * 0.9;
    puffs.forEach(({ m, c, phase }) => {
      const k = (((T * 0.45 + phase) % 1) + 1) % 1;
      m.position.set(c.x + k * 0.25, c.y + k * 0.75, c.z - k * 0.1);
      m.scale.setScalar(0.6 + k * 1.8);
      (m.material as InstanceType<Three['MeshBasicMaterial']>).opacity = 0.75 * Math.sin(Math.PI * k);
    });
    flame.scale.set(1, 0.8 + 0.35 * Math.abs(Math.sin(T * 13) * Math.sin(T * 7.3)), 1);
    packets.forEach((m, j) => m.position.copy(pipe.getPoint((((T * 0.22 + j / packets.length) % 1) + 1) % 1)));
    let doorGlow = 0;
    for (let i = 0; i < N; i++) { const b = FIRST + i * GAP; doorGlow = Math.max(doorGlow, Math.sin(Math.PI * seg(t, b - 0.25, b + 0.15))); }
    doorMat.emissiveIntensity = 0.7 + doorGlow * 1.6;

    const labels: LabLabel[] = [];
    bots.forEach((b, i) => {
      const born = FIRST + i * GAP;
      const k = seg(t, born, born + 1.25);
      const out = eio(seg(t, SHIP + 0.5 + i * 0.07, SHIP + 1.5 + i * 0.07));
      const cheer = Math.sin(Math.PI * seg(t, SHIP, SHIP + 0.45)) * 0.32 + (waving ? Math.abs(Math.sin(T * 9)) * 0.12 : 0);
      b.g.visible = t > born && out < 0.999;
      // rise out of the lid, then arc to the slot with a little overshoot
      const ride = seg(k, 0, 0.42), fly = eob(seg(k, 0.42, 1));
      v.copy(DOOR).lerp(BELT_END, ride).lerp(b.slot, fly);
      v.y += Math.sin(Math.PI * seg(k, 0.42, 1)) * 0.8;
      v.y += Math.sin(T * 2.1 + i * 1.3) * 0.05 * fly + cheer;
      v.add(new THREE.Vector3(Math.sign(b.slot.x || 1) * 1.5, 4.5, -1.5).multiplyScalar(out));
      b.g.position.copy(v);
      b.g.scale.setScalar(0.72 * (0.55 + 0.45 * eio(seg(k, 0.3, 0.7))));
      // bots face the camera and glance at the pointer
      b.g.lookAt(camera.position.x + ptr.sx * 3, camera.position.y - ptr.sy * 2, camera.position.z);
      b.g.rotation.z += Math.sin(T * 1.7 + i) * 0.08;
      const blink = ((T + i * 0.7) % 3.1) < 0.09;
      b.eyes.forEach((e) => (e.scale.y = blink ? 0.2 : 1.3));
      b.link.visible = false;
      if (b.link.visible) b.link.geometry.setFromPoints([LID.clone().add(new THREE.Vector3(0, 0.05, 0.15)), v.clone().add(new THREE.Vector3(0, -0.2, 0))]);
      const p = v.clone().add(new THREE.Vector3(0, -0.33, 0)).project(camera);
      labels.push({ x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, alpha: b.g.visible ? clamp((fly - 0.6) / 0.4) * (1 - out * 3) : 0 });
    });
    opts.onLabels?.(labels);
    renderer.render(scene, camera);
  }

  return {
    size, renderAt,
    pointer(x: number, y: number) { ptr.x = clamp(x, -1, 1); ptr.y = clamp(y, -1, 1); },
    wave() { waveUntil = now + 1.6; },
    dispose() { renderer.dispose(); },
  };
}
