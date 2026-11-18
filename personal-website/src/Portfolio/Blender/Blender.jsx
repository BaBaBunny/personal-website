import {
    Center,
    ContactShadows,
    Environment,
    OrbitControls,
    PerspectiveCamera,
    TrackballControls,
    View,
    useAnimations,
    useGLTF
} from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import * as THREE from 'three';
import './Blender.css';
import { blenderProjects } from './Blender.js';

export const BlenderPreviewImage = ({ src, alt = 'Blender project preview', className = '' }) => {
    const [frameSrc, setFrameSrc] = useState('');
    const isVideoPreview = src?.toLowerCase().endsWith('.mp4');

    useEffect(() => {
        if (!isVideoPreview) return undefined;

        let cancelled = false;
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';

        const captureFrame = () => {
            const seekTime = Math.min(1, Math.max(0, (video.duration || 1) * 0.15));
            video.currentTime = seekTime;
        };

        const extractFrame = () => {
            if (cancelled) return;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 360;
            const context = canvas.getContext('2d');
            if (!context) return;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            setFrameSrc(canvas.toDataURL('image/jpeg', 0.82));
        };

        video.addEventListener('loadedmetadata', captureFrame);
        video.addEventListener('seeked', extractFrame, { once: true });
        video.src = src;
        video.load();

        return () => {
            cancelled = true;
            video.removeEventListener('loadedmetadata', captureFrame);
            video.removeEventListener('seeked', extractFrame);
            video.removeAttribute('src');
            video.load();
        };
    }, [isVideoPreview, src]);

    const previewSrc = isVideoPreview ? frameSrc : src;

    if (!previewSrc) {
        return <div className={`${className} blender-preview-loading`} aria-label={alt} />;
    }

    return <img key={previewSrc} src={previewSrc} alt={alt} className={className} />;
};

const CanvasClearer = ({ onReady }) => {
    const hasClearedRef = useRef(false);

    useFrame(({ gl }) => {
        gl.setScissorTest(false);
        gl.setClearColor(0x000000, 0);
        gl.clear(true, true, true);
        if (!hasClearedRef.current) {
            hasClearedRef.current = true;
            if (onReady) onReady();
        }
    }, -1);

    return null;
};

//the scene/background/environment
const ModelScene = ({
    src,
    scale = 1,
    rotation = [0, 0, 0],
    envIntensity = 1.25,
    bendProgress = 0,
    onHasDeformation
}) => {
    const { scene, animations } = useGLTF(src);

    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    const { actions, names, mixer } = useAnimations(animations, clonedScene);

    useEffect(() => {
        let foundMorph = false;
        clonedScene.traverse((child) => {
            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
                child.material.envMapIntensity = envIntensity;
                child.material.needsUpdate = true;
            }
            if (child.morphTargetInfluences?.length > 0) {
                foundMorph = true;
            }
        });

        onHasDeformation?.(foundMorph || animations.length > 0);
    }, [animations, clonedScene, envIntensity, onHasDeformation]);

    useEffect(() => {
        clonedScene.traverse((child) => {
            if (child.isMesh && child.morphTargetInfluences?.length > 0) {
                child.morphTargetInfluences[0] = bendProgress;
            }
        });

        if (names.length > 0 && actions[names[0]]) {
            const action = actions[names[0]];
            const duration = action.getClip().duration;
            action.play();
            // AnimationAction is an imperative Three.js controller; scrubbing requires pausing and seeking it.
            // eslint-disable-next-line react-hooks/immutability
            action.paused = true;
            action.time = duration * bendProgress;
            mixer.update(0);
        }
    }, [actions, bendProgress, clonedScene, mixer, names]);

    return (
        <Center cacheKey={src}>
            <primitive object={clonedScene} scale={scale} rotation={rotation} />
        </Center>
    );
};

