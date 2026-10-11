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
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 5, bottom: -2, near: 1, far: 25 });
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
  const desk = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.09, 1.9), deskMat);
  desk.position.set(0, -0.045, 0.35); desk.receiveShadow = true; scene.add(desk);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: SIGNAL }));
  edge.position.set(0, -0.005, 1.3); scene.add(edge);
  const blob = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!; const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(15,15,14,.30)'); r.addColorStop(1, 'rgba(15,15,14,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.9), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, 0.002, 0.1); scene.add(contact);

  // code panels behind him: what he is writing, typing itself
  type Part = [string, keyof typeof COL];
  const COL = { k: '#F2541A', f: '#FFB38A', p: '#9FA3A6', s: '#F7C9A9', t: '#E8E8E4', g: '#8FD6A2' };
  const LINES_A: Part[][] = [
    [['const', 'k'], [' agent = ', 't'], ['createAgent', 'f'], ['({', 't']],
    [['  model', 'p'], [': ', 't'], ["'opus'", 's'], [',', 't']],
    [['  tools', 'p'], [': [search, browser, crm],', 't']],
    [['  memory', 'p'], [': vectorStore,', 't']],
    [['});', 't']],
    [['await', 'k'], [' agent.', 't'], ['run', 'f'], ['(task);', 't']],
    [['ship', 'f'], ['(agent);', 't']],
  ];
  const LINES_B: Part[][] = [
    [['▸ ', 'k'], ['eval', 't'], ['  42/42 passed', 'g']],
    [['▸ ', 'k'], ['deploy', 't'], ['  whatsapp-agent', 's']],
    [['▸ ', 'k'], ['latency', 't'], ['  p95 812ms', 'g']],
    [['▸ ', 'k'], ['tokens', 't'], ['  -38% vs v1', 'g']],
    [['▸ ', 'k'], ['status', 't'], ['  live', 's']],
  ];
  function panel(lines: Part[][], w: number, h: number) {
    const c = document.createElement('canvas'); c.width = 640; c.height = Math.round(640 * h / w);
    const g = c.getContext('2d')!; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const total = lines.flat().map((p) => p[0]).join('').length;
    let lastN = -1;
    const draw = (n: number) => {
      if (n === lastN) return; lastN = n;
      g.clearRect(0, 0, c.width, c.height);
      g.fillStyle = 'rgba(15,15,14,0.94)'; g.beginPath(); g.roundRect(0, 0, c.width, c.height, 26); g.fill();
      for (const [i, col] of ['#3a3a38', '#3a3a38', '#3a3a38'].entries()) { g.fillStyle = col; g.beginPath(); g.arc(30 + i * 22, 28, 7, 0, 6.283); g.fill(); }
      g.font = '600 25px ui-monospace, Menlo, monospace';
      let left = n, y = 86;
      for (const line of lines) {
        let x = 30;
        for (const [txt, k] of line) { if (left <= 0) break; const s = txt.slice(0, left); left -= txt.length; g.fillStyle = COL[k]; g.fillText(s, x, y); x += g.measureText(txt).width; }
        y += 40;
      }
      tex.needsUpdate = true;
    };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
    scene.add(m);
    return { m, draw, total };
  }
  const pa = panel(LINES_A, 2.1, 1.45), pb = panel(LINES_B, 1.8, 1.0);
  pa.m.position.set(-1.95, 2.55, -1.1); pa.m.rotation.y = 0.22;
  pb.m.position.set(2.0, 2.05, -0.9); pb.m.rotation.y = -0.22;

  // agents
  const botMat = new THREE.MeshPhysicalMaterial({ color: SIGNAL, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.1 });
  const visorMat = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.15, clearcoat: 1 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xFFC2A0 });
  const SLOTS = [[-1.95, 1.0, 1.0], [1.95, 0.95, 1.0], [-1.45, 3.6, 0.6], [1.3, 3.5, 0.6], [0.3, 4.0, 0.3]];
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
    camera.position.set(Math.sin(az) * 10.2, 2.35 + el * 6, Math.cos(az) * 10.2);
    camera.lookAt(0, 2.0, 0);

    // each launch is an Enter press: he dips a little
    let press = 0;
    for (let i = 0; i < N; i++) { const b = FIRST + i * GAP; press = Math.max(press, Math.sin(Math.PI * seg(t, b - 0.12, b + 0.08))); }
    const waving = T < waveUntil;
    omarMat.map = waving ? texWave : texMe; shadowCaster.material.map = omarMat.map;
    omar.scale.set(1 + press * 0.012, 1 - press * 0.02 + Math.sin(T * 1.6) * 0.006, 1);
    omar.position.y = (S / 2 - 0.02) * omar.scale.y;

    const typed = t < SHIP ? seg(t, 0, SHIP - 0.6) : 1 - seg(t, CYCLE - 0.6, CYCLE);
    pa.draw(Math.floor(typed * pa.total));
    pb.draw(Math.floor(clamp((t - FIRST) / (N * GAP)) * pb.total));
    pa.m.position.y = 2.55 + Math.sin(T * 0.9) * 0.04; pb.m.position.y = 2.05 + Math.sin(T * 0.9 + 2) * 0.04;

    const labels: LabLabel[] = [];
    bots.forEach((b, i) => {
      const born = FIRST + i * GAP;
      const k = seg(t, born, born + 0.85);
      const out = eio(seg(t, SHIP + 0.5 + i * 0.07, SHIP + 1.5 + i * 0.07));
      const cheer = Math.sin(Math.PI * seg(t, SHIP, SHIP + 0.45)) * 0.32 + (waving ? Math.abs(Math.sin(T * 9)) * 0.12 : 0);
      b.g.visible = t > born && out < 0.999;
      // rise out of the lid, then arc to the slot with a little overshoot
      const up = eio(seg(k, 0, 0.35)), fly = eob(seg(k, 0.25, 1));
      v.copy(LID).add(new THREE.Vector3(0, up * 0.55, up * 0.25)).lerp(b.slot, fly);
      v.y += Math.sin(T * 2.1 + i * 1.3) * 0.05 * fly + cheer;
      v.add(new THREE.Vector3(Math.sign(b.slot.x || 1) * 1.5, 4.5, -1.5).multiplyScalar(out));
      b.g.position.copy(v);
      b.g.scale.setScalar(0.72 * (0.3 + 0.7 * eio(seg(k, 0, 0.5))));
      // bots face the camera and glance at the pointer
      b.g.lookAt(camera.position.x + ptr.sx * 3, camera.position.y - ptr.sy * 2, camera.position.z);
      b.g.rotation.z += Math.sin(T * 1.7 + i) * 0.08;
      const blink = ((T + i * 0.7) % 3.1) < 0.09;
      b.eyes.forEach((e) => (e.scale.y = blink ? 0.2 : 1.3));
      b.link.visible = b.g.visible && fly > 0.9 && out < 0.02;
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
