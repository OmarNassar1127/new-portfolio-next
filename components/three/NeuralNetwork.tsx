'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function NeuralNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Generate node positions in a neural-network-like structure
  const { positions, connections } = useMemo(() => {
    const layers = [4, 6, 8, 6, 4]; // neurons per layer
    const layerSpacing = 2.5;
    const pos: THREE.Vector3[] = [];

    layers.forEach((count, layerIdx) => {
      const x = (layerIdx - (layers.length - 1) / 2) * layerSpacing;
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * 1.4;
        const z = (Math.random() - 0.5) * 1.5;
        pos.push(new THREE.Vector3(x, y, z));
      }
    });

    // Generate connections between adjacent layers
    const conn: number[] = [];
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const currentCount = layers[l];
      const nextCount = layers[l + 1];
      const nextOffset = offset + currentCount;
      for (let i = 0; i < currentCount; i++) {
        // Connect each node to 2-3 random nodes in next layer
        const connectCount = Math.min(nextCount, 2 + Math.floor(Math.random() * 2));
        const targets = Array.from({ length: nextCount }, (_, k) => k)
          .sort(() => Math.random() - 0.5)
          .slice(0, connectCount);
        for (const t of targets) {
          conn.push(offset + i, nextOffset + t);
        }
      }
      offset += currentCount;
    }

    return { positions: pos, connections: conn };
  }, []);

  // Create geometry for nodes (instanced spheres)
  const nodePositions = useMemo(() => {
    const arr = new Float32Array(positions.length * 3);
    positions.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [positions]);

  // Create geometry for connections
  const linePositions = useMemo(() => {
    const arr = new Float32Array(connections.length * 3);
    connections.forEach((idx, i) => {
      const p = positions[idx];
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [connections, positions]);

  // Animate
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3;
    groupRef.current.rotation.x = Math.cos(t * 0.1) * 0.1;

    // Pulse line opacity
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={0.8}>
        {/* Connections */}
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#8873ef"
            transparent
            opacity={0.15}
            linewidth={1}
          />
        </lineSegments>

        {/* Nodes */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[nodePositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#00d4ff"
            size={0.12}
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>

        {/* Larger glow nodes at layer centers */}
        {positions
          .filter((_, i) => i % 3 === 0)
          .map((pos, i) => (
            <mesh key={i} position={[pos.x, pos.y, pos.z]}>
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshBasicMaterial
                color="#8873ef"
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
      </group>
    </Float>
  );
}

export default function NeuralNetwork() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <NeuralNodes />
      </Canvas>
    </div>
  );
}