//controls and lighting
const SceneContents = ({
    src,
    scale,
    rotation,
    interactive,
    displayMode = false,
    controlsRef,
    cameraRef,
    envPreset = 'studio',
    lightIntensity = 1.2,
    lightAngle = 45,
    bendProgress = 0,
    onHasDeformation
}) => {
    const rad = (lightAngle * Math.PI) / 180;
    const keyX = Math.cos(rad) * 3.4;
    const keyZ = Math.sin(rad) * 3.4;
    
    return (
    <>
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={!interactive || displayMode ? [0, 0.8, 2.6] : [0, 0.15, 2.4]}
            fov={32}
        />
        <ambientLight intensity={0.55 * lightIntensity} />
        {/* front lights */}
        <directionalLight
            intensity={1.35 * lightIntensity}
            position={[keyX, 2.8, keyZ]}
        />
        <spotLight
            intensity={0.75 * lightIntensity}
            position={[-keyX, 2.0, keyZ * 0.8]}
            angle={0.45}
            penumbra={0.7}
        />
        {/* back lights */}
        <directionalLight
                intensity={1.25 * lightIntensity}
                position={[-keyX, 1.8, -keyZ]}
        />
        <pointLight
            intensity={0.9 * lightIntensity}
            position={[0, -1.5, -2.8]}
            distance={8}
        />
        <Suspense fallback={null}>
            <ModelScene 
                src={src} 
                scale={scale} 
                rotation={rotation}
                envIntensity={1.2 * lightIntensity}
                bendProgress={bendProgress}
                onHasDeformation={onHasDeformation}
            />
        </Suspense>
        <Suspense fallback={null}>
            <Environment preset={envPreset} />
        </Suspense>

        {/* only renders floor shadow on gallery cards so it doesnt cut across viewport*/}
        {(!interactive || displayMode) && (
            <ContactShadows
                position={[0, -0.95, 0]}
                opacity={0.4}
                scale={4.8}
                blur={2.4}
                far={2.5}
                frames={displayMode ? Infinity : 1}
            />
        )}
        
        {interactive && !displayMode ? (
            <TrackballControls
                ref={controlsRef}
                makeDefault
                rotateSpeed={2.5}
                zoomSpeed={1.2}
                panSpeed={0.15}
                noPan={false}
                noZoom={false}
                minDistance={0.05}
                maxDistance={4.8}
                dynamicDampingFactor={0.1}
            />
        ) : (
            <OrbitControls
                ref={controlsRef}
                makeDefault
                enablePan={false}
                enableZoom={interactive}
                enableRotate={interactive}
                autoRotate
                autoRotateSpeed={1}
            />
        )}
    </>
    );
};

const ENV_PRESETS = [
    { id: 'studio', label: 'Studio' },
    { id: 'city', label: 'City' },
    { id: 'warehouse', label: 'Metal' },
    { id: 'sunset', label: 'Warm' }
];

//actual model being rendered
const ModelViewer = ({
    src,
    scale,
    rotation,
    className,
    interactive = false,
    standalone = false,
    hidden = false,
    badgeText
}) => {
    const [envPreset, setEnvPreset] = useState('studio');
    const [lightIntensity, setLightIntensity] = useState(1.2);
    const [lightAngle, setLightAngle] = useState(45);
    const [displayMode, setDisplayMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [bendProgress, setBendProgress] = useState(0);
    const [hasDeformation, setHasDeformation] = useState(false);
    const viewportContainerRef = useRef(null);
    const controlsRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement === viewportContainerRef.current);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleToggleFullscreen = (event) => {
        event.stopPropagation();
        if (!viewportContainerRef.current) return;
        if (!document.fullscreenElement) {
            viewportContainerRef.current.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    const handleResetCamera = (event) => {
        event?.stopPropagation();
        controlsRef.current?.reset();
        cameraRef.current?.up.set(0, 1, 0);
    };

    const handleToggleDisplayMode = (event) => {
        event.stopPropagation();
        setDisplayMode((previous) => {
            const next = !previous;
            cameraRef.current?.up.set(0, 1, 0);
            cameraRef.current?.position.set(0, next ? 0.8 : 0.15, next ? 2.6 : 2.4);
            controlsRef.current?.target.set(0, 0, 0);
            return next;
        });
    };

    const classes = [
        'blender-model-viewer',
        interactive ? 'is-interactive' : 'is-static',
        isFullscreen ? 'is-fullscreen' : '',
        className
    ].filter(Boolean).join(' ');

    if (!src) {
        return (
            <div className={classes}>
                <div className="blender-model-fallback">Model coming soon</div>
            </div>
        );
    }

    if (hidden) {
        return <div className={classes} />;
    }

    if (standalone) {
        return (
            <div ref={viewportContainerRef} className={classes}>
                {badgeText && <span className="blender-viewport-badge">{badgeText}</span>}

                {interactive && (
                    <div className="blender-viewport-top-actions" onClick={(event) => event.stopPropagation()}>
                        <button
                            type="button"
                            className={`blender-viewport-icon-btn ${displayMode ? 'is-active' : ''}`}
                            onClick={handleToggleDisplayMode}
                            title="Toggle Display Showcase Mode"
                        >
                            <i className="fa-solid fa-arrows-spin"></i>
                            <span>{displayMode ? 'Inspect' : 'Display'}</span>
                        </button>
                        {!displayMode && (
                            <button
                                type="button"
                                className="blender-viewport-icon-btn"
                                onClick={handleResetCamera}
                                title="Reset Orientation"
                            >
                                <i className="fa-solid fa-rotate-left"></i>
                            </button>
                        )}
                        <button
                            type="button"
                            className="blender-viewport-icon-btn"
                            onClick={handleToggleFullscreen}
                            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewport'}
                        >
                            <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                        </button>
                    </div>
                )}

                {interactive && (
                    <div
                        className="blender-lighting-hud"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="blender-lighting-presets">
                            {ENV_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    className={`blender-preset-btn ${envPreset === preset.id ? 'is-active' : ''}`}
                                    onClick={() => setEnvPreset(preset.id)}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <div className="blender-lighting-sliders">
                            {hasDeformation && (
                                <label className="blender-lighting-slider-label">
                                    <span>Bend</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={bendProgress}
                                        onChange={(event) => setBendProgress(parseFloat(event.target.value))}
                                    />
                                </label>
                            )}
                            <label className="blender-lighting-slider-label">
                                <span>Light</span>
                                <input
                                    type="range"
                                    min="0.4"
                                    max="2.4"
                                    step="0.1"
                                    value={lightIntensity}
                                    onChange={(e) => setLightIntensity( parseFloat(e.target.value) )}
                                />
                            </label>
                            <label className="blender-lighting-slider-label">
                                <span>Angle</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    step="5"
                                    value={lightAngle}
                                    onChange={(e) => setLightAngle( parseFloat(e.target.value) )}
                                />
                            </label>
                        </div>
                    </div>
                )}

                <Canvas
                    dpr={[1, 1.5]}
                    onCreated={({ gl }) => {
                        gl.setClearColor(0x000000, 0);
                    }}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                        toneMapping: THREE.ACESFilmicToneMapping,
                        outputColorSpace: THREE.SRGBColorSpace
                    }}
                >
                    <SceneContents
                        src={src}
                        scale={scale}
                        rotation={rotation}
                        interactive={interactive}
                        displayMode={displayMode}
                        controlsRef={controlsRef}
                        cameraRef={cameraRef}
                        envPreset={envPreset}
                        lightIntensity={lightIntensity}
                        lightAngle={lightAngle}
                        bendProgress={bendProgress}
                        onHasDeformation={setHasDeformation}
                    />
                </Canvas>
            </div>
        );
    }

    return (
        <View className={classes}>
            <SceneContents 
                src={src} 
                scale={scale} 
                rotation={rotation}
                interactive={interactive} 
            />
        </View>
    );
};

blenderProjects.forEach((project) => {
    if (project.modelSrc) {
        useGLTF.preload(project.modelSrc);
    }
});

function Blender() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} className="blender-page-wrapper">
            <Link to="/#portfolio" className="back-button">
                <i className="fa-solid fa-xmark"></i>
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
                            <div className="blender-card-preview">
                                {project.previewSrc ? (
                                    <BlenderPreviewImage
                                        src={project.previewSrc}
                                        alt={`${project.title} preview`}
                                        className="blender-card-preview-image"
                                    />
                                ) : (
                                    <div className="blender-card-preview-image blender-preview-loading" />
                                )}
                                {project.modelSrc && (
                                    <ModelViewer
                                        src={project.modelSrc}
                                        scale={project.modelScale}
                                        rotation={project.modelRotation}
                                        className="blender-model-viewer--card blender-card-preview-model"
                                        standalone
                                    />
                                )}
                            </div>
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

            <Canvas
                className="blender-shared-canvas"
                eventSource={containerRef}
                dpr={[1, 1.5]}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0);
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                    autoClear: false
                }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    opacity: canvasReady ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                }}
            >
                <CanvasClearer onReady={() => setCanvasReady(true)} />
                <View.Port />
            </Canvas>
        </div>
    );
}

