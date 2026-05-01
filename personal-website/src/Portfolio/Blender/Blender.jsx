import { Center, ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import * as THREE from 'three';
import './Blender.css';
import { blenderProjects } from './Blender.js';

const ModelScene = ({ src, scale = 1 }) => {
    const { scene } = useGLTF(src);
    useEffect(() => {
        scene.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
                child.material.envMapIntensity = 1.15;
                child.material.needsUpdate = true;
            }
        });
    }, [scene]);
    return <primitive object={scene} scale={scale} />;
};

const ModelViewer = ({ src, scale, className, interactive = false }) => {
    const classes = [
        'blender-model-viewer',
        interactive ? 'is-interactive' : 'is-static',
        className
    ].filter(Boolean).join(' ');

    if (!src) {
        return (
            <div className={classes}>
                <div className="blender-model-fallback">Model coming soon</div>
            </div>
        );
    }

    return (
        <div className={classes}>
            <Canvas
                dpr={[1, 2]}
                shadows
                camera={{ position: [0, 0.8, 2.6], fov: 32 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace
                }}
            >
                <ambientLight intensity={0.45} />
                <directionalLight
                    intensity={1.2}
                    position={[2.8, 3.2, 2]}
                    castShadow
                    shadow-bias={-0.0005}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <spotLight
                    intensity={0.65}
                    position={[-2.6, 2.2, 3]}
                    angle={0.35}
                    penumbra={0.6}
                />
                <Suspense fallback={null}>
                    <Center>
                        <ModelScene src={src} scale={scale} />
                    </Center>
                    <Environment preset="studio" />
                </Suspense>
                <ContactShadows
                    position={[0, -0.85, 0]}
                    opacity={0.5}
                    scale={4.8}
                    blur={2.4}
                    far={2.5}
                />
                {interactive ? (
                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        enableDamping
                        dampingFactor={0.08}
                        maxPolarAngle={Math.PI / 1.9}
                        minPolarAngle={Math.PI / 3.2}
                    />
                ) : (
                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        enableRotate={false}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                )}
            </Canvas>
        </div>
    );
};

blenderProjects.forEach((project) => {
    if (project.modelSrc) {
        useGLTF.preload(project.modelSrc);
    }
});

function Blender() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <>
            <Link to="/#portfolio" className="back-button">
                <i className="fa solid fa-xmark"></i>
            </Link>
            <section className="page-section">
                <h1 className="title">Blender Projects</h1>
                <p className="blender-p">a gallery of my 3D modeling and animation projects.</p>
                <div className="blender-project-grid">
                    {blenderProjects.map((project, index) => (
                        <button
                            key={`${project.title}-${index}`}
                            className="blender-folder-panel"
                            type="button"
                            onClick={() => setSelectedProject(project)}
                        >
                            <ModelViewer
                                src={project.modelSrc}
                                scale={project.modelScale}
                                className="blender-model-viewer--card"
                            />
                            <h2>{project.title}</h2>
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
    const handleOpenLink = (e, url) => {
        e.stopPropagation();
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleOverlayClick = (e) => {
        if (e.target !== e.currentTarget) return;
        onClose();
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [project]);

    const projectDownloadLabel = project.projectDownloadLabel ?? 'Download';

    return (
        <div className="blender-popup-overlay" onClick={handleOverlayClick}>
            <div className="blender-popup-card" onClick={(e) => e.stopPropagation()}>
                <ModelViewer
                    src={project.modelSrc}
                    scale={project.modelScale}
                    className="blender-model-viewer--popup"
                    interactive
                />
                <div className="blender-popup-header">
                    <div className="blender-popup-title-row">
                        <h2>{project.title}</h2>
                        {project.projectDownload && (
                            <button
                                type="button"
                                className="blender-popup-project-link"
                                onClick={(e) => handleOpenLink(e, project.projectDownload)}
                            >
                                {projectDownloadLabel}
                            </button>
                        )}
                    </div>
                    <button type="button" className="blender-popup-close" onClick={onClose}>&times;</button>
                </div>
                <p className="blender-popup-description">{project.description}</p>
            </div>
        </div>
    );
};

export { ModelViewer };
export default Blender;