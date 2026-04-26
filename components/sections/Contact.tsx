'use client';

import { useRef, useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        projectType: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        alert('Thank you for your message! We will get back to you soon.');
        setFormState({ name: '', email: '', projectType: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <section ref={sectionRef} className={styles.contact} id="contact">
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.contactInfo}>
                        <span className={styles.label}>Get in Touch</span>
                        <h2 className={styles.title}>
                            Let&apos;s Create <span className={styles.gradient}>Something</span> Extraordinary
                        </h2>
                        <p className={styles.description}>
                            Ready to bring your vision to life? Contact us to discuss your project
                            and discover how our VFX and virtual production expertise can elevate
                            your production.
                        </p>

                        <div className={styles.contactItems}>
                            <a href="tel:918570171212" className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <Phone size={20} />
                                </div>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>Phone</span>
                                    <span className={styles.contactValue}>+91 857 017 1212</span>
                                </div>
                            </a>

                            <a href="mailto:team@openslatevfx.com" className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <Mail size={20} />
                                </div>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>Email</span>
                                    <span className={styles.contactValue}>team@openslatevfx.com</span>
                                </div>
                            </a>

                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <MapPin size={20} />
                                </div>
                                <div className={styles.contactDetails}>
                                    <span className={styles.contactLabel}>Location</span>
                                    <span className={styles.contactValue}>India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formCard}>
                        <h3 className={styles.formTitle}>Start Your Project</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name" className={styles.formLabel}>Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                        className={styles.formInput}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        required
                                        className={styles.formInput}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="projectType" className={styles.formLabel}>Project Type</label>
                                <select
                                    id="projectType"
                                    name="projectType"
                                    value={formState.projectType}
                                    onChange={handleChange}
                                    required
                                    className={styles.formSelect}
                                >
                                    <option value="">Select a service</option>
                                    <option value="vfx">Visual Effects</option>
                                    <option value="virtual-production">Virtual Production</option>
                                    <option value="3d-assets">3D Assets Creation</option>
                                    <option value="concept-art">Concept Art</option>
                                    <option value="lookdev">Real-Time Lookdev</option>
                                    <option value="supervision">Shoot Supervision</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message" className={styles.formLabel}>Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formState.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className={styles.formTextarea}
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting}
                            >
                                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                {!isSubmitting && <Send size={18} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
