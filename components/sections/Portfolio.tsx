'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import styles from './Portfolio.module.css';

const categories = ['All', 'Films', 'TVC', 'OTT', 'Virtual Production'];

const projects = [
    {
        title: 'Epic Fantasy Film',
        category: 'Films',
        description: 'Full VFX pipeline for a high-budget fantasy feature film',
        services: ['VFX', '3D Assets', 'Compositing'],
        image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
        title: 'Automotive Commercial',
        category: 'TVC',
        description: 'Virtual production for premium automotive brand launch',
        services: ['Virtual Production', 'Real-time Lookdev'],
        image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
        title: 'Sci-Fi Series S1',
        category: 'OTT',
        description: 'LED volume production for streaming platform original',
        services: ['Virtual Production', 'VFX', 'Concept Art'],
        image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
        title: 'Action Film VFX',
        category: 'Films',
        description: 'Explosive VFX sequences with fluid simulations',
        services: ['VFX', 'Simulations', 'Compositing'],
        image: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
        title: 'Product Launch',
        category: 'TVC',
        description: 'Real-time rendered environment for product showcase',
        services: ['Virtual Production', '3D Assets'],
        image: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
        title: 'Virtual Set Design',
        category: 'Virtual Production',
        description: 'Custom LED volume environment for music video',
        services: ['Virtual Production', 'Real-time Lookdev'],
        image: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    },
];

export default function Portfolio() {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        if (activeFilter === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => p.category === activeFilter));
        }
    }, [activeFilter]);

    return (
        <section ref={sectionRef} className={styles.portfolio} id="portfolio">
            <div className={styles.container}>
                <div className={styles.sectionHeader}>
                    <span className={styles.label}>Our Work</span>
                    <h2 className={styles.title}>
                        Featured <span className={styles.gradient}>Projects</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Explore our portfolio of visual effects and virtual production work
                        across films, commercials, and streaming platforms.
                    </p>
                </div>

                <div className={styles.filters}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ''}`}
                            onClick={() => setActiveFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredProjects.map((project, index) => (
                        <div key={index} className={styles.projectCard}>
                            <div
                                className={styles.projectImage}
                                style={{ background: project.image }}
                            >
                                <div className={styles.projectOverlay}>
                                    <button className={styles.playBtn}>
                                        <Play size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.projectContent}>
                                <span className={styles.projectCategory}>{project.category}</span>
                                <h3 className={styles.projectTitle}>{project.title}</h3>
                                <p className={styles.projectDescription}>{project.description}</p>
                                <div className={styles.projectServices}>
                                    {project.services.map((service, sIndex) => (
                                        <span key={sIndex} className={styles.serviceTag}>{service}</span>
                                    ))}
                                </div>
                                <a href="#contact" className={styles.projectLink}>
                                    <span>View Details</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
