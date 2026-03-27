import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.jpg';
import { csProjects } from './CS-Projects/CS-projects.js';
import './Portfolio.css';

function Portfolio() {
    const csGalleryImages = useMemo(() => {
        const images = csProjects
            .map((project) => project.banner)
            .filter(Boolean);

        return images.length ? [...new Set(images)] : [placeholder];
    }, []);

    const [csImageIndex, setCsImageIndex] = useState(0);

    useEffect(() => {
        if (csGalleryImages.length <= 1) return undefined;

        const intervalId = setInterval(() => {
            setCsImageIndex((prev) => (prev + 1) % csGalleryImages.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [csGalleryImages]);

    const currentCsImage = csGalleryImages[csImageIndex] ?? placeholder;

    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <div className="portfolio-top">
                        <h2>CS Projects</h2>
                        <p className="subtitle">any sort of projects related to programming</p>
                        <Link to="/cs-projects">
                            <img
                                key={csImageIndex}
                                src={currentCsImage}
                                alt="CS Projects preview"
                                className="portfolio-image cs-portfolio-image"
                            />
                        </Link>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Blender Projects</h2>
                        <p className="subtitle">3D modeling & animation related</p>
                        <Link to="/blender">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                </div>
                <div className="portfolio-right">
                    <div className="portfolio-top">
                        <h2>Content Creation</h2>
                        <p className="subtitle">youtube, filmmaking & video editing related</p>
                        <Link to="/content-creation">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                    <div className="portfolio-bottom">
                        <h2>Arts n' Crafts</h2>
                        <p className="subtitle">random side stuff I do</p>
                        <Link to="/arts-crafts">
                            <img src={placeholder} alt="Placeholder" className="portfolio-image"/>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Portfolio