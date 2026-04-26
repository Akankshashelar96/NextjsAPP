'use client';

import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron, Dodecahedron, Octahedron, Box } from '@react-three/drei';
import * as THREE from 'three';

// Shared explosion state for chain reactions
const explosionEvents = { current: [] as { x: number; y: number; z: number; time: number }[] };

// Exploding obstacle with chain reaction physics
function ExplodingObstacle({
    position,
    color,
    size,
    mouseRef,
    scrollRef,
    shapeType = 'icosahedron',
    id
}: {
    position: [number, number, number];
    color: string;
    size: number;
    mouseRef: React.MutableRefObject<{ x: number; y: number }>;
    scrollRef: React.MutableRefObject<number>;
    shapeType?: 'icosahedron' | 'octahedron' | 'dodecahedron' | 'box';
    id: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const [exploded, setExploded] = useState(false);
    const [respawnTimer, setRespawnTimer] = useState(0);
    const [pushVelocity, setPushVelocity] = useState({ x: 0, y: 0 });
    const currentPos = useRef({ x: position[0], y: position[1] });
    const { viewport, camera } = useThree();

    const particleCount = 50;
    const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);
    const particleVelocities = useMemo(() => {
        const vel = [];
        for (let i = 0; i < particleCount; i++) {
            vel.push({
                x: (Math.random() - 0.5) * 0.8,
                y: (Math.random() - 0.5) * 0.8,
                z: (Math.random() - 0.5) * 0.8,
            });
        }
        return vel;
    }, []);

    useFrame((state) => {
        const cursorX = (mouseRef.current.x * viewport.width) / 2;
        const cursorY = (mouseRef.current.y * viewport.height) / 2 + camera.position.y;
        const time = state.clock.getElapsedTime();

        // Check for chain reaction from other explosions
        explosionEvents.current.forEach((evt) => {
            if (time - evt.time < 0.5 && !exploded) {
                const dx = currentPos.current.x - evt.x;
                const dy = currentPos.current.y - evt.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 8 && dist > 0.1) {
                    // Push away from explosion
                    const force = (8 - dist) / 8;
                    setPushVelocity({
                        x: (dx / dist) * force * 0.5,
                        y: (dy / dist) * force * 0.5,
                    });
                }
            }
        });

        if (!exploded && meshRef.current) {
            // Apply push velocity
            currentPos.current.x += pushVelocity.x;
            currentPos.current.y += pushVelocity.y;
            setPushVelocity({ x: pushVelocity.x * 0.92, y: pushVelocity.y * 0.92 });

            // Return to original position slowly
            currentPos.current.x += (position[0] - currentPos.current.x) * 0.01;
            currentPos.current.y += (position[1] - currentPos.current.y) * 0.01;

            meshRef.current.position.x = currentPos.current.x;
            meshRef.current.position.y = currentPos.current.y + Math.sin(time * 2 + position[0]) * 0.4;

            // Check cursor distance
            const dx = meshRef.current.position.x - cursorX;
            const dy = meshRef.current.position.y - cursorY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < size * 3) {
                setExploded(true);
                setRespawnTimer(time);

                // Register explosion for chain reaction
                explosionEvents.current.push({
                    x: meshRef.current.position.x,
                    y: meshRef.current.position.y,
                    z: meshRef.current.position.z,
                    time: time,
                });

                // Cleanup old events
                explosionEvents.current = explosionEvents.current.filter(e => time - e.time < 2);

                // Initialize particles
                for (let i = 0; i < particleCount; i++) {
                    particlePositions[i * 3] = meshRef.current.position.x;
                    particlePositions[i * 3 + 1] = meshRef.current.position.y;
                    particlePositions[i * 3 + 2] = meshRef.current.position.z;
                    particleVelocities[i].x = (Math.random() - 0.5) * 0.8;
                    particleVelocities[i].y = (Math.random() - 0.5) * 0.8;
                    particleVelocities[i].z = (Math.random() - 0.5) * 0.8;
                }
            } else {
                meshRef.current.rotation.x += 0.015;
                meshRef.current.rotation.y += 0.02;
            }
        }

        // Animate explosion particles
        if (exploded && particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += particleVelocities[i].x;
                positions[i * 3 + 1] += particleVelocities[i].y;
                positions[i * 3 + 2] += particleVelocities[i].z;

                particleVelocities[i].x *= 0.94;
                particleVelocities[i].y *= 0.94;
                particleVelocities[i].z *= 0.94;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            if (time - respawnTimer > 2) {
                setExploded(false);
                currentPos.current = { x: position[0], y: position[1] };
            }
        }
    });

    const renderShape = () => {
        switch (shapeType) {
            case 'octahedron':
                return <octahedronGeometry args={[size, 0]} />;
            case 'dodecahedron':
                return <dodecahedronGeometry args={[size, 0]} />;
            case 'box':
                return <boxGeometry args={[size, size, size]} />;
            default:
                return <icosahedronGeometry args={[size, 0]} />;
        }
    };

    return (
        <>
            {!exploded && (
                <mesh ref={meshRef} position={[position[0], position[1], position[2]]}>
                    {renderShape()}
                    <meshStandardMaterial color={color} transparent opacity={0.85} wireframe />
                </mesh>
            )}

            {exploded && (
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={particleCount}
                            array={particlePositions}
                            itemSize={3}
                            args={[particlePositions, 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial color={color} size={0.25} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
                </points>
            )}
        </>
    );
}

// Cursor glow - scroll-aware
function CursorGlow({ mouseRef, scrollRef }: {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>;
    scrollRef: React.MutableRefObject<number>;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const ring1Ref = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);
    const ring3Ref = useRef<THREE.Mesh>(null);
    const { viewport, camera } = useThree();

    useFrame((state) => {
        if (groupRef.current) {
            const targetX = (mouseRef.current.x * viewport.width) / 2;
            const targetY = (mouseRef.current.y * viewport.height) / 2 + camera.position.y;

            groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.5;
            groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.5;
            groupRef.current.position.z = 12;

            if (ring1Ref.current) ring1Ref.current.rotation.z = state.clock.getElapsedTime() * 1.5;
            if (ring2Ref.current) ring2Ref.current.rotation.z = -state.clock.getElapsedTime() * 1;
            if (ring3Ref.current) ring3Ref.current.rotation.z = state.clock.getElapsedTime() * 0.7;

            const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.15;
            groupRef.current.scale.setScalar(pulse);
        }
    });

    return (
        <group ref={groupRef}>
            <Sphere args={[0.2, 32, 32]}>
                <meshBasicMaterial color="#ffffff" transparent opacity={1} />
            </Sphere>
            <Sphere args={[0.35, 24, 24]}>
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
            </Sphere>
            <Sphere args={[0.6, 16, 16]}>
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </Sphere>
            <mesh ref={ring1Ref}>
                <torusGeometry args={[0.8, 0.03, 8, 32]} />
                <meshBasicMaterial color="#6366f1" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[1, 0.02, 8, 32]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh ref={ring3Ref} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                <torusGeometry args={[1.2, 0.015, 8, 32]} />
                <meshBasicMaterial color="#a855f7" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

// Particles - FULL WIDTH coverage
function BackgroundParticles({ mouseRef, scrollRef }: {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>;
    scrollRef: React.MutableRefObject<number>;
}) {
    const ref = useRef<THREE.Points>(null);
    const particlesCount = 15000;
    const { viewport, camera } = useThree();

    const [positions, velocities, originalPositions, colors] = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        const vel = new Float32Array(particlesCount * 3);
        const orig = new Float32Array(particlesCount * 3);
        const cols = new Float32Array(particlesCount * 3);

        const palette = [
            new THREE.Color('#6366f1'),
            new THREE.Color('#22d3ee'),
            new THREE.Color('#a855f7'),
            new THREE.Color('#f97316'),
            new THREE.Color('#ec4899'),
        ];

        for (let i = 0; i < particlesCount; i++) {
            // FULL WIDTH - extends far on both sides
            const x = (Math.random() - 0.5) * 250;
            const y = (Math.random() - 0.5) * 500;
            const z = (Math.random() - 0.5) * 80 - 30;
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
            orig[i * 3] = x;
            orig[i * 3 + 1] = y;
            orig[i * 3 + 2] = z;

            const color = palette[Math.floor(Math.random() * palette.length)];
            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
        }
        return [pos, vel, orig, cols];
    }, []);

    useFrame((state) => {
        if (ref.current) {
            const positions = ref.current.geometry.attributes.position.array as Float32Array;
            const time = state.clock.getElapsedTime();

            const cursorX = (mouseRef.current.x * viewport.width) / 2;
            const cursorY = (mouseRef.current.y * viewport.height) / 2 + camera.position.y;

            for (let i = 0; i < particlesCount; i++) {
                const ix = i * 3;
                const iy = i * 3 + 1;

                positions[iy] = originalPositions[iy] + Math.sin(time * 0.3 + originalPositions[ix] * 0.02) * 1.5;

                const dx = positions[ix] - cursorX;
                const dy = positions[iy] - cursorY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 15) {
                    const force = (15 - dist) / 15;
                    velocities[ix] += (dx / dist) * force * 0.15;
                    velocities[iy] += (dy / dist) * force * 0.15;
                }

                positions[ix] += velocities[ix];
                positions[iy] += velocities[iy];
                positions[ix] += (originalPositions[ix] - positions[ix]) * 0.015;
                positions[iy] += (originalPositions[iy] - positions[iy]) * 0.015;

                velocities[ix] *= 0.92;
                velocities[iy] *= 0.92;
            }

            ref.current.geometry.attributes.position.needsUpdate = true;
            ref.current.rotation.y = time * 0.005;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" count={particlesCount} array={colors} itemSize={3} args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.08} vertexColors transparent opacity={0.85} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

// Floating shapes
function FloatingShapes() {
    const groupRef = useRef<THREE.Group>(null);

    const shapes = useMemo(() => [
        { type: 'torus', pos: [-35, 20, -20], color: '#6366f1', size: 2 },
        { type: 'icosahedron', pos: [40, 5, -25], color: '#22d3ee', size: 1.5 },
        { type: 'octahedron', pos: [-30, -30, -18], color: '#a855f7', size: 1.8 },
        { type: 'dodecahedron', pos: [35, -50, -22], color: '#f97316', size: 1.3 },
        { type: 'torus', pos: [-38, -70, -20], color: '#ec4899', size: 1.6 },
        { type: 'box', pos: [32, -90, -18], color: '#6366f1', size: 1.4 },
        { type: 'icosahedron', pos: [-28, -110, -22], color: '#22d3ee', size: 1.5 },
        { type: 'octahedron', pos: [38, -130, -20], color: '#a855f7', size: 1.2 },
        { type: 'torus', pos: [-32, -150, -18], color: '#f97316', size: 1.8 },
        { type: 'dodecahedron', pos: [30, -170, -22], color: '#ec4899', size: 1.4 },
    ], []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const mesh = child.children[0] as THREE.Mesh;
                if (mesh) {
                    mesh.rotation.x = state.clock.getElapsedTime() * (0.2 + i * 0.05);
                    mesh.rotation.y = state.clock.getElapsedTime() * (0.3 + i * 0.03);
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {shapes.map((shape, i) => (
                <Float key={i} speed={1.5 + i * 0.1} rotationIntensity={1.5} floatIntensity={2}>
                    {shape.type === 'torus' && (
                        <Torus args={[shape.size, shape.size * 0.35, 16, 48]} position={shape.pos as [number, number, number]}>
                            <meshStandardMaterial color={shape.color} transparent opacity={0.5} wireframe />
                        </Torus>
                    )}
                    {shape.type === 'icosahedron' && (
                        <Icosahedron args={[shape.size]} position={shape.pos as [number, number, number]}>
                            <meshStandardMaterial color={shape.color} transparent opacity={0.5} wireframe />
                        </Icosahedron>
                    )}
                    {shape.type === 'octahedron' && (
                        <Octahedron args={[shape.size]} position={shape.pos as [number, number, number]}>
                            <meshStandardMaterial color={shape.color} transparent opacity={0.5} wireframe />
                        </Octahedron>
                    )}
                    {shape.type === 'dodecahedron' && (
                        <Dodecahedron args={[shape.size]} position={shape.pos as [number, number, number]}>
                            <meshStandardMaterial color={shape.color} transparent opacity={0.5} wireframe />
                        </Dodecahedron>
                    )}
                    {shape.type === 'box' && (
                        <Box args={[shape.size, shape.size, shape.size]} position={shape.pos as [number, number, number]}>
                            <meshStandardMaterial color={shape.color} transparent opacity={0.5} wireframe />
                        </Box>
                    )}
                </Float>
            ))}
        </group>
    );
}

// Morphing spheres - wider
function MorphingSpheres() {
    return (
        <>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[2.5, 64, 64]} position={[-30, 15, -15]}>
                    <MeshDistortMaterial color="#6366f1" distort={0.5} speed={3} transparent opacity={0.35} />
                </Sphere>
            </Float>
            <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
                <Sphere args={[2, 64, 64]} position={[32, -40, -18]}>
                    <MeshDistortMaterial color="#22d3ee" distort={0.4} speed={3.5} transparent opacity={0.3} />
                </Sphere>
            </Float>
            <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[2.2, 64, 64]} position={[-28, -80, -12]}>
                    <MeshDistortMaterial color="#a855f7" distort={0.45} speed={3} transparent opacity={0.3} />
                </Sphere>
            </Float>
            <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.1}>
                <Sphere args={[1.8, 64, 64]} position={[30, -120, -16]}>
                    <MeshDistortMaterial color="#f97316" distort={0.5} speed={2.5} transparent opacity={0.3} />
                </Sphere>
            </Float>
            <Float speed={1.7} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[2, 64, 64]} position={[-32, -160, -14]}>
                    <MeshDistortMaterial color="#ec4899" distort={0.45} speed={3} transparent opacity={0.3} />
                </Sphere>
            </Float>
        </>
    );
}

// Pulsing rings
function PulsingRings() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            const t = state.clock.getElapsedTime();
            groupRef.current.rotation.z = t * 0.05;
            groupRef.current.children.forEach((child, i) => {
                const scale = 1 + Math.sin(t * 2 + i * 0.5) * 0.1;
                child.scale.setScalar(scale);
            });
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -35]}>
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[6 + i * 2.5, 0.04, 8, 64]} />
                    <meshBasicMaterial
                        color={['#6366f1', '#22d3ee', '#a855f7', '#f97316', '#ec4899'][i]}
                        transparent
                        opacity={0.25}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Scroll camera
