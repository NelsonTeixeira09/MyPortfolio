/**
 * Hero 3D scene: a liquid-glass orb wrapped in geometric shells, orbit rings
 * and a soft particle field. Loaded lazily by main.js, only when WebGL is
 * available. The orb is positioned to sit exactly over the CSS fallback orb
 * ([data-orb-anchor]) so the two cross-fade seamlessly.
 */
import {
  AdditiveBlending,
  BufferGeometry,
  Clock,
  Color,
  DodecahedronGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

// Raw sRGB colours for custom shaders (they write straight to the screen).
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return new Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const HOT = '#ff8a3d'; // ember highlight
const RED = '#ff2e4d'; // primary
const MAGENTA = '#c23bff';

// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const ORB_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vObjNormal;
varying float vDisp;
${NOISE}
float displace(vec3 p){
  float n = snoise(p * uFreq + vec3(0.0, uTime * 0.18, uTime * 0.12));
  float d = snoise(p * uFreq * 2.4 - vec3(uTime * 0.1));
  return n * uAmp + d * uAmp * 0.3;
}
vec3 orthogonal(vec3 v){
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}
void main(){
  vec3 n = normalize(position);
  vec3 t = orthogonal(n);
  vec3 b = normalize(cross(n, t));
  float d = displace(n);
  vec3 p = n * (1.0 + d);
  // Recompute the normal from two nearby displaced samples.
  vec3 nt = normalize(n + t * 0.01); vec3 pt = nt * (1.0 + displace(nt));
  vec3 nb = normalize(n + b * 0.01); vec3 pb = nb * (1.0 + displace(nb));
  vec3 dn = normalize(cross(pt - p, pb - p));
  if (dot(dn, n) < 0.0) dn = -dn;
  vDisp = d;
  vObjNormal = dn;
  vNormal = normalize(normalMatrix * dn);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const ORB_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vObjNormal;
varying float vDisp;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  float ndv = clamp(dot(N, V), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.2);

  vec3 grad = mix(uC2, uC1, smoothstep(-0.6, 0.9, vObjNormal.y));
  grad = mix(grad, uC3, smoothstep(0.1, 1.0, -vObjNormal.x * 0.75 - vObjNormal.y * 0.45));

  // Thin-film iridescence on the rim.
  float band = fres * 1.3 + vDisp * 2.6 + vObjNormal.y * 0.3 + uTime * 0.04;
  vec3 irid = mix(uC1, uC3, 0.5 + 0.5 * cos(6.28318 * band));

  vec3 col = vec3(0.035, 0.008, 0.014);             // deep glass body
  col += grad * 0.16 * (1.0 - fres);                // tinted interior
  col += mix(grad, irid, 0.45) * fres * 1.35;      // glowing rim

  vec3 L1 = normalize(vec3(-0.55, 0.75, 0.6));
  col += vec3(1.0) * pow(max(dot(N, normalize(L1 + V)), 0.0), 60.0) * 0.55;
  vec3 L2 = normalize(vec3(0.7, -0.45, 0.5));
  col += uC3 * pow(max(dot(N, normalize(L2 + V)), 0.0), 28.0) * 0.55;

  gl_FragColor = vec4(col, clamp(0.5 + fres * 0.65, 0.0, 1.0));
}`;

const CORE_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uStrength;
varying vec3 vNormal;
varying vec3 vViewPos;
void main(){
  float ndv = clamp(dot(normalize(vNormal), normalize(-vViewPos)), 0.0, 1.0);
  float pulse = 0.85 + 0.15 * sin(uTime * 1.3);
  gl_FragColor = vec4(uColor, pow(ndv, 2.5) * uStrength * pulse);
}`;

const CORE_VERTEX = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPos;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`;

const HALO_FRAGMENT = /* glsl */ `
uniform vec3 uC1;
uniform vec3 uC2;
varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5;
  float d = length(p);
  float a = pow(smoothstep(0.5, 0.0, d), 2.4);
  vec3 col = mix(uC1, uC2, smoothstep(-0.3, 0.3, p.x - p.y));
  gl_FragColor = vec4(col, a * 0.42);
}`;

const UV_VERTEX = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const POINTS_VERTEX = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
varying float vAlpha;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + 0.45 * aSeed) / -mv.z;
  vAlpha = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * (0.5 + aSeed) + aSeed * 40.0));
}`;

