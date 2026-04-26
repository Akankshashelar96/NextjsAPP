import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
    services: [
        { name: 'Visual Effects', href: '#services' },
        { name: 'Virtual Production', href: '#services' },
        { name: '3D Assets', href: '#services' },
        { name: 'Concept Art', href: '#services' },
        { name: 'Shoot Supervision', href: '#services' },
    ],
    company: [
        { name: 'About Us', href: '#about' },
        { name: 'Our Team', href: '#team' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Careers', href: '#contact' },
        { name: 'Contact', href: '#contact' },
    ],
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.glowTop}></div>

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoText}>OPEN</span>
                            <span className={styles.logoAccent}>SLATE</span>
                        </Link>
                        <p className={styles.tagline}>
                            Creating in-camera visual effects for virtual production.
                            Where creativity begins and reality ends.
                        </p>
                        <div className={styles.contactInfo}>
                            <a href="tel:9011473209" className={styles.contactItem}>
                                <Phone size={18} />
                                <span>+91 90114 73209</span>
                            </a>
                            <a href="mailto:akankshashelar004@gmail.com" className={styles.contactItem}>
                                <Mail size={18} />
                                <span>akankshashelar004@gmail.com</span>
                            </a>
                            <div className={styles.contactItem}>
                                <MapPin size={18} />
                                <span>India</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkTitle}>Services</h4>
                        <ul className={styles.linkList}>
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div className={styles.linkGroup}>
                        <h4 className={styles.linkTitle}>Company</h4>
                        <ul className={styles.linkList}>
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className={styles.cta}>
                        <h4 className={styles.ctaTitle}>Ready to start your project?</h4>
                        <p className={styles.ctaText}>
                            Let&apos;s create something extraordinary together.
                        </p>
                        <a href="#contact" className={styles.ctaBtn}>
                            <span>Start a Project</span>
                            <ArrowUpRight size={18} />
                        </a>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} Open Slate VFX. All rights reserved.<br />
                        <span style={{ opacity: 0.7, fontSize: '0.85rem' }}>Developed with <b>Antigravity AI</b></span>
                    </p>
                    <div className={styles.bottomLinks}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
