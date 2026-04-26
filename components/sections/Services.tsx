'use client';

import { useRef, useState } from 'react';
import {
    Sparkles,
    MonitorPlay,
    Box,
    Palette,
    Clapperboard,
    Eye,
    ArrowRight,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import styles from './Services.module.css';

const services = [
    {
        icon: Sparkles,
        title: 'VFX',
        subtitle: 'Visual Effects',
        description: 'Creating in-camera visual effects for virtual production is even more challenging than for the physical or digital one. Open Slate is good at making both. We can deal with fluids, particles, and explosions. Then we can make them all look photo-real on the video walls so that you get finished pixels and can proceed to edit your video right after the shooting day, reducing post-production costs.',
        features: ['Fluids & Particles', 'Explosions', 'Photo-real VFX', 'Post-fix Available'],
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
        icon: MonitorPlay,
        title: 'Virtual Production',
        subtitle: 'LED Volume',
        description: 'The new era of visual effects is already in place. What used to be filmed in front of the green screens is now filmed in the LED volumes, designed to display visual effects in real-time. We are the ones who create real-time rendered content for the video walls and help you build a custom LED set of any shape and size.',
        features: ['LED Volumes', 'Real-time VFX', 'Custom LED Sets', 'In-camera Effects'],
        gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
    },
    {
        icon: Box,
        title: '3D Assets Creation',
        subtitle: 'Game Engine Ready',
        description: 'We create highly detailed 3D assets adopted for virtual production technology. We export them to a game engine in the best possible quality to reach maximum performance out of the real-time VFX. We know how to get Houdini-made simulations and Unreal Engine environments married and look like a perfect match.',
        features: ['Houdini Simulations', 'Unreal Engine', 'Game Engine Export', 'High Performance'],
        gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    },
    {
        icon: Palette,
        title: 'Concept Art',
        subtitle: 'Visual Development',
        description: 'Our talented 2D artists will create new worlds for you from scratch. Starting with the concept and then gradually advancing to the storyboard. First, we make your story look perfect in 2D before transforming it into virtual reality.',
        features: ['World Building', 'Storyboards', '2D Concepts', 'Virtual Reality Prep'],
        gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
    },
    {
        icon: Clapperboard,
        title: 'Real-Time Lookdev',
        subtitle: 'Virtual Art Department',
        description: 'Not ready for shooting finished pixels in virtual production yet? We can still be of use serving as a remote virtual art department. Real-time lookdev has never been so affordable as it is with gamedev technology. We can create a low-poly virtual set exactly matching the real one you want to shoot in.',
        features: ['Remote Art Dept', 'Camera Tracking', 'Color Schemes', 'Low-poly Sets'],
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    },
    {
        icon: Eye,
        title: 'Shoot Supervision',
        subtitle: 'On-Set VFX',
        description: 'Right from setting up a VFX shot, to staging it, reviewing it for timing, composition & readiness for post-production, OpenSlate\'s VFX Supervisor is your directorial ally on all VFX shots. Especially since s/he has eyes that can see Invisibility!',
        features: ['Shot Setup', 'Staging Review', 'Timing & Composition', 'Post-Production Ready'],
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
    },
];

// Double the services for seamless infinite scroll
const infiniteServices = [...services, ...services];

export default function Services() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    return (
        <section id="services" className={styles.services}>
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.label}>What We Offer</span>
                    <h2 className={styles.title}>
                        Our <span className={styles.gradient}>Services</span>
                    </h2>
                    <p className={styles.subtitle}>
                        From concept to final delivery, we provide end-to-end VFX and virtual production services for Films, TVC and OTT.
                    </p>
                </div>

                <div className={styles.carouselWrapper}>
                    <div
                        className={styles.carousel}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div
                            ref={trackRef}
                            className={`${styles.track} ${isPaused ? styles.paused : ''}`}
                        >
                            {infiniteServices.map((service, index) => (
                                <div key={index} className={styles.card}>
                                    <div className={styles.cardGlow} />
                                    <div className={styles.cardInner}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.iconWrapper} style={{ background: service.gradient }}>
                                                <service.icon size={26} color="white" />
                                            </div>
                                            <div className={styles.cardTitles}>
                                                <span className={styles.cardSubtitle}>{service.subtitle}</span>
                                                <h3 className={styles.cardTitle}>{service.title}</h3>
                                            </div>
                                        </div>

                                        <p className={styles.cardDescription}>{service.description}</p>

                                        <ul className={styles.features}>
                                            {service.features.map((feature, i) => (
                                                <li key={i} className={styles.feature}>
                                                    <span className={styles.featureDot} style={{ background: service.gradient.split(',')[0].split('(')[1] }} />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>

                                        <div className={styles.cardFooter}>
                                            <a href="#contact" className={styles.cardLink}>
                                                Learn More <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
