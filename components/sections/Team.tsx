'use client';

import { useEffect, useRef } from 'react';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import styles from './Team.module.css';

const team = [
    {
        name: 'VFX Supervisor',
        role: 'Creative Director',
        description: 'Leading the creative vision and overseeing all VFX projects from concept to delivery.',
        initials: 'VS',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    },
    {
        name: 'Virtual Production Lead',
        role: 'Technical Director',
        description: 'Specializing in LED volume production and real-time rendering workflows.',
        initials: 'VP',
        gradient: 'linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)',
    },
    {
        name: '3D Artist Lead',
        role: 'Asset Supervisor',
        description: 'Creating high-fidelity 3D assets optimized for game engines and virtual production.',
        initials: '3D',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)',
    },
    {
        name: 'Concept Artist',
        role: 'Art Director',
        description: 'Transforming ideas into stunning visual concepts and storyboards.',
        initials: 'CA',
        gradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    },
];

export default function Team() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const loadGSAP = async () => {
            const gsap = (await import('gsap')).default;
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const section = sectionRef.current;
            if (!section) return;

            gsap.from(`.${styles.sectionHeader}`, {
                y: 25,
                duration: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                }
            });

            gsap.from(`.${styles.memberCard}`, {
                y: 30,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: `.${styles.grid}`,
                    start: 'top 85%',
                }
            });
        };

        loadGSAP();
    }, []);

    return (
        <section ref={sectionRef} className={styles.team} id="team">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.label}>Our Team</span>
                    <h2 className={styles.title}>
                        Meet the <span className={styles.gradient}>Experts</span>
                    </h2>
                    <p className={styles.subtitle}>
                        A talented team of VFX artists, technical directors, and creative minds
                        dedicated to bringing your vision to life.
                    </p>
                </div>

                <div className={styles.grid}>
                    {team.map((member, index) => (
                        <div key={index} className={styles.memberCard}>
                            <div
                                className={styles.avatar}
                                style={{ background: member.gradient }}
                            >
                                <span className={styles.initials}>{member.initials}</span>
                            </div>
                            <h3 className={styles.memberName}>{member.name}</h3>
                            <span className={styles.memberRole}>{member.role}</span>
                            <p className={styles.memberDescription}>{member.description}</p>
                            <div className={styles.socials}>
                                <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="Twitter">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className={styles.socialLink} aria-label="Email">
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
