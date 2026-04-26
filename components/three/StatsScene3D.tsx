'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Sphere, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function SpiralParticles() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 2000;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const t = (i / particlesCount) * Math.PI * 8;
            const radius = 2 + t * 0.3;
            pos[i * 3] = Math.cos(t) * radius;
            pos[i * 3 + 1] = (i / particlesCount - 0.5) * 10;
            pos[i * 3 + 2] = Math.sin(t) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#22d3ee"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function FloatingNumbers() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {[0, 1, 2, 3].map((i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
                    <Sphere
                        args={[0.3, 16, 16]}
                        position={[
                            Math.cos((i / 4) * Math.PI * 2) * 4,
                            Math.sin(i) * 2,
                            Math.sin((i / 4) * Math.PI * 2) * 4
                        ]}
                    >
                        <meshBasicMaterial
                            color={['#6366f1', '#22d3ee', '#a855f7', '#f97316'][i]}
                            transparent
                            opacity={0.4}
                        />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
}

export default function StatsScene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 12], fov: 50 }}
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
            <SpiralParticles />
            <FloatingNumbers />
        </Canvas>
    );
}
