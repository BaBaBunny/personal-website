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

const TABLE_VIEW_TARGET = [0, 0.18, 0];
const TABLE_INSPECT_POSITION = [0, 0.85, 3.4];
const TABLE_DISPLAY_POSITION = [0, 1.05, 3.4];

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
    onHasDeformation,
    ringInteraction = false,
    ringPower = 0,
    ringGlow = false,
    isIsolated = false
}) => {
    const { scene, animations } = useGLTF(src);

    const clonedScene = useMemo(() => scene.clone(true), [scene]);
    const { actions, names, mixer } = useAnimations(animations, clonedScene);
    const ringsRef = useRef([]);
    const tableRef = useRef(null);
    const tableBaseYRef = useRef(null);
    const ringBaseYRef = useRef(new WeakMap());

    useEffect(() => {
        let foundMorph = false;
        const foundRings = [];

        clonedScene.traverse((child) => {
            if (/^Table$/i.test(child.name)) {
                tableRef.current = child;
                if (tableBaseYRef.current === null) {
                    tableBaseYRef.current = child.position.y;
                }
                child.position.y = tableBaseYRef.current - (isIsolated ? 0 : 0.45);

                // Kill glossy white glare on the table
                child.traverse((tMesh) => {
                    if (tMesh.isMesh && tMesh.material) {
                        const mats = Array.isArray(tMesh.material) ? tMesh.material : [tMesh.material];
                        mats.forEach((m) => {
                            m.roughness = 0.88;
                            m.metalness = 0.0;
                            m.envMapIntensity = 0.15;
                            m.needsUpdate = true;
                        });
                    }
                });
            }

            if (ringInteraction && !isIsolated && /^ring/i.test(child.name)) {
                if (!ringBaseYRef.current.has(child)) {
                    ringBaseYRef.current.set(child, child.position.y);
                }
                child.position.y = ringBaseYRef.current.get(child) - 0.45;
                foundRings.push({
                    obj: child,
                    basePos: child.position.clone(),
                    baseRot: child.rotation.clone(),
                    phase: foundRings.length * 0.85
                });
            }

            if (!child.isMesh) return;
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.morphTargetInfluences?.length > 0) {
                foundMorph = true;
            }
        });

        if (ringInteraction && isIsolated) {
            foundRings.push({
                obj: clonedScene,
                basePos: clonedScene.position.clone(),
                baseRot: clonedScene.rotation.clone(),
                phase: 0
            });
        }

        ringsRef.current = foundRings;
        onHasDeformation?.(foundMorph || animations.length > 0);
    }, [animations, clonedScene, isIsolated, onHasDeformation, ringInteraction]);

    useFrame(({ clock }) => {
        if (!ringInteraction || ringsRef.current.length === 0) return;

        const t = clock.getElapsedTime();
        const glowLevel = ringGlow ? 1 : ringPower;
        const quiverAmt = ringPower * ringPower * 0.012;

        ringsRef.current.forEach(({ obj, basePos, baseRot, phase }) => {
            const hoverY = isIsolated
                ? 0
                : ringPower * 0.25 +
                  (ringPower > 0.01 ? Math.sin(t * 2.4 + phase) * 0.03 * ringPower : 0);

            const qx = Math.sin(t * 38 + phase * 3) * quiverAmt;
            const qz = Math.cos(t * 43 + phase * 5) * quiverAmt;

            obj.position.set(basePos.x + qx, basePos.y + hoverY, basePos.z + qz);
            obj.rotation.set(
                baseRot.x + Math.sin(t * 28 + phase) * quiverAmt * 2,
                baseRot.y,
                baseRot.z + Math.cos(t * 31 + phase) * quiverAmt * 2
            );

            obj.traverse((mesh) => {
                if (!mesh.isMesh || !mesh.material) return;

                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                materials.forEach((material) => {
                    if (/glow/i.test(material.name)) {
                        if (material.emissive && material.emissive.getHex() === 0x000000) {
                            material.emissive.set('#0088ff');
                        }
                        if ('emissiveIntensity' in material) {
                            material.emissiveIntensity = glowLevel * 2.0;
                        }
                    }
                });
            });
        });
    });

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
    onHasDeformation,
    onSpinMove,
    ringInteraction = false,
    ringPower = 0,
    ringGlow = false,
    isIsolated = false
}) => {
    const rad = (lightAngle * Math.PI) / 180;
    const keyX = Math.cos(rad) * 3.4;
    const keyZ = Math.sin(rad) * 3.4;

    const isTableScene = ringInteraction && !isIsolated;

    const lastCamPosRef = useRef(new THREE.Vector3());
    useFrame(({ camera }) => {
        if (!interactive || !onSpinMove) return;
        const distance = camera.position.distanceTo(lastCamPosRef.current);
        lastCamPosRef.current.copy(camera.position);

        if (distance > 0.002) {
            onSpinMove(distance);
        }
    });
    
    return (
    <>
        {isTableScene && <color attach="background" args={['#050508']} />}

        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={
                isTableScene
                    ? interactive
                        ? [0, 0.85, 3.4]
                        : [0, 1.4, 2.5]
                    : !interactive
                    ? [0, 0.8, 2.6]
                    : [0, 0.15, 2.4]
            }
            fov={32}
        />

        {isTableScene ? (
            <>
                <ambientLight intensity={0.8 * lightIntensity} color="#b8c7ff" />
                <directionalLight
                    color="#ffae5c"
                    intensity={2.2 * lightIntensity}
                    position={[keyX, 2.2, keyZ]}
                />
                <directionalLight
                    color="#2563eb"
                    intensity={1.6 * lightIntensity}
                    position={[-keyX, 1.4, -keyZ]}
                />
                <pointLight
                    color="#38bdf8"
                    intensity={(ringGlow ? 1 : ringPower) * 4}
                    position={[0, 0.35, 0]}
                    distance={4}
                />
            </>
        ) : (
            <>
                <ambientLight intensity={0.55 * lightIntensity} />
                <directionalLight intensity={1.35 * lightIntensity} position={[keyX, 2.8, keyZ]} />
                <spotLight
                    intensity={0.75 * lightIntensity}
                    position={[-keyX, 2.0, keyZ * 0.8]}
                    angle={0.45}
                    penumbra={0.7}
                />
                <directionalLight intensity={1.25 * lightIntensity} position={[-keyX, 1.8, -keyZ]} />
                <pointLight intensity={0.9 * lightIntensity} position={[0, -1.5, -2.8]} distance={8} />
            </>
        )}

        <Suspense fallback={null}>
            <ModelScene 
                src={src} 
                scale={scale} 
                rotation={rotation}
                envIntensity={(isTableScene ? 0.35 : 1.2) * lightIntensity}
                bendProgress={bendProgress}
                onHasDeformation={onHasDeformation}
                ringInteraction={ringInteraction}
                ringPower={ringPower}
                ringGlow={ringGlow}
                isIsolated={isIsolated}
            />
        </Suspense>
        <Suspense fallback={null}>
            <Environment preset={envPreset} />
        </Suspense>

        {(!interactive || displayMode) && !isTableScene && (
            <ContactShadows
                position={[0, -0.95, 0]}
                opacity={0.4}
                scale={4.8}
                blur={2.4}
                far={2.5}
                frames={displayMode ? Infinity : 1}
            />
        )}
        
        {isTableScene ? (
            <OrbitControls
                key="table-controls"
                ref={controlsRef}
                makeDefault
                target={TABLE_VIEW_TARGET}
                enablePan={interactive}
                enableZoom={interactive}
                enableRotate={interactive}
                minPolarAngle={0.2}
                maxPolarAngle={Math.PI / 2 - 0.08}
                minDistance={2}
                maxDistance={5}
                autoRotate={!interactive || displayMode}
                autoRotateSpeed={0.8}
            />
        ) : interactive && !displayMode ? (
            <TrackballControls
                key="free-trackball"
                ref={controlsRef}
                makeDefault
                rotateSpeed={2.5}
                zoomSpeed={1.2}
                panSpeed={0.15}
                noPan={false}
                noZoom={false}
                minDistance={0.4}
                maxDistance={5}
                dynamicDampingFactor={0.1}
            />
        ) : (
            <OrbitControls
                key="display-orbit"
                ref={controlsRef}
                makeDefault
                enablePan={false}
                enableZoom={interactive}
                enableRotate={interactive}
                target={[0, 0, 0]}
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

const useProjectSfx = ({ bendSfxSrc, spinSfxSrc, powerSfxSrc, powerLevel = 0, enabled, isMuted }) => {
    const bendAudioRef = useRef(null);
    const spinAudioRef = useRef(null);
    const powerDecksRef = useRef([]);
    const activeDeckRef = useRef(0);
    const powerLevelRef = useRef(powerLevel);
    const isMutedRef = useRef(isMuted);
    const bendFadeRef = useRef(null);
    const spinFadeRef = useRef(null);

    powerLevelRef.current = powerLevel;
    isMutedRef.current = isMuted;

    useEffect(() => {
        if (!enabled) return undefined;

        if (bendSfxSrc) {
            const bendAudio = new Audio(bendSfxSrc);
            bendAudio.loop = true;
            bendAudio.volume = 0;
            bendAudio.preload = 'auto';
            bendAudioRef.current = bendAudio;
        }

        if (spinSfxSrc) {
            const spinAudio = new Audio(spinSfxSrc);
            spinAudio.loop = true;
            spinAudio.volume = 0;
            spinAudio.preload = 'auto';
            spinAudioRef.current = spinAudio;
        }

        let crossfadeInterval = null;

        if (powerSfxSrc) {
            const deckA = new Audio(powerSfxSrc);
            const deckB = new Audio(powerSfxSrc);
            [deckA, deckB].forEach((deck) => {
                deck.loop = false;
                deck.volume = 0;
                deck.preload = 'auto';
            });
            powerDecksRef.current = [deckA, deckB];
            activeDeckRef.current = 0;

            crossfadeInterval = setInterval(() => {
                const decks = powerDecksRef.current;
                if (decks.length < 2) return;

                const level = powerLevelRef.current;
                const muted = isMutedRef.current;
                const active = decks[activeDeckRef.current];
                const next = decks[1 - activeDeckRef.current];

                if (muted || level <= 0.01) {
                    decks.forEach((d) => {
                        d.volume = 0;
                        if (!d.paused) d.pause();
                    });
                    return;
                }

                const targetVol = Math.min(0.85, level * 0.85);
                const rate = 0.85 + level * 0.4;

                if (active.paused) {
                    active.playbackRate = rate;
                    active.play().catch(() => {});
                } else {
                    active.playbackRate = rate;
                }

                const duration = active.duration;
                if (!duration || Number.isNaN(duration)) {
                    active.volume = targetVol;
                    return;
                }

                const fadeWindow = Math.min(0.8, duration * 0.3);
                const timeLeft = duration - active.currentTime;

                if (timeLeft <= fadeWindow) {
                    if (next.paused) {
                        next.currentTime = 0;
                        next.playbackRate = rate;
                        next.play().catch(() => {});
                    } else {
                        next.playbackRate = rate;
                    }

                    const t = Math.max(0, Math.min(1, timeLeft / fadeWindow));
                    active.volume = targetVol * t;
                    next.volume = targetVol * (1 - t);

                    if (timeLeft <= 0.06) {
                        active.pause();
                        active.currentTime = 0;
                        active.volume = 0;
                        next.volume = targetVol;
                        activeDeckRef.current = 1 - activeDeckRef.current;
                    }
                } else {
                    active.volume = targetVol;
                    if (!next.paused) {
                        next.pause();
                        next.currentTime = 0;
                        next.volume = 0;
                    }
                }
            }, 40);
        }

        return () => {
            clearTimeout(bendFadeRef.current);
            clearTimeout(spinFadeRef.current);
            clearInterval(crossfadeInterval);
            if (bendAudioRef.current) {
                bendAudioRef.current.pause();
                bendAudioRef.current = null;
            }
            if (spinAudioRef.current) {
                spinAudioRef.current.pause();
                spinAudioRef.current = null;
            }
            powerDecksRef.current.forEach((deck) => {
                deck.pause();
            });
            powerDecksRef.current = [];
        };
    }, [bendSfxSrc, spinSfxSrc, powerSfxSrc, enabled]);

    useEffect(() => {
        if (isMuted) {
            if (bendAudioRef.current) bendAudioRef.current.volume = 0;
            if (spinAudioRef.current) spinAudioRef.current.volume = 0;
            powerDecksRef.current.forEach((deck) => {
                deck.volume = 0;
            });
        }
    }, [isMuted]);

    const triggerBendSfx = (speed, progress) => {
        const audio = bendAudioRef.current;
        if (!audio || isMuted) return;

        if (audio.paused) {
            audio.play().catch(() => {});
        }

        audio.volume = Math.min(0.85, Math.max(0.08, speed * 12));
        audio.playbackRate = 0.85 + progress * 0.4;

        clearTimeout(bendFadeRef.current);
        bendFadeRef.current = setTimeout(() => {
            if (bendAudioRef.current) bendAudioRef.current.volume = 0;
        }, 100);
    };

    const triggerSpinSfx = (cameraSpeed, intensity = 0) => {
        const audio = spinAudioRef.current;
        if (!audio || isMuted) return;

        if (audio.paused) {
            audio.play().catch(() => {});
        }

        audio.volume = Math.min(0.75, Math.max(0.03, cameraSpeed * 6));
        audio.playbackRate = 0.92 + Math.min(0.35, cameraSpeed * 1.5) + intensity * 0.15;

        clearTimeout(spinFadeRef.current);
        spinFadeRef.current = setTimeout(() => {
            if (spinAudioRef.current) spinAudioRef.current.volume = 0;
        }, 110);
    };

    return { triggerBendSfx, triggerSpinSfx };
};

//actual model being rendered
const ModelViewer = ({
    src,
    altModelSrc,
    altModelLabel = 'Isolate',
    scale,
    rotation,
    bendSfxSrc,
    spinSfxSrc,
    powerSfxSrc,
    ringInteraction = false,
    className,
    interactive = false,
    standalone = false,
    hidden = false
}) => {
    const [useAltModel, setUseAltModel] = useState(false);
    const activeSrc = useAltModel && altModelSrc ? altModelSrc : src;
    const [envPreset, setEnvPreset] = useState('studio');
    const [lightIntensity, setLightIntensity] = useState(1.2);
    const [lightAngle, setLightAngle] = useState(45);
    const [displayMode, setDisplayMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [bendProgress, setBendProgress] = useState(0);
    const [hasDeformation, setHasDeformation] = useState(false);
    const [ringPower, setRingPower] = useState(0);
    const [ringGlow, setRingGlow] = useState(false);
    
    const [isMuted, setIsMuted] = useState(false);
    const prevBendRef = useRef(0);
    const hasSfx = Boolean(bendSfxSrc || spinSfxSrc || powerSfxSrc);

    const { triggerBendSfx, triggerSpinSfx } = useProjectSfx({
        bendSfxSrc,
        spinSfxSrc,
        powerSfxSrc,
        powerLevel: ringPower,
        enabled: interactive && standalone,
        isMuted
    });

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

    useEffect(() => {
        setDisplayMode(false);
        cameraRef.current?.up.set(0, 1, 0);

        if (useAltModel) {
            cameraRef.current?.position.set(0, 0.15, 2.4);
            controlsRef.current?.target.set(0, 0, 0);
            controlsRef.current?.update();
            cameraRef.current?.lookAt(0, 0, 0);
        } else if (ringInteraction) {
            cameraRef.current?.position.set(...TABLE_INSPECT_POSITION);
            controlsRef.current?.target.set(...TABLE_VIEW_TARGET);
            controlsRef.current?.update();
            cameraRef.current?.lookAt(...TABLE_VIEW_TARGET);
        }
    }, [useAltModel, ringInteraction]);

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
        cameraRef.current?.up.set(0, 1, 0);

        if (ringInteraction && !useAltModel) {
            const distance = cameraRef.current && controlsRef.current
                ? cameraRef.current.position.distanceTo(controlsRef.current.target)
                : 3.4;
            const direction = new THREE.Vector3(
                ...(displayMode ? TABLE_DISPLAY_POSITION : TABLE_INSPECT_POSITION)
            ).sub(new THREE.Vector3(...TABLE_VIEW_TARGET)).normalize();
            controlsRef.current?.target.set(...TABLE_VIEW_TARGET);
            cameraRef.current?.position.copy(
                new THREE.Vector3(...TABLE_VIEW_TARGET).add(direction.multiplyScalar(distance || 3.4))
            );
            controlsRef.current?.update();
            cameraRef.current?.lookAt(...TABLE_VIEW_TARGET);
        } else {
            const target = new THREE.Vector3(0, 0, 0);
            const distance = cameraRef.current
                ? cameraRef.current.position.distanceTo(target)
                : 2.4;
            const direction = new THREE.Vector3(
                0,
                displayMode ? 0.8 : 0.15,
                displayMode ? 2.6 : 2.4
            ).normalize();
            controlsRef.current?.target.set(0, 0, 0);
            cameraRef.current?.position.copy(target.clone().add(direction.multiplyScalar(distance || 2.4)));
            controlsRef.current?.update();
            cameraRef.current?.lookAt(0, 0, 0);
        }
    };

    const handleToggleDisplayMode = (event) => {
        event.stopPropagation();
        setDisplayMode((previous) => {
            const next = !previous;
            cameraRef.current?.up.set(0, 1, 0);
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
                        <button
                            type="button"
                            className="blender-viewport-icon-btn"
                            onClick={handleResetCamera}
                            title="Reset Orientation"
                        >
                            <i className="fa-solid fa-rotate-left"></i>
                        </button>
                        {hasSfx && (
                            <button
                                type="button"
                                className={`blender-viewport-icon-btn ${isMuted ? '' : 'is-active'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMuted((prev) => !prev);
                                }}
                                title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
                            >
                                <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                            </button>
                        )}
                        {ringInteraction && (
                            <button
                                type="button"
                                className={`blender-viewport-icon-btn ${ringGlow ? 'is-active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRingGlow((prev) => !prev);
                                }}
                                title="Toggle Ring Glow"
                            >
                                <i className="fa-solid fa-bolt"></i>
                                <span>Glow</span>
                            </button>
                        )}
                        {altModelSrc && (
                            <button
                                type="button"
                                className={`blender-viewport-icon-btn ${useAltModel ? 'is-active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUseAltModel((prev) => !prev);
                                    setDisplayMode(false);
                                }}
                                title={useAltModel ? 'Back to Full Scene' : `Switch to ${altModelLabel}`}
                            >
                                <i className={`fa-solid ${useAltModel ? 'fa-layer-group' : 'fa-bullseye'}`}></i>
                                <span>{useAltModel ? 'Full Scene' : altModelLabel}</span>
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
                                        onChange={(event) => {
                                            const next = parseFloat(event.target.value);
                                            const speed = Math.abs(next - prevBendRef.current);
                                            prevBendRef.current = next;
                                            setBendProgress(next);
                                            triggerBendSfx(speed, next);
                                        }}
                                    />
                                </label>
                            )}
                            {ringInteraction && (
                                <label className="blender-lighting-slider-label">
                                    <span>Power</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={ringPower}
                                        onChange={(e) => setRingPower(parseFloat(e.target.value))}
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
                        src={activeSrc}
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
                        onSpinMove={(speed) => triggerSpinSfx(speed, ringInteraction ? ringPower : bendProgress)}
                        ringInteraction={ringInteraction}
                        ringPower={ringPower}
                        ringGlow={ringGlow}
                        activeSrc={activeSrc}
                        isIsolated={useAltModel}
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
    if (project.modelSrc) useGLTF.preload(project.modelSrc);
    if (project.altModelSrc) useGLTF.preload(project.altModelSrc);
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
                                        ringInteraction={project.ringInteraction}
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
                            altModelSrc={project.altModelSrc}
                            altModelLabel={project.altModelLabel}
                            scale={project.modelScale}
                            rotation={project.modelRotation}
                            bendSfxSrc={project.bendSfxSrc}
                            spinSfxSrc={project.spinSfxSrc}
                            powerSfxSrc={project.powerSfxSrc}
                            ringInteraction={project.ringInteraction}
                            className="blender-model-viewer--popup"
                            interactive
                            standalone
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

                        <div className="blender-popup-description-scroll">
                            {project.description && (
                                <p className="blender-popup-description">{project.description}</p>
                            )}
                        </div>

                        <div className="blender-video-viewport">
                            <span className='blender-viewport-badge'>Rendered Animation</span>
                            {project.videoSrc ? (
                                <video
                                    className="blender-project-video"
                                    src={project.videoSrc}
                                    controls
                                    loop
                                    muted
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