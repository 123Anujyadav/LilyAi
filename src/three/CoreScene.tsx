import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* The Lily conversational core, modelled on the brand's orb film:
   - a glass sphere with a geodesic wireframe and soft reflections
   - a wavy ribbon of energy and a bright live waveform inside it
   - thin orbit rings, and bokeh particles drifting around it
   - two signal paths: Mode A (cyan, travels outward to the other participant)
     and Mode B (lavender, loops back privately to the owner)
   Everything is procedural; there are no downloaded 3D assets or video. */

export type CoreVariant = 'both' | 'a' | 'b';
export type CoreQuality = 'high' | 'low';

const CYAN = new THREE.Color('#39d8f2');
const LAVENDER = new THREE.Color('#b9aeff');

type Palette = { glow: THREE.Color; ribbonA: THREE.Color; ribbonB: THREE.Color; wave: THREE.Color; ring: THREE.Color; glass: THREE.Color };
const PALETTES: Record<CoreVariant, Palette> = {
  both: {
    glow: new THREE.Color('#6d5cff'),
    ribbonA: new THREE.Color('#9a7bff'),
    ribbonB: new THREE.Color('#4f7dff'),
    wave: new THREE.Color('#e3b4ff'),
    ring: new THREE.Color('#9aa8ff'),
    glass: new THREE.Color('#a9c8ff'),
  },
  a: {
    glow: new THREE.Color('#1fa9d6'),
    ribbonA: new THREE.Color('#39d8f2'),
    ribbonB: new THREE.Color('#356bff'),
    wave: new THREE.Color('#ddf8ff'),
    ring: new THREE.Color('#7fdcf5'),
    glass: new THREE.Color('#a9e6ff'),
  },
  b: {
    glow: new THREE.Color('#8065f5'),
    ribbonA: new THREE.Color('#c3b4ff'),
    ribbonB: new THREE.Color('#8065f5'),
    wave: new THREE.Color('#f1dcff'),
    ring: new THREE.Color('#b9aeff'),
    glass: new THREE.Color('#cfc4ff'),
  },
};