const ProjectPopup = ({ project, onClose }) => {
    const [showReadMore, setShowReadMore] = useState(false);

    const renderReadMoreContent = () => {
        if (!project.readMore) return null;

        if (Array.isArray(project.readMore)) {
            return project.readMore.map((line, index) => (
                <p key={`read-more-${index}`} className="blender-popup-read-more-text">{line}</p>
            ));
        }

        return <p className="blender-popup-read-more-text">{project.readMore}</p>;
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

    return (
        <div className="blender-popup-overlay" onClick={handleOverlayClick}>
            <div className="blender-popup-card" onClick={(e) => e.stopPropagation()}>
                <div className="blender-popup-split">
                    <div className='blender-popup-left'>
                        <ModelViewer
                            src={project.modelSrc}
                            scale={project.modelScale}
                            rotation={project.modelRotation}
                            className="blender-model-viewer--popup"
                            interactive
                            standalone
                            badgeText="Interactive 3D • Drag to Rotate • Scroll to Zoom"
                        />
                    </div>

                    <div className="blender-popup-right">
                        <div className="blender-popup-header">
                            <h2>{project.title}</h2>
                            <button
                                type="button"
                                className="blender-popup-close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                &times;
                            </button>
                        </div>

                        <p className="blender-popup-description">{project.description}</p>

                        {project.readMore && (
                            <div className="blender-popup-read-more-block">
                                <button
                                    type="button"
                                    className="blender-popup-read-more"
                                    onClick={() => setShowReadMore((prev) => !prev)}
                                >
                                    {showReadMore ? 'Show less' : 'Read more'}
                                </button>
                                {showReadMore && renderReadMoreContent()}
                            </div>
                        )}

                        <div className="blender-video-viewport">
                            <span className='blender-viewport-badge'>Rendered Animation</span>
                            {project.videoSrc ? (
                                <video
                                    className="blender-project-video"
                                    src={project.videoSrc}
                                    controls
                                    loopmuted
                                    playsInline
                                    preload="metadata"
                                />
                            ) : (
                                <div className='blender-video-fallback'>
                                    Animation render coming soon...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ModelViewer };
export default Blender;