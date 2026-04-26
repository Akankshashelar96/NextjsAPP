'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

function WaveParticles() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 3000;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 40;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            const positions = ref.current.geometry.attributes.position.array as Float32Array;
            const time = state.clock.getElapsedTime();

            for (let i = 0; i < particlesCount; i++) {
                const x = positions[i * 3];
                positions[i * 3 + 1] = Math.sin(x * 0.5 + time) * 0.5;
            }
            ref.current.geometry.attributes.position.needsUpdate = true;
            ref.current.rotation.y = time * 0.02;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#6366f1"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
}

function FloatingGrid() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -8]}>
            {Array.from({ length: 6 }).map((_, i) => (
                <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5}>
                    <Box
                        args={[0.5, 0.5, 0.5]}
                        position={[
                            (i % 3 - 1) * 3,
                            Math.floor(i / 3) * 3 - 1.5,
                            Math.random() * 2
                        ]}
                    >
                        <meshBasicMaterial
                            color={i % 2 === 0 ? '#6366f1' : '#22d3ee'}
                            transparent
                            opacity={0.3}
                            wireframe
                        />
                    </Box>
                </Float>
            ))}
        </group>
    );
}

export default function ServicesScene3D() {
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
            <WaveParticles />
            <FloatingGrid />
        </Canvas>
    );
}
