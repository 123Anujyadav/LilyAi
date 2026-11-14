import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* The Lily conversational core.
   - A breathing intelligence core (noise-displaced shell + nucleus)
   - Sound rings that carry a live waveform
   - Two signal paths: Mode A (cyan, travels outward to the other participant)
     and Mode B (lavender, loops back privately to the owner)
   - Context nodes in orbit
   Everything is procedural; there are no downloaded 3D assets. */

export type CoreVariant = 'both' | 'a' | 'b';
export type CoreQuality = 'high' | 'low';

const CYAN = new THREE.Color('#39d8f2');
const BLUE = new THREE.Color('#356bff');
const VIOLET = new THREE.Color('#8065f5');
const LAVENDER = new THREE.Color('#b9aeff');
const ICE = new THREE.Color('#ddf8ff');

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

function Core({ quality, tint }: { quality: CoreQuality; tint: THREE.Color }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uA: { value: BLUE.clone() },
      uB: { value: tint.clone() },
      uC: { value: VIOLET.clone() },
    }),
    [tint],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh>
      <icosahedronGeometry args={[1.18, quality === 'high' ? 40 : 18]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        vertexShader={
          NOISE +
          /* glsl */ `
          uniform float uTime; varying vec3 vN; varying vec3 vV; varying float vD;
          void main(){
            float n = snoise(normal*1.35 + uTime*0.22);
            float n2 = snoise(normal*3.4 - uTime*0.35)*0.35;
            float d = (n+n2)*0.11;
            vD = d;
            vec3 p = position + normal*d;
            vec4 mv = modelViewMatrix*vec4(p,1.0);
            vN = normalize(normalMatrix*normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix*mv;
          }`
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; varying vec3 vN; varying vec3 vV; varying float vD;
          void main(){
            float f = pow(1.0 - max(dot(vN,vV),0.0), 2.2);
            vec3 base = mix(vec3(0.02,0.04,0.12), uA*0.55, smoothstep(-0.2,0.25,vD));
            base = mix(base, uC*0.6, smoothstep(0.05,0.3,vD)*0.5);
            vec3 col = base*0.9 + uB*f*1.5 + vec3(1.0)*pow(f,5.0)*0.6;
            float a = mix(0.5, 0.98, smoothstep(0.0,0.75,f));
            gl_FragColor = vec4(col, a);
          }`
        }
      />
    </mesh>
  );
}

function Lattice() {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.62, 2)), []);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.06;
      ref.current.rotation.x += dt * 0.02;
    }
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color="#9fd9ff" transparent opacity={0.13} depthWrite={false} />
    </lineSegments>
  );
}

function Glow({ color, size = 7.5, strength = 0.55, z = -0.6 }: { color: THREE.Color; size?: number; strength?: number; z?: number }) {
  const { camera } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => ref.current?.quaternion.copy(camera.quaternion));
  return (
    <mesh ref={ref} position={[0, 0, z]} renderOrder={z < 0 ? -1 : 4}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        depthTest={z < 0}
        uniforms={{ uC: { value: color }, uS: { value: strength } }}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`uniform vec3 uC; uniform float uS; varying vec2 vUv; void main(){ float d=distance(vUv,vec2(0.5)); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(uC, a*a*a*uS); }`}
      />
    </mesh>
  );
}


/* The live waveform inside the core. Always faces the camera. */
function Waveform({ color }: { color: THREE.Color }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const n = 220;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = i / (n - 1);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aX', new THREE.BufferAttribute(x, 1));
    return g;
  }, []);
  const line = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: color } },
      vertexShader: /* glsl */ `
        attribute float aX; uniform float uTime; varying float vA;
        void main(){
          float x = (aX-0.5)*2.0;
          float env = pow(1.0-abs(x), 1.6);
          float y = (sin(aX*46.0+uTime*6.0)*0.55 + sin(aX*19.0-uTime*3.4)*0.45) * env * (0.24 + 0.1*sin(uTime*1.3));
          vA = env;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(x*1.0, y, 0.0, 1.0);
        }`,
      fragmentShader: `uniform vec3 uColor; varying float vA; void main(){ gl_FragColor=vec4(uColor, 0.25+vA*0.75); }`,
    });
    const l = new THREE.Line(geo, m);
    l.frustumCulled = false;
    l.renderOrder = 5;
    return l;
  }, [geo, color]);
  useFrame((_, dt) => {
    (line.material as THREE.ShaderMaterial).uniforms.uTime.value += dt;
    group.current?.quaternion.copy(camera.quaternion);
  });
  void mat;
  return (
    <group ref={group}>
      <primitive object={line} />
    </group>
  );
}

/* A ring whose radius carries a travelling waveform */
function SoundRing({
  radius,
  tilt,
  color,
  speed,
  amp,
  freq,
}: {
  radius: number;
  tilt: [number, number, number];
  color: THREE.Color;
  speed: number;
  amp: number;
  freq: number;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const n = 360;
    const a = new Float32Array(n + 1);
    const pos = new Float32Array((n + 1) * 3);
    for (let i = 0; i <= n; i++) a[i] = (i / n) * Math.PI * 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aAngle', new THREE.BufferAttribute(a, 1));
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uR: { value: radius },
      uAmp: { value: amp },
      uFreq: { value: freq },
      uColor: { value: color },
    }),
    [radius, amp, freq, color],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <lineLoop geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={
            /* glsl */ `
            attribute float aAngle; uniform float uTime; uniform float uR; uniform float uAmp; uniform float uFreq; varying float vE;
            void main(){
              float env = pow(max(0.0, cos(aAngle*0.5 - uTime*0.35)), 6.0);
              float w = sin(aAngle*uFreq + uTime*3.0)*sin(aAngle*uFreq*0.37 - uTime*1.7);
              float r = uR + w*uAmp*env;
              vE = env;
              vec3 p = vec3(cos(aAngle)*r, sin(aAngle)*r, w*uAmp*env*0.6);
              gl_Position = projectionMatrix*modelViewMatrix*vec4(p,1.0);
            }`
          }
          fragmentShader={`uniform vec3 uColor; varying float vE; void main(){ gl_FragColor=vec4(uColor, 0.38 + vE*0.62); }`}
        />
      </lineLoop>
    </group>
  );
}

/* Particles flowing along a curve */
function SignalPath({
  points,
  color,
  count,
  speed,
  loop,
}: {
  points: [number, number, number][];
  color: THREE.Color;
  count: number;
  speed: number;
  loop?: boolean;
}) {
  const SAMPLES = 320;
  const { table, lineObj } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      !!loop,
      'catmullrom',
      0.5,
    );
    const pts = curve.getSpacedPoints(SAMPLES);
    const t = new Float32Array((SAMPLES + 1) * 3);
    pts.forEach((p, i) => p.toArray(t, i * 3));
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { table: t, lineObj: new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat) };
  }, [points, loop, color]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const seeds = new Float32Array(count);
    const jitter = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
      jitter[i * 3] = (Math.random() - 0.5) * 0.09;
      jitter[i * 3 + 1] = (Math.random() - 0.5) * 0.09;
      jitter[i * 3 + 2] = (Math.random() - 0.5) * 0.09;
    }
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    g.userData.jitter = jitter;
    return g;
  }, [count]);

  const clock = useRef(0);
  useFrame((_, dt) => {
    clock.current += dt * speed;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const seeds = geo.attributes.aSeed as THREE.BufferAttribute;
    const jitter = geo.userData.jitter as Float32Array;
    for (let i = 0; i < count; i++) {
      const u = (seeds.getX(i) + clock.current) % 1;
      const f = u * SAMPLES;
      const i0 = Math.floor(f);
      const k = f - i0;
      const a = i0 * 3;
      const b = Math.min(i0 + 1, SAMPLES) * 3;
      pos.setXYZ(
        i,
        table[a] + (table[b] - table[a]) * k + jitter[i * 3],
        table[a + 1] + (table[b + 1] - table[a + 1]) * k + jitter[i * 3 + 1],
        table[a + 2] + (table[b + 2] - table[a + 2]) * k + jitter[i * 3 + 2],
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <primitive object={lineObj} />
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uColor: { value: color } }}
          vertexShader={
            /* glsl */ `
            attribute float aSeed; varying float vS;
            void main(){ vS=aSeed; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=(18.0+aSeed*34.0)/-mv.z; gl_Position=projectionMatrix*mv; }`
          }
          fragmentShader={`uniform vec3 uColor; varying float vS; void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(uColor, a*(0.35+vS*0.65)); }`}
        />
      </points>
    </group>
  );
}


/* A ring of bars around the core that behaves like a live audio spectrum */
function Equalizer({ count, radius, color }: { count: number; radius: number; color: THREE.Color }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    const m = ref.current;
    if (!m) return;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const v = 0.5 + 0.5 * Math.sin(a * 5 + t * 2.6) * Math.sin(a * 2 - t * 1.3) + 0.25 * Math.sin(a * 13 + t * 5.2);
      const h = 0.06 + Math.max(0, v) * 0.42;
      dummy.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      dummy.rotation.set(0, -a, 0);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    m.rotation.y = t * 0.08;
  });
  return (
    <group rotation={[0.42, 0, 0.12]}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[0.022, 1, 0.022]} />
        <meshBasicMaterial color={color} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
      </instancedMesh>
    </group>
  );
}

/* Expanding rings: each one is a spoken word leaving the core */
function Pulses({ color, n = 3 }: { color: THREE.Color; n?: number }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.quaternion.copy(camera.quaternion);
    g.children.forEach((c, i) => {
      const u = (clock.elapsedTime * 0.22 + i / n) % 1;
      const mesh = c as THREE.Mesh;
      mesh.scale.setScalar(1.3 + u * 2.6);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - u) * (1 - u) * 0.5;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i}>
          <ringGeometry args={[0.985, 1, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* Solid glass orbit rings that catch the light as they turn */
function GlassRing({ radius, tube, tilt, speed, color }: { radius: number; tube: number; tilt: [number, number, number]; speed: number; color: THREE.Color }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, tube, 12, 160]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uC: { value: color } }}
          vertexShader={`varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`}
          fragmentShader={`uniform vec3 uC; varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ float f=pow(1.0-abs(dot(vN,vV)),1.6); float sweep=pow(max(0.0,sin(vUv.x*6.2831)),8.0); gl_FragColor=vec4(uC*(0.35+f*0.9)+vec3(1.0)*sweep*0.8, 0.25+f*0.5+sweep*0.5); }`}
        />
      </mesh>
    </group>
  );
}

function ContextNodes({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        r: 2.05 + (i % 3) * 0.32,
        phase: (i / count) * Math.PI * 2,
        tilt: -0.5 + (i % 4) * 0.34,
        speed: 0.12 + (i % 3) * 0.05,
        size: 0.035 + (i % 2) * 0.02,
      })),
    [count],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current?.children.forEach((child, i) => {
      const n = nodes[i];
      const a = n.phase + t * n.speed;
      child.position.set(Math.cos(a) * n.r, Math.sin(a) * n.r * Math.sin(n.tilt) * 0.9, Math.sin(a) * n.r * Math.cos(n.tilt));
    });
  });
  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i}>
          <sphereGeometry args={[n.size, 12, 12]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#b9aeff' : '#ddf8ff'} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 5.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      p[i * 3] = r * Math.sin(ph) * Math.cos(th);
      p[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      p[i * 3 + 2] = r * Math.cos(ph) - 1.5;
      s[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} geometry={geo}>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`attribute float aSeed; varying float vS; void main(){ vS=aSeed; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=(6.0+aSeed*26.0)/-mv.z; gl_Position=projectionMatrix*mv; }`}
        fragmentShader={`varying float vS; void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d); vec3 c=mix(vec3(0.22,0.85,0.95), vec3(0.72,0.68,1.0), vS); gl_FragColor=vec4(c, a*(0.12+vS*0.4)); }`}
      />
    </points>
  );
}

/* Mode A leaves the core and travels outward (spoken to the other participant).
   Mode B leaves the core and returns to the front (private to the owner). */
const PATH_A: [number, number, number][] = [
  [0, 0, 0],
  [1.2, 0.5, 0.6],
  [2.6, 1.25, 0.2],
  [4.2, 1.5, -1.2],
  [6.4, 1.1, -3.2],
];
const PATH_B: [number, number, number][] = [
  [0, 0, 0],
  [-1.1, -0.35, 0.9],
  [-2.3, -1.15, 1.5],
  [-2.2, -2.0, 2.6],
  [-0.9, -2.2, 3.6],
  [0.4, -1.9, 4.4],
];

function Rig({
  variant,
  quality,
  scrollRef,
  offset,
}: {
  variant: CoreVariant;
  quality: CoreQuality;
  scrollRef?: React.RefObject<number>;
  offset: [number, number];
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const hi = quality === 'high';
  const tint = variant === 'b' ? LAVENDER : CYAN;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-dt * 3);
    target.current.x += (state.pointer.x * 0.28 - target.current.x) * k;
    target.current.y += (-state.pointer.y * 0.18 - target.current.y) * k;
    const s = scrollRef?.current ?? 0;
    g.rotation.y = target.current.x + s * 0.9 + Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    g.rotation.x = target.current.y + s * 0.25;
    g.position.x = offset[0] * viewport.width * 0.5;
    g.position.y = offset[1] * viewport.height * 0.5 + s * 1.4;
    const base = Math.min(viewport.width / 4.6, viewport.height / 7.0, 1);
    g.scale.setScalar(base * (1 - s * 0.25) * (1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.015));
  });

  return (
    <>
      <Dust count={hi ? 420 : 140} />
      <group ref={group}>
        <Glow color={tint} />
        <Core quality={quality} tint={tint} />
        <Glow color={ICE} size={1.5} strength={1.0} z={0} />
        <Waveform color={ICE} />
        <Lattice />
        <SoundRing radius={1.95} tilt={[1.25, 0.2, 0]} color={CYAN} speed={1} amp={0.16} freq={22} />
        <SoundRing radius={2.3} tilt={[1.05, -0.45, 0.3]} color={BLUE} speed={0.7} amp={0.12} freq={16} />
        {hi && <SoundRing radius={2.7} tilt={[1.4, 0.6, -0.2]} color={VIOLET} speed={0.5} amp={0.1} freq={12} />}
        {variant !== 'b' && <SignalPath points={PATH_A} color={CYAN} count={hi ? 110 : 50} speed={0.11} />}
        {variant !== 'a' && <SignalPath points={PATH_B} color={LAVENDER} count={hi ? 110 : 50} speed={0.09} />}
        <Equalizer count={hi ? 96 : 48} radius={1.48} color={tint} />
        <Pulses color={tint} n={hi ? 3 : 2} />
        <GlassRing radius={2.05} tube={0.012} tilt={[1.1, 0.5, 0]} speed={0.25} color={ICE} />
        {hi && <GlassRing radius={2.5} tube={0.008} tilt={[0.5, -0.9, 0.4]} speed={-0.18} color={LAVENDER} />}
        <ContextNodes count={hi ? 9 : 5} />
      </group>
    </>
  );
}

export default function CoreScene({
  variant = 'both',
  quality = 'high',
  active = true,
  scrollRef,
  offset = [0, 0],
}: {
  variant?: CoreVariant;
  quality?: CoreQuality;
  active?: boolean;
  scrollRef?: React.RefObject<number>;
  offset?: [number, number];
}) {
  return (
    <Canvas
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ fov: 36, position: [0, 0, 8.2], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Rig variant={variant} quality={quality} scrollRef={scrollRef} offset={offset} />
    </Canvas>
  );
}