function ScrollCamera({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
    const { camera } = useThree();

    useFrame(() => {
        const targetY = -scrollRef.current * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.08;
        camera.lookAt(0, camera.position.y, 0);
    });

    return null;
}

// Main scene
function Scene({ mouseRef, scrollRef }: {
    mouseRef: React.MutableRefObject<{ x: number; y: number }>;
    scrollRef: React.MutableRefObject<number>;
}) {
    const { viewport } = useThree();

    // Scale factor based on viewport width - smaller viewport = closer obstacles
    const scaleFactor = Math.min(viewport.width / 20, 1);

    // Many obstacles with chain reaction physics - positions scaled for viewport
    const obstacles = useMemo(() => {
        const baseObstacles = [
            // Hero section - spread across entire width
            { pos: [22, 12, 7], color: '#6366f1', size: 1, shape: 'icosahedron' as const },
            { pos: [-24, 8, 6], color: '#22d3ee', size: 0.8, shape: 'octahedron' as const },
            { pos: [18, -3, 8], color: '#a855f7', size: 0.9, shape: 'dodecahedron' as const },
            { pos: [-20, 16, 7], color: '#f97316', size: 0.7, shape: 'box' as const },
            { pos: [26, 4, 6], color: '#ec4899', size: 0.85, shape: 'icosahedron' as const },
            { pos: [-26, 2, 7], color: '#6366f1', size: 0.75, shape: 'octahedron' as const },
            { pos: [10, 18, 5], color: '#22d3ee', size: 0.65, shape: 'box' as const },
            { pos: [-8, 10, 9], color: '#a855f7', size: 0.7, shape: 'icosahedron' as const },
            { pos: [28, 14, 6], color: '#f97316', size: 0.6, shape: 'octahedron' as const },
            { pos: [-28, 12, 8], color: '#ec4899', size: 0.8, shape: 'dodecahedron' as const },
            { pos: [5, 6, 7], color: '#6366f1', size: 0.5, shape: 'icosahedron' as const },
            { pos: [-5, 14, 6], color: '#22d3ee', size: 0.55, shape: 'octahedron' as const },
            // Services - spread wide
            { pos: [-24, -10, 7], color: '#6366f1', size: 0.9, shape: 'octahedron' as const },
            { pos: [24, -16, 6], color: '#22d3ee', size: 0.75, shape: 'icosahedron' as const },
            { pos: [-18, -22, 8], color: '#a855f7', size: 1, shape: 'dodecahedron' as const },
            { pos: [26, -28, 7], color: '#f97316', size: 0.8, shape: 'box' as const },
            { pos: [12, -12, 5], color: '#ec4899', size: 0.6, shape: 'octahedron' as const },
            { pos: [-10, -18, 9], color: '#6366f1', size: 0.7, shape: 'icosahedron' as const },
            { pos: [28, -24, 6], color: '#22d3ee', size: 0.65, shape: 'box' as const },
            { pos: [-28, -14, 8], color: '#a855f7', size: 0.75, shape: 'dodecahedron' as const },
            { pos: [6, -20, 7], color: '#f97316', size: 0.5, shape: 'icosahedron' as const },
            { pos: [-6, -26, 6], color: '#ec4899', size: 0.55, shape: 'octahedron' as const },
            // Portfolio - spread wide
            { pos: [-24, -36, 6], color: '#ec4899', size: 0.85, shape: 'icosahedron' as const },
            { pos: [22, -42, 7], color: '#6366f1', size: 0.9, shape: 'octahedron' as const },
            { pos: [-20, -48, 8], color: '#22d3ee', size: 0.75, shape: 'dodecahedron' as const },
            { pos: [25, -54, 6], color: '#a855f7', size: 0.95, shape: 'icosahedron' as const },
            { pos: [8, -38, 9], color: '#f97316', size: 0.6, shape: 'box' as const },
            { pos: [-12, -44, 5], color: '#ec4899', size: 0.7, shape: 'octahedron' as const },
            { pos: [28, -50, 7], color: '#6366f1', size: 0.65, shape: 'icosahedron' as const },
            { pos: [-26, -40, 8], color: '#22d3ee', size: 0.8, shape: 'dodecahedron' as const },
            { pos: [5, -46, 6], color: '#a855f7', size: 0.5, shape: 'box' as const },
            { pos: [-5, -52, 7], color: '#f97316', size: 0.55, shape: 'octahedron' as const },
            // Statistics - spread wide
            { pos: [-23, -62, 7], color: '#f97316', size: 0.8, shape: 'box' as const },
            { pos: [24, -68, 8], color: '#ec4899', size: 0.9, shape: 'octahedron' as const },
            { pos: [-21, -74, 6], color: '#6366f1', size: 0.85, shape: 'icosahedron' as const },
            { pos: [12, -64, 5], color: '#22d3ee', size: 0.6, shape: 'dodecahedron' as const },
            { pos: [-10, -70, 9], color: '#a855f7', size: 0.7, shape: 'box' as const },
            { pos: [26, -76, 7], color: '#f97316', size: 0.65, shape: 'octahedron' as const },
            { pos: [6, -66, 8], color: '#6366f1', size: 0.5, shape: 'icosahedron' as const },
            { pos: [-6, -72, 6], color: '#ec4899', size: 0.55, shape: 'dodecahedron' as const },
            // About - spread wide
            { pos: [23, -82, 7], color: '#22d3ee', size: 0.95, shape: 'dodecahedron' as const },
            { pos: [-25, -88, 8], color: '#a855f7', size: 0.8, shape: 'box' as const },
            { pos: [21, -94, 6], color: '#f97316', size: 0.9, shape: 'icosahedron' as const },
            { pos: [-22, -100, 7], color: '#ec4899', size: 0.75, shape: 'octahedron' as const },
            { pos: [10, -84, 9], color: '#6366f1', size: 0.6, shape: 'icosahedron' as const },
            { pos: [-12, -92, 5], color: '#22d3ee', size: 0.7, shape: 'dodecahedron' as const },
            { pos: [28, -98, 8], color: '#a855f7', size: 0.65, shape: 'box' as const },
            { pos: [-26, -96, 6], color: '#f97316', size: 0.75, shape: 'octahedron' as const },
            { pos: [5, -90, 7], color: '#ec4899', size: 0.5, shape: 'icosahedron' as const },
            { pos: [-5, -86, 8], color: '#6366f1', size: 0.55, shape: 'dodecahedron' as const },
            // Contact - spread wide
            { pos: [24, -108, 8], color: '#6366f1', size: 0.85, shape: 'dodecahedron' as const },
            { pos: [-26, -114, 6], color: '#22d3ee', size: 1, shape: 'icosahedron' as const },
            { pos: [22, -120, 7], color: '#a855f7', size: 0.8, shape: 'box' as const },
            { pos: [-23, -126, 8], color: '#f97316', size: 0.9, shape: 'octahedron' as const },
            { pos: [25, -132, 6], color: '#ec4899', size: 0.95, shape: 'icosahedron' as const },
            { pos: [10, -110, 9], color: '#6366f1', size: 0.6, shape: 'octahedron' as const },
            { pos: [-12, -118, 5], color: '#22d3ee', size: 0.7, shape: 'dodecahedron' as const },
            { pos: [28, -124, 7], color: '#a855f7', size: 0.65, shape: 'icosahedron' as const },
            { pos: [-28, -130, 8], color: '#f97316', size: 0.75, shape: 'box' as const },
            { pos: [15, -138, 6], color: '#ec4899', size: 0.8, shape: 'octahedron' as const },
            { pos: [6, -116, 7], color: '#6366f1', size: 0.5, shape: 'box' as const },
            { pos: [-6, -122, 8], color: '#22d3ee', size: 0.55, shape: 'icosahedron' as const },
        ];

        // Scale X positions based on viewport
        return baseObstacles.map(obs => ({
            ...obs,
            pos: [obs.pos[0] * scaleFactor, obs.pos[1], obs.pos[2]] as [number, number, number]
        }));
    }, [scaleFactor]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[30, 15, 15]} intensity={0.6} color="#6366f1" />
            <pointLight position={[-30, -25, 10]} intensity={0.5} color="#22d3ee" />
            <pointLight position={[25, -60, 15]} intensity={0.4} color="#a855f7" />
            <pointLight position={[-25, -100, 15]} intensity={0.4} color="#f97316" />
            <pointLight position={[0, -140, 15]} intensity={0.4} color="#ec4899" />

            <ScrollCamera scrollRef={scrollRef} />
            <CursorGlow mouseRef={mouseRef} scrollRef={scrollRef} />
            <BackgroundParticles mouseRef={mouseRef} scrollRef={scrollRef} />

            {obstacles.map((obs, i) => (
                <ExplodingObstacle
                    key={i}
                    id={i}
                    position={obs.pos}
                    color={obs.color}
                    size={obs.size}
                    mouseRef={mouseRef}
                    scrollRef={scrollRef}
                    shapeType={obs.shape}
                />
            ))}

            <FloatingShapes />
            <MorphingSpheres />
            <PulsingRings />
        </>
    );
}

