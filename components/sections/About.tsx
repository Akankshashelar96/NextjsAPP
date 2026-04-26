'use client';

import { useEffect, useRef } from 'react';
import { Award, Users, Clapperboard, Film } from 'lucide-react';
import styles from './About.module.css';

const stats = [
    {
        icon: Award,
        value: 3,
        suffix: '+',
        label: 'Years of Excellence',
        description: 'Delivering world-class VFX',
    },
    {
        icon: Clapperboard,
        value: 50,
        suffix: '+',
        label: 'Projects Completed',
        description: 'Films, TVC, OTT & More',
    },
    {
        icon: Users,
        value: 30,
        suffix: '+',
        label: 'Happy Clients',
        description: 'Global production houses',
    },
    {
        icon: Film,
        value: 5000,
        suffix: '+',
        label: 'Shots Delivered',
        description: 'VFX shots worldwide',
    },
];

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const countersRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const loadGSAP = async () => {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const section = sectionRef.current;
            if (!section) return;

            stats.forEach((stat, index) => {
                const counter = countersRef.current[index];
                if (!counter) return;

                const target = { value: 0 };
                gsap.to(target, {
                    value: stat.value,
                    duration: 2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: counter,
                        start: 'top 85%',
                    },
                    onUpdate: () => {
                        counter.textContent = Math.floor(target.value).toLocaleString() + stat.suffix;
                    }
                });
            });

            gsap.from(`.${styles.statCard}`, {
                y: 25,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: `.${styles.statsGrid}`,
                    start: 'top 85%',
                }
            });
        };

        loadGSAP();
    }, []);

    return (
        <section ref={sectionRef} className={styles.about} id="about">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.label}>About Us</span>
                    <h2 className={styles.title}>
                        Where <span className={styles.gradient}>Creativity</span> Meets Technology
                    </h2>
                    <p className={styles.subtitle}>
                        The new era of visual effects is already in place. What used to be filmed in front of
                        the green screens is now filmed in the LED volumes, designed to display visual effects
                        in real-time. We are the ones who create real-time rendered content for the video walls
                        and the ones who help you build a custom LED set of any shape and size.
                    </p>
                    <p className={styles.subtitle}>
                        We know how to get Houdini-made simulations and Unreal Engine environments married and
                        look like a perfect match. We will make in-camera VFX look even more real than life.
                    </p>
                </div>

                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className={styles.statCard}>
                                <div className={styles.iconWrapper}>
                                    <Icon size={28} />
                                </div>
                                <div
                                    ref={(el) => { if (el) countersRef.current[index] = el; }}
                                    className={styles.value}
                                >
                                    0{stat.suffix}
                                </div>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statDescription}>{stat.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
