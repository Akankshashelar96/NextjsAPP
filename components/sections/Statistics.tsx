'use client';

import { useEffect, useRef } from 'react';
import { Award, Users, Clapperboard, Film } from 'lucide-react';
import styles from './Statistics.module.css';

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

export default function Statistics() {
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

            // Simple slide up animation - cards start visible
            gsap.from(`.${styles.statCard}`, {
                y: 30,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                }
            });
        };

        loadGSAP();
    }, []);

    return (
        <section ref={sectionRef} className={styles.statistics}>
            <div className={styles.container}>
                <div className={styles.grid}>
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
                                <div className={styles.label}>{stat.label}</div>
                                <div className={styles.description}>{stat.description}</div>
                                <div className={styles.cardBorder}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
