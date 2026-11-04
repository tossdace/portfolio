"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Blossom Cloud ── */
function BlossomCloud({ count = 520 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const items = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const a = seeded(i + 4) * Math.PI * 2;
      const r = Math.sqrt(seeded(i + 40)) * 1.95;
      const y = 2.25 + (seeded(i + 90) - 0.5) * 1.05;
      return {
        position: [Math.cos(a) * r, y, Math.sin(a) * r] as Vec3,
        scale: 0.025 + seeded(i + 140) * 0.045,
        rotation: seeded(i + 190) * Math.PI,
      };
    });
  }, [count]);

  useEffect(() => {
    if (!mesh.current) return;
    items.forEach((item, i) => {
      dummy.position.set(...item.position);
      dummy.rotation.set(item.rotation, item.rotation * 0.7, item.rotation * 0.4);
      dummy.scale.setScalar(item.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      mesh.current!.setColorAt(
        i,
        new THREE.Color().setHSL(0.91 + seeded(i) * 0.045, 0.58, 0.64 + seeded(i + 8) * 0.2)
      );
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [dummy, items]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} castShadow>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={0.78} />
    </instancedMesh>
  );
}

/* ── Tree Branch ── */
function TreeBranch({ start, end, radius }: { start: Vec3; end: Vec3; radius: number }) {
  const direction = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const midpoint = new THREE.Vector3(...start).add(new THREE.Vector3(...end)).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );
  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius * 0.72, radius, direction.length(), 7]} />
      <meshStandardMaterial color="#59413e" roughness={0.92} />
    </mesh>
  );
}

/* ── Blossom Tree ── */
function BlossomTree() {
  const branches = useMemo(() => {
    const result: { start: Vec3; end: Vec3; radius: number }[] = [];
    const trunk: Vec3[] = [
      [0, 0.3, 0],
      [0.05, 1.05, 0],
      [-0.08, 1.8, 0.02],
      [0.12, 2.45, 0.04],
    ];
    for (let i = 0; i < trunk.length - 1; i++)
      result.push({ start: trunk[i], end: trunk[i + 1], radius: 0.12 - i * 0.018 });

    const limbs = [
      [[-0.05, 1.25, 0], [-0.72, 1.85, 0.12], [-1.25, 2.25, 0.18]],
      [[-0.05, 1.55, 0], [0.68, 2.08, 0.1], [1.15, 2.4, 0.18]],
      [[0, 1.95, 0], [-0.5, 2.55, -0.15], [-0.8, 2.95, -0.22]],
      [[0.02, 2.1, 0], [0.55, 2.7, -0.18], [0.85, 3.05, -0.22]],
      [[0, 1.1, 0], [0.25, 1.65, 0.65], [0.35, 2.15, 0.9]],
      [[-0.05, 1.45, 0], [-0.65, 2.0, -0.62], [-0.9, 2.45, -0.8]],
    ];
    limbs.forEach((limb) => {
      result.push({ start: limb[0] as Vec3, end: limb[1] as Vec3, radius: 0.075 });
      result.push({ start: limb[1] as Vec3, end: limb[2] as Vec3, radius: 0.045 });
    });
    return result;
  }, []);

  return (
    <group>
      {branches.map((branch, i) => (
        <TreeBranch key={i} {...branch} />
      ))}
      <BlossomCloud />
    </group>
  );
}

