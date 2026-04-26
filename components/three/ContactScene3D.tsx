'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, Ring, Torus } from '@react-three/drei';
import * as THREE from 'three';

function OrbitingParticles() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 1000;

    const [positions, initialPositions] = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        const initial = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const angle = (i / particlesCount) * Math.PI * 2 * 3;
            const radius = 3 + Math.sin(angle * 5) * 0.5;
            const x = Math.cos(angle) * radius;
            const y = (Math.random() - 0.5) * 2;
            const z = Math.sin(angle) * radius;
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            initial[i * 3] = x;
            initial[i * 3 + 1] = y;
            initial[i * 3 + 2] = z;
        }
        return [pos, initial];
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#a855f7"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function ConnectionLines() {
    const linesRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    const lines = useMemo(() => {
        const result = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            result.push({
                start: [0, 0, 0] as [number, number, number],
                end: [Math.cos(angle) * 4, Math.sin(angle * 2) * 2, Math.sin(angle) * 4] as [number, number, number],
            });
        }
        return result;
    }, []);

    return (
        <group ref={linesRef}>
            {lines.map((line, i) => (
                <Float key={i} speed={1 + i * 0.1} floatIntensity={0.5}>
                    <Sphere args={[0.15, 16, 16]} position={line.end}>
                        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
}

export default function ContactScene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <OrbitingParticles />
            <ConnectionLines />
        </Canvas>
    );
}
