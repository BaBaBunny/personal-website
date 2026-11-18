import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.jpg';
import { blenderProjects } from './Blender/Blender.js';
import { BlenderPreviewImage } from './Blender/Blender.jsx';
import { csProjects } from './CS-Projects/CS-projects.js';
import './Portfolio.css';

function Portfolio() {
    const csGalleryImages = useMemo(() => {
        const images = csProjects
            .filter((project) => !project.isPlaceholder)
            .map((project) => project.banner)
            .filter(Boolean);

        return images.length ? [...new Set(images)] : [placeholder];
    }, []);

    const blenderGalleryImages = useMemo(() => {
        const images = blenderProjects
            .filter((project) => !project.isPlaceholder)
            .map((project) => project.previewSrc)
            .filter(Boolean);

        return [...new Set(images)];
    }, []);

    const [csImageIndex, setCsImageIndex] = useState(0);
    const [blenderImageIndex, setBlenderImageIndex] = useState(0);

    useEffect(() => {
        if (csGalleryImages.length <= 1) return undefined;

        const intervalId = setInterval(() => {
            setCsImageIndex((prev) => (prev + 1) % csGalleryImages.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [csGalleryImages]);

    useEffect(() => {
        if (blenderGalleryImages.length <= 1) return undefined;

        const intervalId = setInterval(() => {
            setBlenderImageIndex((prev) => (prev + 1) % blenderGalleryImages.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [blenderGalleryImages]);

    const currentCsImage = csGalleryImages[csImageIndex] ?? placeholder;
    const currentBlenderPreview = blenderGalleryImages[blenderImageIndex];

    return (
        <section id = "portfolio" className = "page-section">
            <h1 className="title">Portfolio</h1>
            <div className="portfolio-grid">
                <div className="portfolio-left">
                    <h2>CS Projects</h2>
                    <p className="cs-subtitle">any sort of projects related to programming</p>
                    <Link to="/cs-projects">
                        <img
                            key={csImageIndex}
                            src={currentCsImage}
                            alt="CS Projects preview"
                            className="cs-image"
                        />
                    </Link>
                </div>
                <div className="portfolio-right">
                    <h2>Creative Works</h2>
                    <Link to="/blender" className='right-card'>
                        {currentBlenderPreview ? (
                            <BlenderPreviewImage
                                src={currentBlenderPreview}
                                alt="Blender project preview"
                                className="thumbnail blender-thumbnail"
                                key={blenderImageIndex}
                            />
                        ) : (
                            <img src={placeholder} alt="Placeholder" className="thumbnail" />
                        )}
                        <div className="text">
                            <h3>3D & Animation</h3>
                            <p>blender stuff</p>
                        </div>
                    </Link>
                    <Link to="/film-media" className='right-card'>
                        <img src={placeholder} alt="Placeholder" className="thumbnail"/>
                        <div className="text">
                            <h3>Film & Media</h3>
                            <p>i make videos</p>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default Portfolio