const POINTS_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * vAlpha * 0.75);
}`;

const additive = { transparent: true, depthWrite: false, blending: AdditiveBlending };

export function initScene({ canvas, container, anchor, reducedMotion, onReady }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    return null;
  }

  const small = window.matchMedia('(max-width: 860px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const root = new Group(); // positioned over the fallback anchor
  const rig = new Group(); // pointer-driven tilt
  root.add(rig);
  scene.add(root);

  /* Orb */
  const orbUniforms = makeOrbUniforms();
  const orb = new Mesh(
    new IcosahedronGeometry(1, small ? 30 : 56),
    new ShaderMaterial({ uniforms: orbUniforms, vertexShader: ORB_VERTEX, fragmentShader: ORB_FRAGMENT, transparent: true }),
  );
  orb.renderOrder = 2;
  rig.add(orb);

  const coreUniforms = { uColor: { value: rgb('#ffb08a') }, uTime: orbUniforms.uTime, uStrength: { value: 0.55 } };
  const core = new Mesh(
    new IcosahedronGeometry(0.62, 8),
    new ShaderMaterial({ uniforms: coreUniforms, vertexShader: CORE_VERTEX, fragmentShader: CORE_FRAGMENT, ...additive }),
  );
  core.renderOrder = 1;
  rig.add(core);

  /* Halo behind the orb (not rotated, always faces the camera) */
  const halo = new Mesh(
    new PlaneGeometry(6.5, 6.5),
    new ShaderMaterial({
      uniforms: { uC1: { value: rgb(RED) }, uC2: { value: rgb(MAGENTA) } },
      vertexShader: UV_VERTEX,
      fragmentShader: HALO_FRAGMENT,
      ...additive,
    }),
  );
  halo.position.z = -1.5;
  halo.renderOrder = 0;
  root.add(halo);

  /* Geometric shells */
  const shellA = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(1.55, 1)),
    new LineBasicMaterial({ color: new Color(RED), opacity: 0.32, ...additive }),
  );
  const shellB = new LineSegments(
    new EdgesGeometry(new DodecahedronGeometry(1.95, 0)),
    new LineBasicMaterial({ color: new Color(MAGENTA), opacity: 0.22, ...additive }),
  );
  rig.add(shellA, shellB);

  // Glowing vertices on the inner shell
  const vertexPositions = dedupe(new IcosahedronGeometry(1.55, 1).getAttribute('position').array);
  const pointUniforms = { uTime: orbUniforms.uTime, uSize: { value: 70 * dpr }, uColor: { value: rgb('#ffd0c4') } };
  const shellDots = makePoints(vertexPositions, pointUniforms);
  shellA.add(shellDots);

  /* Orbit rings */
  const ringA = new Mesh(new TorusGeometry(2.35, 0.006, 6, 200), new MeshBasicMaterial({ color: new Color(HOT), opacity: 0.4, ...additive }));
  const ringB = new Mesh(new TorusGeometry(2.7, 0.005, 6, 200), new MeshBasicMaterial({ color: new Color(MAGENTA), opacity: 0.3, ...additive }));
  ringA.rotation.set(1.2, 0.35, 0);
  ringB.rotation.set(1.85, -0.5, 0.3);
  rig.add(ringA, ringB);

  /* Particle field */
  const count = small ? 320 : 700;
  const field = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.8 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    field.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta) * 0.7, r * Math.cos(phi) - 1], i * 3);
  }
  const particles = makePoints(field, { uTime: orbUniforms.uTime, uSize: { value: 38 * dpr }, uColor: { value: rgb('#ffb3a6') } });
  root.add(particles);

  /* Layout: sit the orb over the CSS fallback anchor */
  const base = { x: 0, y: 0, scale: 1 };
  function layout() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const c = container.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const halfW = halfH * camera.aspect;
    base.x = ((a.left + a.width / 2 - c.left) / c.width - 0.5) * 2 * halfW;
    base.y = -((a.top + a.height / 2 - c.top) / c.height - 0.5) * 2 * halfH;
    base.scale = ((a.width / 2) / c.height) * 2 * halfH;
  }

  /* Input */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  let scroll = 0;
  const readScroll = () => {
    const r = container.getBoundingClientRect();
    scroll = Math.min(Math.max(-r.top / r.height, 0), 1);
    container.style.setProperty('--hero-fade', (1 - scroll * 0.85).toFixed(3));
  };

  /* Loop */
  const clock = new Clock();
  const intro = { t: reducedMotion ? 1 : 0 };
  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = reducedMotion ? 2.5 : clock.elapsedTime;
    orbUniforms.uTime.value = time;

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;
    intro.t = Math.min(intro.t + dt / 1.6, 1);
    const ease = 1 - Math.pow(1 - intro.t, 3);

    orbUniforms.uAmp.value = 0.09 + scroll * 0.12;

    rig.rotation.y = time * 0.1 + pointer.x * 0.45;
    rig.rotation.x = pointer.y * 0.3;
    orb.rotation.y = time * 0.05;
    shellA.rotation.set(time * 0.07, time * 0.11, 0);
    shellB.rotation.set(-time * 0.05, -time * 0.065, time * 0.03);
    ringA.rotation.z = time * 0.12;
    ringB.rotation.z = -time * 0.09;
    particles.rotation.y = time * 0.015 + pointer.x * 0.08;
    particles.rotation.x = pointer.y * 0.05;

    const s = base.scale * (0.82 + 0.18 * ease);
    root.scale.setScalar(s);
    root.position.set(
      base.x + pointer.x * 0.12,
      base.y + Math.sin(time * 0.6) * 0.06 * base.scale + scroll * 2.2 * base.scale,
      0,
    );

    renderer.render(scene, camera);
  }

  let running = false;
  let visible = true;
  const update = () => {
    const shouldRun = !reducedMotion && visible && !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    renderer.setAnimationLoop(running ? frame : null);
    if (running) clock.getDelta();
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  io.observe(container);

  const ro = new ResizeObserver(() => {
    layout();
    if (!running) frame();
  });
  ro.observe(container);

  const onScroll = () => {
    readScroll();
    if (reducedMotion) frame();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', update);
  if (!reducedMotion) window.addEventListener('pointermove', onPointer, { passive: true });

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    container.classList.remove('is-webgl');
    renderer.setAnimationLoop(null);
    running = false;
  });

  layout();
  readScroll();
  frame();
  update();
  onReady?.();

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', update);
      renderer.dispose();
    },
  };
}

function makeOrbUniforms() {
  return {
    uTime: { value: 0 },
    uAmp: { value: 0.09 },
    uFreq: { value: 1.3 },
    uC1: { value: rgb(HOT) },
    uC2: { value: rgb(RED) },
    uC3: { value: rgb(MAGENTA) },
  };
}

/**
 * Header logo: a miniature of the hero orb — glass core, wire shell and a
 * tilted ring. Spins faster while hovered.
 */
export function initLogo({ canvas, container, hoverTarget = container, reducedMotion, onReady }) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  const size = () => canvas.clientWidth || 60;
  renderer.setSize(size(), size(), false);

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.z = 6.2;

  const rig = new Group();
  rig.rotation.x = 0.25;
  scene.add(rig);

  const uniforms = makeOrbUniforms();
  uniforms.uAmp.value = 0.12;
  uniforms.uFreq.value = 1.6;
  const orb = new Mesh(
    new IcosahedronGeometry(1, 20),
    new ShaderMaterial({ uniforms, vertexShader: ORB_VERTEX, fragmentShader: ORB_FRAGMENT, transparent: true }),
  );
  const core = new Mesh(
    new IcosahedronGeometry(0.85, 6),
    new ShaderMaterial({
      uniforms: { uColor: { value: rgb('#ff7a52') }, uTime: uniforms.uTime, uStrength: { value: 1.6 } },
      vertexShader: CORE_VERTEX,
      fragmentShader: CORE_FRAGMENT,
      ...additive,
    }),
  );
  core.renderOrder = 1;
  orb.renderOrder = 2;
  orb.scale.setScalar(1.12);
  const shell = new LineSegments(
    new EdgesGeometry(new IcosahedronGeometry(1.5, 0)),
    new LineBasicMaterial({ color: new Color(RED), opacity: 0.75, ...additive }),
  );
  const ring = new Mesh(
    new TorusGeometry(1.75, 0.04, 8, 96),
    new MeshBasicMaterial({ color: new Color(HOT), opacity: 0.75, ...additive }),
  );
  ring.rotation.set(1.2, 0.35, 0);
  rig.add(core, orb, shell, ring);

  let speed = 1;
  let targetSpeed = 1;
  let t = 1.5;
  const clock = new Clock();
  const enter = () => (targetSpeed = 4);
  const leave = () => (targetSpeed = 1);
  hoverTarget.addEventListener('pointerenter', enter);
  hoverTarget.addEventListener('pointerleave', leave);

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    speed += (targetSpeed - speed) * 0.06;
    if (!reducedMotion) t += dt * speed;
    uniforms.uTime.value = t;
    rig.rotation.y = t * 0.5;
    shell.rotation.set(t * 0.3, t * 0.45, 0);
    ring.rotation.z = t * 0.6;
    renderer.render(scene, camera);
  }

  let running = false;
  const update = () => {
    const shouldRun = !reducedMotion && !document.hidden;
    if (shouldRun === running) return;
    running = shouldRun;
    renderer.setAnimationLoop(running ? frame : null);
    if (running) clock.getDelta();
  };
  document.addEventListener('visibilitychange', update);
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    container.classList.remove('is-webgl');
    renderer.setAnimationLoop(null);
  });

  frame();
  update();
  onReady?.();

  return {
    dispose() {
      renderer.setAnimationLoop(null);
      document.removeEventListener('visibilitychange', update);
      hoverTarget.removeEventListener('pointerenter', enter);
      hoverTarget.removeEventListener('pointerleave', leave);
      renderer.dispose();
    },
  };
}

function makePoints(positions, uniforms) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const seeds = new Float32Array(positions.length / 3).map(() => Math.random());
  geometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 1));
  return new Points(
    geometry,
    new ShaderMaterial({ uniforms, vertexShader: POINTS_VERTEX, fragmentShader: POINTS_FRAGMENT, ...additive }),
  );
}

function dedupe(array) {
  const seen = new Set();
  const out = [];
  for (let i = 0; i < array.length; i += 3) {
    const key = `${array[i].toFixed(3)},${array[i + 1].toFixed(3)},${array[i + 2].toFixed(3)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(array[i], array[i + 1], array[i + 2]);
  }
  return out;
}
