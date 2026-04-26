'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const loadGSAP = async () => {
            const gsap = (await import('gsap')).default;

            // Simple intro animations
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(`.${styles.badge}`, {
                y: 30,
                opacity: 0,
                duration: 0.6,
            });

            tl.from(`.${styles.title}`, {
                y: 50,
                opacity: 0,
                duration: 0.8,
            }, '-=0.3');

            tl.from(`.${styles.subtitle}`, {
                y: 30,
                opacity: 0,
                duration: 0.6,
            }, '-=0.4');

            tl.from(`.${styles.actions}`, {
                y: 30,
                opacity: 0,
                duration: 0.6,
            }, '-=0.3');
        };

        loadGSAP();
    }, []);

    return (
        <section ref={sectionRef} className={styles.hero} id="home">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.badge}>
                        <span>Films, TVC and OTT</span>
                    </div>
                    <h1 className={styles.title}>
                        Creating<br />
                        <span className={styles.gradient}>In-Camera</span><br />
                        Visual Effects
                    </h1>
                    <p className={styles.subtitle}>
                        Open Slate creates in-camera visual effects for virtual production.
                        We make them all look photo-real on the LED video walls so you get finished
                        pixels and can proceed to edit your video right after the shooting day.
                    </p>
                    <div className={styles.actions}>
                        <a href="#contact" className={styles.btnPrimary}>
                            Start Your Project
                            <ArrowRight size={20} />
                        </a>
                        <a href="#portfolio" className={styles.btnSecondary}>
                            <Play size={18} />
                            View Our Work
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
