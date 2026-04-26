'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float, MeshDistortMaterial, Sphere, Box, Torus, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Particle Field Component
function ParticleField() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 5000;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const radius = Math.random() * 25 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    const colors = useMemo(() => {
        const cols = new Float32Array(particlesCount * 3);
        const color1 = new THREE.Color('#6366f1');
        const color2 = new THREE.Color('#22d3ee');
        const color3 = new THREE.Color('#a855f7');

        for (let i = 0; i < particlesCount; i++) {
            const mixRatio = Math.random();
            const color = mixRatio < 0.33
                ? color1
                : mixRatio < 0.66
                    ? color2
                    : color3;
            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
        }
        return cols;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.03;
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;

            // Mouse parallax
            const mouseX = state.pointer.x * 0.3;
            const mouseY = state.pointer.y * 0.3;
            ref.current.rotation.x += mouseY * 0.02;
            ref.current.rotation.y += mouseX * 0.02;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                vertexColors
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Inner Particle Ring
function ParticleRing() {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 2000;

    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const angle = (i / particlesCount) * Math.PI * 2;
            const radius = 4 + Math.random() * 1.5;
            const y = (Math.random() - 0.5) * 0.5;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
        }
        return pos;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.2;
            ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#22d3ee"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// Morphing Sphere
function MorphingSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color="#6366f1"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    transparent
                    opacity={0.3}
                />
            </Sphere>
        </Float>
    );
}

// Floating Geometric Shapes
function FloatingShapes() {
    const torusRef = useRef<THREE.Mesh>(null);
    const boxRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (torusRef.current) {
            torusRef.current.rotation.x = t * 0.5;
            torusRef.current.rotation.y = t * 0.3;
            torusRef.current.position.y = Math.sin(t * 0.5) * 0.5 + 2;
        }
        if (boxRef.current) {
            boxRef.current.rotation.x = t * 0.4;
            boxRef.current.rotation.z = t * 0.6;
            boxRef.current.position.y = Math.sin(t * 0.7 + 1) * 0.5 - 2;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = Math.PI / 2;
            ringRef.current.rotation.z = t * 0.3;
        }
    });

    return (
        <>
            {/* Floating Torus */}
            <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
                <Torus ref={torusRef} args={[0.8, 0.2, 16, 100]} position={[-5, 2, -3]}>
                    <meshStandardMaterial
                        color="#a855f7"
                        transparent
                        opacity={0.6}
                        wireframe
                    />
                </Torus>
            </Float>

            {/* Floating Box */}
            <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                <Box ref={boxRef} args={[0.8, 0.8, 0.8]} position={[5, -2, -4]}>
                    <meshStandardMaterial
                        color="#22d3ee"
                        transparent
                        opacity={0.5}
                        wireframe
                    />
                </Box>
            </Float>

            {/* Central Ring */}
            <Ring ref={ringRef} args={[3, 3.2, 64]} position={[0, 0, -2]}>
                <meshBasicMaterial
                    color="#6366f1"
                    transparent
                    opacity={0.15}
                    side={THREE.DoubleSide}
                />
            </Ring>
        </>
    );
}

// Glowing Orbs
function GlowingOrbs() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    const orbs = [
        { position: [-4, 1, -2] as [number, number, number], color: '#6366f1', size: 0.4 },
        { position: [4, -1, -3] as [number, number, number], color: '#22d3ee', size: 0.5 },
        { position: [2, 3, -5] as [number, number, number], color: '#a855f7', size: 0.35 },
        { position: [-3, -2, -4] as [number, number, number], color: '#f97316', size: 0.3 },
        { position: [0, 4, -6] as [number, number, number], color: '#22d3ee', size: 0.45 },
    ];

    return (
        <group ref={group}>
            {orbs.map((orb, i) => (
                <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.5} floatIntensity={2}>
                    <Sphere args={[orb.size, 32, 32]} position={orb.position}>
                        <meshBasicMaterial color={orb.color} transparent opacity={0.6} />
                    </Sphere>
                    {/* Glow effect */}
                    <Sphere args={[orb.size * 1.5, 16, 16]} position={orb.position}>
                        <meshBasicMaterial
                            color={orb.color}
                            transparent
                            opacity={0.15}
                            blending={THREE.AdditiveBlending}
                        />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
}

// Light Beams
function LightBeams() {
    const beamsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (beamsRef.current) {
            beamsRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={beamsRef}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh key={i} rotation={[0, 0, (i / 6) * Math.PI * 2]} position={[0, 0, -10]}>
                    <planeGeometry args={[0.02, 30]} />
                    <meshBasicMaterial
                        color="#6366f1"
                        transparent
                        opacity={0.1}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Camera Rig for smooth movement
function CameraRig() {
    const { camera } = useThree();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        camera.position.x = Math.sin(t * 0.1) * 0.5;
        camera.position.y = Math.cos(t * 0.15) * 0.3;
        camera.lookAt(0, 0, 0);
    });

    return null;
}

export default function Scene3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#6366f1" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22d3ee" />

                <CameraRig />
                <ParticleField />
                <ParticleRing />
                <MorphingSphere />
                <FloatingShapes />
                <GlowingOrbs />
                <LightBeams />
            </Suspense>
        </Canvas>
    );
}
