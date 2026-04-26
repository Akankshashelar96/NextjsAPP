'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Mail, Phone } from 'lucide-react';
import styles from './Header.module.css';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/logo.png"
                        alt="Open Slate VFX"
                        width={150}
                        height={40}
                        className={styles.logoImage}
                        priority
                    />
                </Link>

                <nav className={styles.nav}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={styles.navLink}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className={styles.headerActions}>
                    <a href="#contact" className={styles.contactBtn}>
                        <Phone size={16} />
                        <span>Get in Touch</span>
                    </a>
                </div>

                <button
                    className={styles.mobileMenuBtn}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                <nav className={styles.mobileNav}>
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={styles.mobileNavLink}
                            onClick={closeMobileMenu}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
                <div className={styles.mobileContact}>
                    <a href="tel:918570171212" className={styles.mobileContactItem}>
                        <Phone size={20} />
                        <span>+91 857 017 1212</span>
                    </a>
                    <a href="mailto:team@openslatevfx.com" className={styles.mobileContactItem}>
                        <Mail size={20} />
                        <span>team@openslatevfx.com</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