/* ---------- Glass sphere ---------- */
function GlassSphere({ color, segments }: { color: THREE.Color; segments: number }) {
  return (
    <mesh renderOrder={8}>
      <sphereGeometry args={[1.3, segments, segments]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={{ uC: { value: color } }}
        vertexShader={
          /* glsl */ `
          varying vec3 vN; varying vec3 vV;
          void main(){
            vec4 mv = modelViewMatrix*vec4(position,1.0);
            vN = normalize(normalMatrix*normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix*mv;
          }`
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uC; varying vec3 vN; varying vec3 vV;
          void main(){
            float ndv = max(dot(vN,vV),0.0);
            float rim = pow(1.0-ndv, 2.6);
            /* soft studio reflections, as on a real glass ball */
            float capL = pow(max(dot(vN, normalize(vec3(-0.55,0.62,0.55))),0.0), 9.0);
            float capR = pow(max(dot(vN, normalize(vec3(0.62,0.5,0.6))),0.0), 14.0);
            float low  = pow(max(dot(vN, normalize(vec3(0.1,-0.8,0.58))),0.0), 22.0);
            float spec = pow(max(dot(vN, normalize(vec3(-0.45,0.7,0.55))),0.0), 90.0);
            vec3 col = uC*rim*1.25 + vec3(0.86,0.92,1.0)*(capL*0.42 + capR*0.3 + low*0.22 + spec*0.9 + pow(rim,5.0)*0.7);
            float a = rim*0.72 + capL*0.2 + capR*0.14 + low*0.12 + spec*0.8 + 0.035;
            gl_FragColor = vec4(col, a);
          }`
        }
      />
    </mesh>
  );
}

/* Geodesic wireframe on the glass */
function Geodesic({ color, detail }: { color: THREE.Color; detail: number }) {
  const ref = useRef<THREE.LineSegments>(null);
  const geo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.305, detail)), [detail]);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.07;
      ref.current.rotation.x += dt * 0.018;
    }
  });
  return (
    <lineSegments ref={ref} geometry={geo} renderOrder={7}>
      <lineBasicMaterial color={color} transparent opacity={0.14} depthWrite={false} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ---------- Energy ribbon: many closed loops that together read as a woven band ---------- */
function Ribbon({ a, b, loops }: { a: THREE.Color; b: THREE.Color; loops: number }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const objects = useMemo(() => {
    const n = 300;
    const ang = new Float32Array(n + 1);
    for (let i = 0; i <= n; i++) ang[i] = (i / n) * Math.PI * 2;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((n + 1) * 3), 3));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(ang, 1));
    return Array.from({ length: loops }, (_, i) => {
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uK: { value: i / Math.max(1, loops - 1) }, uA: { value: a }, uB: { value: b } },
        vertexShader: /* glsl */ `
          attribute float aAngle; uniform float uTime; uniform float uK; varying float vMix; varying float vEdge;
          void main(){
            float t = uTime;
            float k = uK;
            float r = 0.78
              + 0.15*sin(aAngle*3.0 + t*0.8 + k*0.7)
              + 0.085*sin(aAngle*5.0 - t*1.25 + k*1.3)
              + 0.04*sin(aAngle*8.0 + t*1.9);
            r *= 1.0 - k*0.2;
            float z = sin(aAngle*2.0 + t*0.6)*0.32*(k-0.5) + cos(aAngle*3.0 - t*0.4)*0.1;
            vMix = 0.5 + 0.5*sin(aAngle + t*0.5 + k*2.0);
            vEdge = 1.0 - abs(k-0.5)*1.4;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(cos(aAngle)*r, sin(aAngle)*r*0.94, z, 1.0);
          }`,
        fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying float vMix; varying float vEdge; void main(){ gl_FragColor=vec4(mix(uB,uA,vMix), 0.2 + (1.0-vEdge)*0.62); }`,
      });
      const loop = new THREE.LineLoop(geo, mat);
      loop.frustumCulled = false;
      loop.renderOrder = 4;
      return loop;
    });
  }, [a, b, loops]);
  useFrame((_, dt) => {
    objects.forEach((o) => ((o.material as THREE.ShaderMaterial).uniforms.uTime.value += dt));
    group.current?.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={group}>
      {objects.map((o, i) => (
        <primitive key={i} object={o} />
      ))}
    </group>
  );
}

/* ---------- Live waveform across the middle, with a light flare behind it ---------- */
function Waveform({ color }: { color: THREE.Color }) {
  const { camera } = useThree();
  const group = useRef<THREE.Group>(null);
  const flare = useRef<THREE.ShaderMaterial>(null);
  const lines = useMemo(() => {
    const n = 320;
    const x = new Float32Array(n);
    for (let i = 0; i < n; i++) x[i] = i / (n - 1);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.setAttribute('aX', new THREE.BufferAttribute(x, 1));
    return [0, 0.008, -0.008, 0.016, -0.016].map((off, i) => {
      const m = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uColor: { value: color }, uOff: { value: off }, uGain: { value: i === 0 ? 1 : 0.45 } },
        vertexShader: /* glsl */ `
          attribute float aX; uniform float uTime; uniform float uOff; varying float vA;
          void main(){
            float x = (aX-0.5)*2.0;
            float env = pow(1.0-abs(x), 2.3);
            float talk = 0.62 + 0.38*sin(uTime*1.7)*sin(uTime*0.63+1.2);
            float y = (sin(aX*74.0+uTime*7.0)*0.5 + sin(aX*31.0-uTime*4.1)*0.32 + sin(aX*127.0+uTime*11.0)*0.18) * env * 0.56 * talk;
            y += sin(aX*18.0 + uTime*2.0)*0.012;
            vA = 0.35 + env*0.65;
            gl_Position = projectionMatrix*modelViewMatrix*vec4(x*1.24, y + uOff, 0.0, 1.0);
          }`,
        fragmentShader: `uniform vec3 uColor; uniform float uGain; varying float vA; void main(){ gl_FragColor=vec4(uColor, vA*uGain); }`,
      });
      const l = new THREE.Line(geo, m);
      l.frustumCulled = false;
      l.renderOrder = 6;
      return l;
    });
  }, [color]);
  useFrame((_, dt) => {
    lines.forEach((l) => ((l.material as THREE.ShaderMaterial).uniforms.uTime.value += dt));
    if (flare.current) flare.current.uniforms.uTime.value += dt;
    group.current?.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={group}>
      <mesh renderOrder={5}>
        <planeGeometry args={[3.0, 1.1]} />
        <shaderMaterial
          ref={flare}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uC: { value: color }, uTime: { value: 0 } }}
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`uniform vec3 uC; uniform float uTime; varying vec2 vUv; void main(){ vec2 p=vUv-0.5; float core=exp(-p.y*p.y*900.0)*exp(-p.x*p.x*9.0); float halo=exp(-p.y*p.y*70.0)*exp(-p.x*p.x*14.0); float a=(core*0.55+halo*0.2)*(0.8+0.2*sin(uTime*2.3)); gl_FragColor=vec4(uC,a); }`}
        />
      </mesh>
      {lines.map((l, i) => (
        <primitive key={i} object={l} />
      ))}
    </group>
  );
}