/* ── Floating Island ── */
function Island() {
  const petals = useMemo(
    () =>
      Array.from({ length: 1050 }, (_, i) => {
        const a = seeded(i + 800) * Math.PI * 2;
        const r = Math.sqrt(seeded(i + 900)) * 3.5;
        return {
          position: [Math.cos(a) * r, 0.27 + seeded(i + 1000) * 0.06, Math.sin(a) * r] as Vec3,
          scale: 0.018 + seeded(i + 1100) * 0.035,
        };
      }),
    []
  );

  const petalRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!petalRef.current) return;
    petals.forEach((p, i) => {
      dummy.position.set(...p.position);
      dummy.rotation.set(0, seeded(i + 1200) * Math.PI, seeded(i + 1300) * 0.25);
      dummy.scale.set(p.scale * 1.7, p.scale * 0.3, p.scale);
      dummy.updateMatrix();
      petalRef.current!.setMatrixAt(i, dummy.matrix);
      petalRef.current!.setColorAt(
        i,
        new THREE.Color(i % 3 === 0 ? "#f9a8d4" : i % 3 === 1 ? "#d94691" : "#fbcfe8")
      );
    });
    petalRef.current.instanceMatrix.needsUpdate = true;
    if (petalRef.current.instanceColor) petalRef.current.instanceColor.needsUpdate = true;
  }, [dummy, petals]);

  return (
    <group>
      {/* Rock base */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <cylinderGeometry args={[3.85, 3.15, 0.62, 64, 1]} />
        <meshStandardMaterial color="#39313a" roughness={0.92} />
      </mesh>
      {/* Soil cap */}
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.78, 3.78, 0.12, 64]} />
        <meshStandardMaterial color="#47343e" roughness={1} />
      </mesh>
      {/* Ground petals */}
      <instancedMesh ref={petalRef} args={[undefined, undefined, petals.length]} receiveShadow>
        <circleGeometry args={[1, 5]} />
        <meshStandardMaterial roughness={0.95} side={THREE.DoubleSide} />
      </instancedMesh>
      {/* Blossom tree */}
      <BlossomTree />
      {/* Scattered rocks */}
      {Array.from({ length: 22 }, (_, i) => {
        const a = seeded(i + 1600) * Math.PI * 2;
        const r = 2.6 + seeded(i + 1700) * 0.9;
        const h = 0.15 + seeded(i + 1800) * 0.48;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * r, 0.23 + h / 2, Math.sin(a) * r]}
            rotation={[0, seeded(i + 1900), 0]}
            castShadow
          >
            <dodecahedronGeometry args={[0.16 + seeded(i + 2000) * 0.22, 0]} />
            <meshStandardMaterial color={i % 2 ? "#75616b" : "#95808a"} roughness={0.95} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Water ── */
function Water() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const material = ref.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.62 + Math.sin(clock.elapsedTime * 0.55) * 0.035;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]} receiveShadow>
      <circleGeometry args={[200, 96]} />
      <meshStandardMaterial color="#b58eaa" metalness={0.38} roughness={0.2} transparent opacity={0.64} />
    </mesh>
  );
}

/* ── Fireflies ── */
function Fireflies() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      values[i * 3] = (seeded(i + 2100) - 0.5) * 25;
      values[i * 3 + 1] = seeded(i + 2200) * 9 - 1;
      values[i * 3 + 2] = (seeded(i + 2300) - 0.5) * 20;
    }
    return values;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.012;
      ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.12;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f5c4ed"
        size={0.055}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Scene Motion (mouse-driven parallax) ── */
function SceneMotion({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      pointer.current.x * 0.13 + Math.sin(clock.elapsedTime * 0.12) * 0.035,
      3,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      -pointer.current.y * 0.055,
      3,
      delta
    );
    group.current.position.y = Math.sin(clock.elapsedTime * 0.45) * 0.08;
  });
  return (
    <group ref={group}>
      <Island />
    </group>
  );
}

/* ── Exported Scene ── */
export default function HeroScene({
  pointer,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <div className="dhyan-scene" aria-hidden="true">
      <Canvas dpr={[1, 1.6]} shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 5.3, 11.8]} fov={38} />

        <ambientLight intensity={1.2} />
        <directionalLight
          position={[-4, 9, 5]}
          intensity={3.2}
          color="#ffe5f4"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[5, 3, -4]} intensity={30} color="#c66bba" distance={20} />
        <pointLight position={[-5, 1, 4]} intensity={18} color="#8b6be8" distance={18} />

        <SceneMotion pointer={pointer} />
        <Water />
        <Fireflies />
      </Canvas>
    </div>
  );
}
