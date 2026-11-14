import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* A sound field: a plane of points carrying travelling waves, seen at a low angle.
   Used as an ambient 3D layer behind dark sections. The pointer sends a ripple through it. */
function Field({ cols, rows, tone }: { cols: number; rows: number; tone: 'cyan' | 'lavender' }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let z = 0; z < rows; z++)
      for (let x = 0; x < cols; x++) {
        p[k++] = (x / (cols - 1) - 0.5) * 26;
        p[k++] = 0;
        p[k++] = (z / (rows - 1) - 0.5) * 14;
      }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, [cols, rows]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uA: { value: new THREE.Color(tone === 'cyan' ? '#39d8f2' : '#b9aeff') },
      uB: { value: new THREE.Color(tone === 'cyan' ? '#356bff' : '#8065f5') },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }),
    [tone],
  );
  useFrame((state, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    const u = mat.current.uniforms.uPointer.value as THREE.Vector2;
    u.x += (state.pointer.x * 11 - u.x) * 0.05;
    u.y += (-state.pointer.y * 5 - u.y) * 0.05;
    if (group.current) group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.12 + state.pointer.x * 0.05;
  });
  return (
    <group ref={group} position={[0, -1.7, 0]}>
      <points geometry={geo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={
            /* glsl */ `
            uniform float uTime; uniform vec2 uPointer; varying float vH; varying float vFade;
            void main(){
              vec3 p = position;
              float d = length(p.xz - uPointer);
              float w = sin(p.x*0.55 + uTime*0.9)*0.35 + sin(p.z*0.8 - uTime*0.7)*0.3 + sin((p.x+p.z)*0.3 + uTime*0.4)*0.4;
              float ripple = sin(d*1.6 - uTime*3.0) * exp(-d*0.22) * 0.9;
              p.y = w + ripple;
              vH = p.y;
              vec4 mv = modelViewMatrix*vec4(p,1.0);
              vFade = smoothstep(26.0, 6.0, -mv.z) * smoothstep(13.5, 9.0, abs(position.x));
              gl_PointSize = (26.0 + vH*14.0)/-mv.z;
              gl_Position = projectionMatrix*mv;
            }`
          }
          fragmentShader={
            /* glsl */ `
            uniform vec3 uA; uniform vec3 uB; varying float vH; varying float vFade;
            void main(){
              float d = length(gl_PointCoord-0.5);
              float a = smoothstep(0.5,0.05,d);
              vec3 c = mix(uB, uA, smoothstep(-0.6,0.9,vH));
              gl_FragColor = vec4(c, a*vFade*(0.35+smoothstep(-0.2,1.0,vH)*0.65));
            }`
          }
        />
      </points>
    </group>
  );
}

export default function FieldScene({ active = true, low = false, tone = 'cyan' }: { active?: boolean; low?: boolean; tone?: 'cyan' | 'lavender' }) {
  return (
    <Canvas
      dpr={low ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 42, position: [0, 1.6, 9], near: 0.1, far: 60 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Field cols={low ? 70 : 130} rows={low ? 36 : 64} tone={tone} />
    </Canvas>
  );
}