/* Soft additive light, always facing the camera */
function Glow({ color, size, strength, z }: { color: THREE.Color; size: number; strength: number; z: number }) {
  const { camera } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => ref.current?.quaternion.copy(camera.quaternion));
  return (
    <mesh ref={ref} position={[0, 0, z]} renderOrder={z < 0 ? -1 : 3}>
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        depthTest={z < 0}
        blending={THREE.AdditiveBlending}
        uniforms={{ uC: { value: color }, uS: { value: strength } }}
        vertexShader={`varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
        fragmentShader={`uniform vec3 uC; uniform float uS; varying vec2 vUv; void main(){ float d=distance(vUv,vec2(0.5)); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(uC, a*a*a*uS); }`}
      />
    </mesh>
  );
}

/* Thin orbit ring that catches the light as it turns */
function OrbitRing({ radius, tube, tilt, speed, color }: { radius: number; tube: number; tilt: [number, number, number]; speed: number; color: THREE.Color }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, tube, 10, 200]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{ uC: { value: color } }}
          vertexShader={`varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`}
          fragmentShader={`uniform vec3 uC; varying vec3 vN; varying vec3 vV; varying vec2 vUv; void main(){ float f=pow(1.0-abs(dot(vN,vV)),1.4); float sweep=pow(max(0.0,sin(vUv.x*6.2831)),10.0); gl_FragColor=vec4(uC*(0.55+f*0.8)+vec3(1.0)*sweep*0.9, 0.42+f*0.4+sweep*0.5); }`}
        />
      </mesh>
    </group>
  );
}

/* Expanding rings: each one is a spoken word leaving the core */
function Pulses({ color, n }: { color: THREE.Color; n: number }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.quaternion.copy(camera.quaternion);
    g.children.forEach((c, i) => {
      const u = (clock.elapsedTime * 0.2 + i / n) % 1;
      const mesh = c as THREE.Mesh;
      mesh.scale.setScalar(1.35 + u * 2.4);
      (mesh.material as THREE.MeshBasicMaterial).opacity = (1 - u) * (1 - u) * 0.32;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i}>
          <ringGeometry args={[0.99, 1, 96]} />
          <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* Particles flowing along a curve */
function SignalPath({ points, color, count, speed }: { points: [number, number, number][]; color: THREE.Color; count: number; speed: number }) {
  const SAMPLES = 320;
  const { table, lineObj } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    );
    const pts = curve.getSpacedPoints(SAMPLES);
    const t = new Float32Array((SAMPLES + 1) * 3);
    pts.forEach((p, i) => p.toArray(t, i * 3));
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending });
    return { table: t, lineObj: new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat) };
  }, [points, color]);

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
          vertexShader={`attribute float aSeed; varying float vS; void main(){ vS=aSeed; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=(18.0+aSeed*34.0)/-mv.z; gl_Position=projectionMatrix*mv; }`}
          fragmentShader={`uniform vec3 uColor; varying float vS; void main(){ float d=length(gl_PointCoord-0.5); float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(uColor, a*(0.35+vS*0.65)); }`}
        />
      </points>
    </group>
  );
}

/* Bokeh: soft out-of-focus discs at different depths that drift upward and twinkle */
function Bokeh({ count, a, b }: { count: number; a: THREE.Color; b: THREE.Color }) {
  const ref = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 12;
      p[i * 3 + 2] = -7 + Math.random() * 11;
      s[i] = Math.random();
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(s, 1));
    return g;
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uA: { value: a }, uB: { value: b } }), [a, b]);
  useFrame((state, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
    if (ref.current) {
      ref.current.rotation.y = state.pointer.x * 0.04;
      ref.current.rotation.x = -state.pointer.y * 0.03;
    }
  });
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={
          /* glsl */ `
          attribute float aSeed; uniform float uTime; varying float vS; varying float vBlur;
          void main(){
            vS = aSeed;
            vec3 p = position;
            p.y = mod(p.y + uTime*(0.08+aSeed*0.16) + 6.0, 12.0) - 6.0;
            p.x += sin(uTime*0.25 + aSeed*30.0)*0.35;
            vec4 mv = modelViewMatrix*vec4(p,1.0);
            /* particles far from the focal plane get larger and softer */
            vBlur = clamp(abs(-mv.z - 8.2)/6.0, 0.0, 1.0);
            gl_PointSize = (10.0 + aSeed*22.0 + vBlur*90.0)/-mv.z;
            gl_Position = projectionMatrix*mv;
          }`
        }
        fragmentShader={
          /* glsl */ `
          uniform vec3 uA; uniform vec3 uB; uniform float uTime; varying float vS; varying float vBlur;
          void main(){
            float d = length(gl_PointCoord-0.5);
            float disc = smoothstep(0.5, 0.5 - mix(0.42, 0.1, vBlur), d);
            float tw = 0.65 + 0.35*sin(uTime*(0.8+vS*2.0) + vS*40.0);
            vec3 c = mix(uB, uA, vS);
            gl_FragColor = vec4(c, disc * tw * mix(0.5, 0.11, vBlur));
          }`
        }
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
  const pal = PALETTES[variant];

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-dt * 3);
    target.current.x += (state.pointer.x * 0.3 - target.current.x) * k;
    target.current.y += (-state.pointer.y * 0.2 - target.current.y) * k;
    const s = scrollRef?.current ?? 0;
    g.rotation.y = target.current.x + s * 0.9 + Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    g.rotation.x = target.current.y + s * 0.25;
    g.position.x = offset[0] * viewport.width * 0.5;
    g.position.y = offset[1] * viewport.height * 0.5 + s * 1.4;
    const base = Math.min(viewport.width / 4.6, viewport.height / 6.4, 1.08);
    g.scale.setScalar(base * (1 - s * 0.25) * (1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.012));
  });

  return (
    <>
      <Bokeh count={hi ? 340 : 110} a={pal.ribbonA} b={pal.ring} />
      <group ref={group}>
        <Glow color={pal.glow} size={8.5} strength={0.42} z={-0.8} />
        <Glow color={pal.glow} size={2.6} strength={0.26} z={0} />
        <Ribbon a={pal.ribbonA} b={pal.ribbonB} loops={hi ? 22 : 10} />
        <Waveform color={pal.wave} />
        <Geodesic color={pal.glass} detail={hi ? 4 : 3} />
        <GlassSphere color={pal.glass} segments={hi ? 96 : 48} />
        <OrbitRing radius={2.0} tube={0.011} tilt={[1.18, 0.52, 0]} speed={0.22} color={pal.ring} />
        <OrbitRing radius={2.0} tube={0.011} tilt={[1.18, -0.6, 0.2]} speed={-0.18} color={pal.ring} />
        {hi && <OrbitRing radius={2.32} tube={0.006} tilt={[0.12, 0.1, 0]} speed={0.08} color={pal.glass} />}
        <Pulses color={pal.ring} n={hi ? 3 : 2} />
        {variant !== 'b' && <SignalPath points={PATH_A} color={CYAN} count={hi ? 110 : 50} speed={0.11} />}
        {variant !== 'a' && <SignalPath points={PATH_B} color={LAVENDER} count={hi ? 110 : 50} speed={0.09} />}
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