export default function GlobalScene3D() {
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1,
        };
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mouseRef.current = {
                x: (touch.clientX / window.innerWidth) * 2 - 1,
                y: -(touch.clientY / window.innerHeight) * 2 + 1,
            };
        }
    }, []);

    const handleScroll = useCallback(() => {
        scrollRef.current = window.scrollY;
    }, []);

    // Smooth interpolation for touch
    const targetRef = useRef({ x: 0, y: 0 });
    const animFrameRef = useRef<number | null>(null);

    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    const updateMousePosition = useCallback(() => {
        mouseRef.current.x = lerp(mouseRef.current.x, targetRef.current.x, 0.15);
        mouseRef.current.y = lerp(mouseRef.current.y, targetRef.current.y, 0.15);
        animFrameRef.current = requestAnimationFrame(updateMousePosition);
    }, []);

    useEffect(() => {
        const handleMouseMoveInternal = (e: MouseEvent) => {
            targetRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };

        const handleTouchMoveInternal = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                targetRef.current = {
                    x: (touch.clientX / window.innerWidth) * 2 - 1,
                    y: -(touch.clientY / window.innerHeight) * 2 + 1,
                };
            }
        };

        window.addEventListener('mousemove', handleMouseMoveInternal);
        window.addEventListener('touchmove', handleTouchMoveInternal, { passive: true });
        window.addEventListener('touchstart', handleTouchMoveInternal, { passive: true });
        window.addEventListener('scroll', handleScroll);

        // Start animation loop
        animFrameRef.current = requestAnimationFrame(updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveInternal);
            window.removeEventListener('touchmove', handleTouchMoveInternal);
            window.removeEventListener('touchstart', handleTouchMoveInternal);
            window.removeEventListener('scroll', handleScroll);
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, [handleScroll, updateMousePosition]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, #0a0a18 0%, #050510 50%, #020208 100%)',
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 40], fov: 70 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 2]}
            >
                <Scene mouseRef={mouseRef} scrollRef={scrollRef} />
            </Canvas>
        </div>
    );
}
