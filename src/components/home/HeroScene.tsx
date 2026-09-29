"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cssColor, subscribeTheme } from "@/lib/theme";
import { heroState } from "./heroState";

/**
 * "We make ideas move": a zoetrope. Twelve frames on a spinning drum, curved to
 * the drum, split into RGB when the scroll pushes the spin (a motion-blur nod).
 */

const FRAMES = [
  "brand-teal",
  "artist-smoke",
  "drone-roundabout",
  "product-headphones",
  "artist-blue",
  "events-holi",
  "clapper",
  "product-car-cover",
  "drone-tide",
  "bts-hands-camera",
  "brand-yellow",
  "events-lasers",
].map((name) => `/media/tex/${name}.jpg`);

const RADIUS = 3.6;
const W = 1.5;
const H = 2;
const BASE_SPEED = 0.14;
const damp = THREE.MathUtils.damp;

// Uniforms shared by every frame's material: the RGB split (set once per frame) and the
// page colour that frames fade into as they turn away (near-black on dark, paper on light).
const uShift = { value: 0 };
const uFade = { value: new THREE.Color("#0b0b0c") };

const vertexShader = /* glsl */ `
  uniform float uRadius;
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    vUv = uv;
    vec3 p = position;
    // Wrap the flat plane around the drum so neighbouring frames read as one band.
    float a = p.x / uRadius;
    p.x = sin(a) * uRadius;
    p.z = (cos(a) - 1.0) * uRadius;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vec3 n = normalize(mat3(modelMatrix) * vec3(sin(a), 0.0, cos(a)));
    vFacing = dot(n, normalize(cameraPosition - world.xyz));
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCover;
  uniform float uShift;
  uniform vec3 uFade;
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    vec2 uv = vUv;
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
    uv = (uv - 0.5) * uCover + 0.5;

    vec2 off = vec2(uShift, 0.0);
    vec3 col = vec3(
      texture2D(uMap, uv + off).r,
      texture2D(uMap, uv).g,
      texture2D(uMap, uv - off).b
    );

    float facing = gl_FrontFacing ? vFacing : -vFacing;
    float lit = mix(0.14, 1.0, smoothstep(-0.1, 0.8, facing));
    if (!gl_FrontFacing) {
      // Far side of the drum: faded and desaturated, so the front frames own the frame.
      float g = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(uFade, mix(vec3(g), col, 0.35), 0.42);
    }
    gl_FragColor = vec4(mix(uFade, col, lit), 1.0);
    #include <colorspace_fragment>
  }
`;

function Drum({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const textures = useTexture(FRAMES);
  const group = useRef<THREE.Group>(null);
  const speed = useRef(BASE_SPEED);
  const shift = useRef(0);

  const geometry = useMemo(() => new THREE.PlaneGeometry(W, H, 32, 1), []);
  const materials = useMemo(
    () =>
      textures.map((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        const img = texture.image as HTMLImageElement;
        const imageAspect = img.width / img.height;
        const planeAspect = W / H;
        const cover =
          imageAspect > planeAspect
            ? new THREE.Vector2(planeAspect / imageAspect, 1)
            : new THREE.Vector2(1, imageAspect / planeAspect);
        return new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: texture },
            uCover: { value: cover },
            uShift,
            uFade,
            uRadius: { value: RADIUS },
          },
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
        });
      }),
    [textures],
  );

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    const mobile = state.size.width < 768;

    // Scroll velocity pushes the spin; it eases back to a steady idle turn.
    heroState.velocity = damp(heroState.velocity, 0, 2.5, dt);
    const push = THREE.MathUtils.clamp(heroState.velocity / 1600, -1.6, 1.6);
    const target = reduced ? 0 : BASE_SPEED + push;
    speed.current = damp(speed.current, target, 3, dt);
    g.rotation.y += speed.current * dt;

    const px = reduced ? 0 : heroState.pointerX;
    const py = reduced ? 0 : heroState.pointerY;
    g.rotation.x = damp(g.rotation.x, 0.3 - py * 0.1, 3, dt);
    g.rotation.z = damp(g.rotation.z, -0.14 - px * 0.07, 3, dt);

    const p = heroState.progress;
    g.position.x = damp(g.position.x, (mobile ? 0 : 3.25) + px * 0.3, 3, dt);
    g.position.y = damp(g.position.y, (mobile ? 2.25 : 0.7) + p * 1.2, 4, dt);
    g.scale.setScalar(damp(g.scale.x, mobile ? 0.56 : 1, 4, dt));

    // Scrolling away flies the camera into the drum.
    state.camera.position.z = damp(state.camera.position.z, 12 - p * 5.5, 5, dt);

    shift.current = damp(shift.current, Math.min(Math.abs(speed.current - BASE_SPEED) * 0.012, 0.014), 6, dt);
    uShift.value = shift.current;
  });

  return (
    <group ref={group} rotation={[0.3, 0, -0.14]}>
      {materials.map((material, i) => {
        const a = (i / materials.length) * Math.PI * 2;
        return (
          <mesh
            key={i}
            geometry={geometry}
            material={material}
            position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]}
            rotation={[0, a, 0]}
          />
        );
      })}
    </group>
  );
}

export default function HeroScene({
  active,
  reduced,
  onReady,
}: {
  active: boolean;
  reduced: boolean;
  onReady: () => void;
}) {
  useEffect(() => {
    const sync = () => {
      const color = cssColor("--color-canvas");
      if (color) uFade.value.set(color);
    };
    sync();
    return subscribeTheme(sync);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Drum reduced={reduced} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
