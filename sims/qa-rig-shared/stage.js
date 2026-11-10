// The rig's stage: a pale warm studio, one soft sun with VSM shadows on an invisible floor, a room environment for
// the metal, and the rig. frame(state, cam) poses the rig, redraws the screens and draws one frame.
import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {buildRig, COL} from './rig.js';
import {drawDashboard, drawPhone} from './screens.js';

const V3 = THREE.Vector3;

export function createRigStage({canvas}) {
  const renderer = new THREE.WebGLRenderer({canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance'});
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COL.bg);
  scene.fog = new THREE.Fog(COL.bg, 3.2, 7);
  const camera = new THREE.PerspectiveCamera(26, 16 / 9, 0.02, 40);
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(4, 4, {type: THREE.HalfFloatType, samples: 8}));
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new OutputPass());

  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  pm.dispose();

  const SUN_DIR = new V3(-0.4, 0.85, 0.35).normalize();
  const sun = new THREE.DirectionalLight('#fff4e6', 2.2);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, {left: -1.1, right: 1.1, top: 0.8, bottom: -0.8, near: 0.2, far: 8});
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 8;
  sun.shadow.blurSamples = 16;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.003;
  sun.position.copy(SUN_DIR).multiplyScalar(3);
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#fffaf2', '#d9ccb8', 0.7));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({color: '#6b5236', opacity: 0.22, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4}));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const rig = buildRig();
  scene.add(rig.root);

  const size = {w: 1600, h: 900};
  const resize = (w, h, pr) => {
    size.w = w;
    size.h = h;
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(pr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  // st: {r, picked, pick[7], fade{group}}; cam: {tx, ty, tz, az, el, d (radians), sx, sy}
  let screenTick = -1;
  const frame = (st, cam, {screensEvery = 1} = {}) => {
    const info = rig.update(st);
    screenTick++;
    if (screenTick % screensEvery === 0) {
      rig.screens.forEach((s, i) => drawPhone(s, i, st.r, st.picked === i));
      drawDashboard(rig.dashboard, st.r);
    }
    camera.position.set(cam.tx + cam.d * Math.cos(cam.el) * Math.sin(cam.az), cam.ty + cam.d * Math.sin(cam.el), cam.tz + cam.d * Math.cos(cam.el) * Math.cos(cam.az));
    camera.lookAt(cam.tx, cam.ty, cam.tz);
    camera.setViewOffset(size.w, size.h, -(cam.sx ?? 0), -(cam.sy ?? 0), size.w, size.h);
    camera.updateMatrixWorld();
    composer.render();
    return info;
  };
  const pv = new V3();
  const project = (p) => {
    pv.copy(p).project(camera);
    if (pv.z > 1) return null;
    return [(pv.x * 0.5 + 0.5) * size.w, (-pv.y * 0.5 + 0.5) * size.h];
  };
  const setQuality = ({samples, shadow}) => {
    if (samples !== undefined)
      for (const t of [composer.renderTarget1, composer.renderTarget2]) {
        t.samples = samples;
        t.dispose();
      }
    if (shadow !== undefined) {
      sun.shadow.mapSize.set(shadow, shadow);
      sun.shadow.map?.dispose();
      sun.shadow.map = null;
    }
  };
  return {renderer, scene, camera, composer, rig, resize, frame, project, size, setQuality};
}
