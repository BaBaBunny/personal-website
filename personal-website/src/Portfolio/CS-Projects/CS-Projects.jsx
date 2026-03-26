import { useEffect, useRef, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import './CS-Projects.css';
import { csProjects } from './CS-projects.js';

const ROTATE_INTERVAL_MS = 10000;
const TRACK_ANIM_MS = 420;
const COMPACT_BREAKPOINT = 760;

const getProjectGallery = (project) => (
    project.galleryImages?.length ? project.galleryImages : [project.banner, project.banner]
);

const renderReadMoreContent = (readMore) => {
    if (!readMore) return null;

    if (Array.isArray(readMore)) {
        return readMore.map((line, index) => (
            <p key={`read-more-${index}`} className="cs-popup-read-more-text">{line}</p>
        ));
    }

    return <p className="cs-popup-read-more-text">{readMore}</p>;
};

const CS = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
            <Link to="/#portfolio" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                <h1 className="title">CS Projects</h1>
                <p className="cs-p">a gallery of my programming projects.</p>
                <div className="cs-project-grid">
                    {csProjects.map((project, index) => (
                        <button
                            key={`${project.title}-${index}`}
                            className="cs-folder-panel"
                            type="button"
                            onClick={() => setSelectedProject(project)}
                        >
                            <img className="cs-project-banner" src={project.banner} alt={`${project.title} banner`} />
                            <h2>{project.title}</h2>
                            <p>{project.description}</p>
                        </button>
                    ))}
                </div>
            </section>

            {selectedProject && (
                <ProjectPopup
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
};

const ProjectPopup = ({ project, onClose }) => {
    const [showReadMore, setShowReadMore] = useState(false);
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isCompactScreen, setIsCompactScreen] = useState(window.innerWidth <= COMPACT_BREAKPOINT);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [isDraggingPair, setIsDraggingPair] = useState(false);
    const [isTrackAnimating, setIsTrackAnimating] = useState(false);
    const dragStartXRef = useRef(null);
    const movedDuringDragRef = useRef(false);
    const isDraggingRef = useRef(false);
    const carouselWindowRef = useRef(null);
    const suppressOverlayCloseRef = useRef(false);

    const gallery = getProjectGallery(project);
    const nextGalleryIndex = (currentGalleryIndex + 1) % gallery.length;
    const hasManyImages = gallery.length > 2;
    const useStackLayout = !hasManyImages && isCompactScreen;
    const pairLeft = gallery[currentGalleryIndex % gallery.length];
    const pairRight = gallery[(currentGalleryIndex + 1) % gallery.length];

    const wrapIndex = (index) => (index + gallery.length) % gallery.length;
    const carouselSlides = [
        gallery[wrapIndex(currentGalleryIndex - 1)],
        gallery[wrapIndex(currentGalleryIndex)],
        gallery[wrapIndex(currentGalleryIndex + 1)],
        gallery[wrapIndex(currentGalleryIndex + 2)]
    ];

    const handleOpenLink = (e, url) => {
        e.stopPropagation();
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const triggerGalleryShuffle = () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setTimeout(() => {
            setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
            setIsShuffling(false);
        }, 350);
    };

    const advanceGallery = () => {
        setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
    };

    const retreatGallery = () => {
        setCurrentGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
    };

    const beginCarouselDrag = (clientX) => {
        if (!hasManyImages) return;
        suppressOverlayCloseRef.current = true;
        dragStartXRef.current = clientX;
        movedDuringDragRef.current = false;
        isDraggingRef.current = true;
        setIsDraggingPair(true);
        setIsTrackAnimating(false);
        setDragOffsetX(0);
        setIsCarouselPaused(true);
    };

    const updateCarouselDrag = (clientX) => {
        if (!hasManyImages || !isDraggingRef.current || dragStartXRef.current === null) return;

        const panelWidth = carouselWindowRef.current?.clientWidth ?? 1;
        const delta = clientX - dragStartXRef.current;
        const clampedDelta = Math.max(-panelWidth, Math.min(panelWidth, delta));

        if (Math.abs(clampedDelta) >= 3) {
            movedDuringDragRef.current = true;
        }

        setDragOffsetX(clampedDelta);
    };

    const snapTrackAndCommit = (direction) => {
        const panelWidth = carouselWindowRef.current?.clientWidth ?? 0;
        const slotWidth = panelWidth / 2;
        if (slotWidth === 0) return;

        if (direction === 0) {
            setIsTrackAnimating(true);
            setDragOffsetX(0);
            setTimeout(() => setIsTrackAnimating(false), TRACK_ANIM_MS);
            return;
        }

        setIsTrackAnimating(true);
        setDragOffsetX(direction === 1 ? -slotWidth : slotWidth);

        setTimeout(() => {
            setIsTrackAnimating(false);
            setCurrentGalleryIndex((prev) => wrapIndex(prev + direction));
            setDragOffsetX(0);
        }, TRACK_ANIM_MS);
    };

    const endCarouselDrag = () => {
        if (!hasManyImages || !isDraggingRef.current) return;
        const direction = dragOffsetX <= -5 ? 1 : dragOffsetX >= 5 ? -1 : 0;

        isDraggingRef.current = false;
        dragStartXRef.current = null;
        setIsDraggingPair(false);
        snapTrackAndCommit(direction);
        setTimeout(() => setIsCarouselPaused(false), 80);
        setTimeout(() => {
            suppressOverlayCloseRef.current = false;
        }, TRACK_ANIM_MS + 40);
    };

    const handleOverlayClick = (e) => {
        if (e.target !== e.currentTarget) return;
        if (suppressOverlayCloseRef.current) return;
        onClose();
    };

    const handleCarouselClick = () => {
        if (movedDuringDragRef.current) {
            movedDuringDragRef.current = false;
            return;
        }

        const width = carouselWindowRef.current?.clientWidth ?? 0;
        if (width === 0) {
            advanceGallery();
            return;
        }

        setIsCarouselPaused(true);
        snapTrackAndCommit(1);
        setTimeout(() => setIsCarouselPaused(false), TRACK_ANIM_MS + 20);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        setShowReadMore(false);
        setCurrentGalleryIndex(0);
        setDragOffsetX(0);
        setIsDraggingPair(false);
        setIsTrackAnimating(false);
        isDraggingRef.current = false;
        movedDuringDragRef.current = false;
        dragStartXRef.current = null;

        const handleResize = () => {
            setIsCompactScreen(window.innerWidth <= COMPACT_BREAKPOINT);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('resize', handleResize);
        };
    }, [project]);

    useEffect(() => {
        if (!hasManyImages || isCarouselPaused || isTrackAnimating) return;

        const interval = setInterval(() => {
            if (isDraggingRef.current) return;
            setIsCarouselPaused(true);
            snapTrackAndCommit(1);
            setTimeout(() => setIsCarouselPaused(false), TRACK_ANIM_MS + 20);
        }, ROTATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [hasManyImages, gallery.length, isCarouselPaused, isTrackAnimating]);

    useEffect(() => {
        if (hasManyImages) return;

        const interval = setInterval(() => {
            if (useStackLayout) {
                triggerGalleryShuffle();
                return;
            }

            setCurrentGalleryIndex((prev) => (prev + 1) % gallery.length);
        }, ROTATE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [hasManyImages, useStackLayout, gallery.length, isShuffling]);

    return (
        <div className="cs-popup-overlay" onClick={handleOverlayClick}>
            <div className="cs-popup-card" onClick={(e) => e.stopPropagation()}>
                <img className="cs-popup-banner" src={project.banner} alt={`${project.title} banner`} />
                <div className="cs-popup-header">
                    <div className="cs-popup-title-row">
                        <h2>{project.title}</h2>
                        <button
                            type="button"
                            className="cs-popup-project-link"
                            onClick={(e) => handleOpenLink(e, project.projectLink)}
                        >
                            Check it out
                        </button>
                        <button
                            type="button"
                            className="cs-popup-repo-button"
                            onClick={(e) => handleOpenLink(e, project.repoLink)}
                        >
                            <i className="fa-brands fa-github"></i>
                            <span>GitHub</span>
                        </button>
                    </div>
                    <button type="button" className="cs-popup-close" onClick={onClose}>&times;</button>
                </div>
                <p className="cs-popup-description">{project.details}</p>

                <button
                    type="button"
                    className="cs-popup-read-more"
                    onClick={() => setShowReadMore((prev) => !prev)}
                >
                    {showReadMore ? 'Show less' : 'Read more'}
                </button>

                {showReadMore && renderReadMoreContent(project.readMore)}

                <section className="cs-gallery-section">
                    <h3 className="cs-popup-subtitle">Image Gallery</h3>
                    {hasManyImages ? (
                        <div
                            ref={carouselWindowRef}
                            className="cs-carousel-window"
                            onMouseDown={(e) => beginCarouselDrag(e.clientX)}
                            onMouseMove={(e) => updateCarouselDrag(e.clientX)}
                            onMouseUp={endCarouselDrag}
                            onMouseLeave={endCarouselDrag}
                            onTouchStart={(e) => beginCarouselDrag(e.touches[0].clientX)}
                            onTouchMove={(e) => updateCarouselDrag(e.touches[0].clientX)}
                            onTouchEnd={endCarouselDrag}
                            onClick={handleCarouselClick}
                        >
                            <div
                                className={`cs-carousel-track ${isTrackAnimating ? 'is-animating' : ''} ${isDraggingPair ? 'is-dragging' : ''}`}
                                style={{ transform: `translateX(calc(-25% + ${dragOffsetX}px))` }}
                            >
                                {carouselSlides.map((image, index) => (
                                    <div className="cs-carousel-slide" key={`${image}-${index}`}>
                                        <img className="cs-gallery-image" src={image} alt={`project preview ${index + 1}`} draggable="false" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : useStackLayout ? (
                        <div className="cs-card-stack" onClick={triggerGalleryShuffle}>
                            <img
                                src={gallery[nextGalleryIndex]}
                                alt="next project preview"
                                className={`cs-card cs-back-card ${isShuffling ? 'shuffling' : ''}`}
                            />
                            <img
                                src={gallery[currentGalleryIndex]}
                                alt="current project preview"
                                className={`cs-card cs-front-card ${isShuffling ? 'yielding' : ''}`}
                            />
                        </div>
                    ) : (
                        <div className="cs-gallery-pair">
                            <img className="cs-gallery-image" src={pairLeft} alt="project preview 1" />
                            <img className="cs-gallery-image" src={pairRight} alt="project preview 2" />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default CS;