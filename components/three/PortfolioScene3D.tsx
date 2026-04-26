'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Icosahedron, Dodecahedron, Octahedron } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 1500;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const t = (i / particlesCount) * Math.PI * 6;
            const strand = i % 2;
            const radius = 2;
            const offset = strand * Math.PI;
            pos[i * 3] = Math.cos(t + offset) * radius;
            pos[i * 3 + 1] = (i / particlesCount - 0.5) * 15;
            pos[i * 3 + 2] = Math.sin(t + offset) * radius;
        }
        return pos;
    }, []);

    const colors = useMemo(() => {
        const cols = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const strand = i % 2;
            const color = strand === 0
                ? new THREE.Color('#6366f1')
                : new THREE.Color('#22d3ee');
            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
        }
        return cols;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.5;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.04}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function FloatingGeometry() {
    const icosaRef = useRef<THREE.Mesh>(null);
    const dodecaRef = useRef<THREE.Mesh>(null);
    const octaRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (icosaRef.current) {
            icosaRef.current.rotation.x = t * 0.3;
            icosaRef.current.rotation.y = t * 0.4;
        }
        if (dodecaRef.current) {
            dodecaRef.current.rotation.x = t * 0.4;
            dodecaRef.current.rotation.z = t * 0.3;
        }
        if (octaRef.current) {
            octaRef.current.rotation.y = t * 0.5;
            octaRef.current.rotation.z = t * 0.2;
        }
    });

    return (
        <>
            <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
                <Icosahedron ref={icosaRef} args={[0.8]} position={[-5, 2, -3]}>
                    <meshBasicMaterial color="#a855f7" transparent opacity={0.3} wireframe />
                </Icosahedron>
            </Float>
            <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                <Dodecahedron ref={dodecaRef} args={[0.7]} position={[5, -1, -4]}>
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} wireframe />
                </Dodecahedron>
            </Float>
            <Float speed={1.8} rotationIntensity={1.8} floatIntensity={1.8}>
                <Octahedron ref={octaRef} args={[0.6]} position={[0, -3, -2]}>
                    <meshBasicMaterial color="#6366f1" transparent opacity={0.3} wireframe />
                </Octahedron>
            </Float>
        </>
    );
}

export default function PortfolioScene3D() {
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
            <DNAHelix />
            <FloatingGeometry />
        </Canvas>
    );
}
