"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Plane,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Sky } from "@react-three/drei";

import Office from "./components/Office";
import Fan from "./components/Fan";
import Room from "./components/Room";
import LockButton from "./components/LockButton";
import { AiFillMuted, AiFillSound } from "react-icons/ai";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { TextureLoader } from "three";

import SplashScreen from "./components/SplashScreen";
import Boot from "./components/Boot";


// ----------------------------------------------------------------
// YÜKLEME EKRANI (GERÇEK ZAMANLI PROGRESS BAR)
// ----------------------------------------------------------------
function LoadingOverlay({ onLoaded }) {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onLoaded();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onLoaded]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black text-white z-50">
      <div className="w-3/4 md:w-1/2 lg:w-1/3 h-2 bg-gray-700 relative overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
          className="absolute top-0 left-0 h-full bg-green-400"
        />
      </div>
      <div className="mt-2 text-sm font-mono">
        {progress.toFixed(0)}% Loading...
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Ses Kontrol Bileşeni
// ----------------------------------------------------------------
function AudioControls({ audioRef }) {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = new Audio("/sounds/office-ambience.wav");
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch((err) => console.warn("Play engellendi:", err));
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Eksik olan handlePlayPause fonksiyonunu ekleyin:
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Play engellendi:", err));
    }
  };

  return (
    <div className="flex items-center gap-2 ml-2">
      <button
        onClick={handlePlayPause}
        className="relative inline-flex items-center justify-center px-4 py-1 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 group"
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-700 group-hover:w-32 group-hover:h-32" />
        <span className="absolute inset-0 w-full h-full -mt-1 opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700" />
        <span className="relative">
          {isPlaying ? (
            <AiFillSound className="scale-125" />
          ) : (
            <AiFillMuted className="scale-125" />
          )}
        </span>
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// Arka Plan Resmi
// ----------------------------------------------------------------
function Background() {
  const texture = useLoader(TextureLoader, "/photos/background3.jpg");
  const { scene } = useThree();

  useEffect(() => {
    scene.background = texture;
  }, [scene, texture]);

  return null;
}

// ----------------------------------------------------------------
// Post-Processing Efektleri
// ----------------------------------------------------------------
function PostProcessing() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    composer.current.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.2,
      0.5,
      0.5
    );
    composer.current.addPass(bloomPass);

    const ssaoPass = new SSAOPass(scene, camera, size.width, size.height);
    ssaoPass.kernelRadius = 10;
    ssaoPass.minDistance = 0.005;
    ssaoPass.maxDistance = 0.07;
    composer.current.addPass(ssaoPass);

    const bokehPass = new BokehPass(scene, camera, {
      focus: 20,
      aperture: 0.00002,
      maxblur: 0.0012,
      width: size.width,
      height: size.height,
    });
    composer.current.addPass(bokehPass);
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (composer.current) composer.current.render();
  }, 1);

  return null;
}

// ----------------------------------------------------------------
// Zemin
// ----------------------------------------------------------------
function Floor() {
  return (
    <Plane
      args={[10, 10]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -15, 0]}
      receiveShadow
    >
      <meshStandardMaterial color="#444" />
    </Plane>
  );
}

// ----------------------------------------------------------------
// Sahne Bileşeni
// ----------------------------------------------------------------
function Scene({
  loading,
  setResetCamera,
  setToComputer,
  setZoomComputer,
  setUnZoomComputer,
  setOfficeAdjuster,
  handleHtmlTransformChange,
  onAnimationEnd,
  cameraLocked,
  showHtml,
  desktopFocus,
  onScenePointerDown,
  setDesktopFocus,
  setSceneLoaded, // Yeni prop: Sahne tamamen hazır olduğunda true çağrılacak.
}) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Reusable temporary vectors to reduce per-frame allocations
  const tempPosOffset = useMemo(() => new THREE.Vector3(), []);
  const tempFinalCamPos = useMemo(() => new THREE.Vector3(), []);
  const tempLerpedLookAt = useMemo(() => new THREE.Vector3(), []);

  // Kamera animasyonu için referanslar
  const currentAnimation = useRef(null);
  const lockedCamPos = useRef(new THREE.Vector3());
  const lockedCamLookAt = useRef(new THREE.Vector3());

  const prevCamPos = useRef(new THREE.Vector3());
  const prevCamRot = useRef(new THREE.Euler());
  const startPosition = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());
  const startFOV = useRef(camera.fov);

  // Sabit hedef konumlar
  const resetCameraPosition = useMemo(
    () => new THREE.Vector3(150, 80, -130),
    []
  );
  const resetCameraLookAt = useMemo(() => new THREE.Vector3(0, -5, 0), []);
  const computerPosition = useMemo(
    () => new THREE.Vector3(14.63, 2.13, -11.73),
    []
  );
  const computerLookAt = useMemo(
    () => new THREE.Vector3(13.92, 2.0, -11.04),
    []
  );

  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  const initialIntroPosition = useMemo(
    () => new THREE.Vector3(-300, 150, -300),
    []
  );
  const initialIntroLookAt = useMemo(() => new THREE.Vector3(0, -5, 0), []);
  const initialIntroFOV = 60;

  const [didIntro, setDidIntro] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationStartTime = useRef(0);

  const isSafariOrFirefox = (() => {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isFirefox = /firefox/i.test(ua);
    return isSafari || isFirefox;
  })();

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Fare hareketi
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const mouseNorm = mousePos;

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !desktopFocus;
    }
  }, [desktopFocus]);

  // Yardımcı: Kamera animasyonlarını tetikler
  const triggerCameraAnimation = useCallback(
    (mode, targetPos, targetLook, finalFOV = null) => {
      currentAnimation.current = mode;
      startPosition.current.copy(camera.position);
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      startLookAt.current.copy(camera.position).add(dir);
      startFOV.current = camera.fov;

      if (targetPos) targetPosition.current.copy(targetPos);
      else targetPosition.current.copy(camera.position);
      if (targetLook) targetLookAt.current.copy(targetLook);
      else targetLookAt.current.copy(startLookAt.current);

      if (finalFOV !== null) {
        currentAnimation.current = mode;
      }
      setIsAnimating(true);
      animationStartTime.current = Date.now();
    },
    [camera]
  );

  // İlk intro animasyonu
  useEffect(() => {
    if (!didIntro && !loading) {
      setDidIntro(true);
      camera.position.copy(initialIntroPosition);
      camera.lookAt(initialIntroLookAt);
      camera.fov = initialIntroFOV;
      camera.updateProjectionMatrix();

      startPosition.current.copy(initialIntroPosition);
      startLookAt.current.copy(initialIntroLookAt);
      startFOV.current = initialIntroFOV;

      targetPosition.current.copy(resetCameraPosition);
      targetLookAt.current.copy(resetCameraLookAt);

      currentAnimation.current = "initialIntro";
      setIsAnimating(true);
      animationStartTime.current = Date.now();

      // Sahne tamamen hazır olduktan sonra, sceneLoaded state’ini tetikleyin.
      if (setSceneLoaded) {
        setSceneLoaded(true);
      }
    }
  }, [
    didIntro,
    loading,
    camera,
    initialIntroPosition,
    initialIntroLookAt,
    initialIntroFOV,
    resetCameraPosition,
    resetCameraLookAt,
    setSceneLoaded,
  ]);

  // Kamera resetleme animasyonu
  useEffect(() => {
    if (setResetCamera)
      setResetCamera(() => () => {
        triggerCameraAnimation("reset", resetCameraPosition, resetCameraLookAt);
      });
  }, [
    setResetCamera,
    triggerCameraAnimation,
    resetCameraPosition,
    resetCameraLookAt,
  ]);

  // Bilgisayara odaklanma animasyonu
  useEffect(() => {
    if (setToComputer)
      setToComputer(() => () => {
        triggerCameraAnimation("computer", computerPosition, computerLookAt);
      });
  }, [setToComputer, triggerCameraAnimation, computerPosition, computerLookAt]);

  // Bilgisayara zoom animasyonu (sadece FOV değişimi)
  useEffect(() => {
    if (setZoomComputer)
      setZoomComputer(() => () => {
        triggerCameraAnimation("zoomComputer", null, null);
      });
  }, [setZoomComputer, triggerCameraAnimation]);

  // Bilgisayardan unzoom animasyonu (sadece FOV değişimi)
  useEffect(() => {
    if (setUnZoomComputer)
      setUnZoomComputer(() => () => {
        triggerCameraAnimation("unZoomComputer", null, null);
      });
  }, [setUnZoomComputer, triggerCameraAnimation]);

  const ANIMATION_DURATION = 6; // saniye
  const EASING_POWER = 10;
  const TARGET_FOV = 20;
  const ZOOM_FOV = 10;

  useFrame(() => {
    if (cameraLocked && !isAnimating && !desktopFocus) {
      const offsetX = mouseNorm.x - 0.5;
      const offsetY = mouseNorm.y - 0.5;
      const strength = 0.009;
      tempPosOffset.set(offsetX * strength, offsetY * strength, 0);
      tempFinalCamPos.copy(lockedCamPos.current).add(tempPosOffset);
      camera.position.lerp(tempFinalCamPos, 0.2);
      camera.lookAt(lockedCamLookAt.current);
      camera.updateProjectionMatrix();
    }

    if (isAnimating) {
      const elapsed = (Date.now() - animationStartTime.current) / 1000;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const easeProgress =
        progress < 0.5
          ? Math.pow(2 * progress, EASING_POWER) / 2
          : 1 - Math.pow(-2 * progress + 2, EASING_POWER) / 2;

      camera.position.lerpVectors(
        startPosition.current,
        targetPosition.current,
        easeProgress
      );
      tempLerpedLookAt.lerpVectors(
        startLookAt.current,
        targetLookAt.current,
        easeProgress
      );
      camera.lookAt(tempLerpedLookAt);

      const finalFOV =
        currentAnimation.current === "zoomComputer" ? ZOOM_FOV : TARGET_FOV;
      camera.fov = THREE.MathUtils.lerp(
        startFOV.current,
        finalFOV,
        easeProgress
      );
      camera.updateProjectionMatrix();

      if (progress >= 1) {
        setIsAnimating(false);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current);
        }
        lockedCamPos.current.copy(camera.position);
        lockedCamLookAt.current.copy(tempLerpedLookAt);
        if (onAnimationEnd && currentAnimation.current) {
          onAnimationEnd(currentAnimation.current);
        }
      }
    }

    if (
      !prevCamPos.current.equals(camera.position) ||
      !prevCamRot.current.equals(camera.rotation)
    ) {
      prevCamPos.current.copy(camera.position);
      prevCamRot.current.copy(camera.rotation);
    }
  });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isAnimating;
    }
  }, [isAnimating]);

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        position={[15, 25, 15]}
        intensity={5.5}
        castShadow
        shadow-camera-near={0.1}
        shadow-camera-far={600}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0001}
      />
      <hemisphereLight
        skyColor={"white"}
        groundColor={"black"}
        intensity={0.5}
      />
      {isSafariOrFirefox ? (
        <Environment
          files="/hdr/hdr12.hdr"
          background={false}
          intensity={1.0}
          blur={1}
        />
      ) : (
        <Environment
          files="/hdr/hdr12.hdr"
          background={false}
          intensity={1.0}
          blur={1}
        />
      )}
      <Background />
      <Office
        position={[0, -14.5, 0]}
        scale={2.5}
        castShadow
        receiveShadow
        setOfficeAdjuster={setOfficeAdjuster}
        onHtmlTransformChange={handleHtmlTransformChange}
        showHtml={showHtml}
        desktopFocus={desktopFocus}
        setDesktopFocus={setDesktopFocus}
      />
      <Fan position={[0, -14.5, -13]} scale={0.2} />
      {isMobile ? <Floor /> : <Room position={[-50, -14.5, 40]} scale={15.5} />}
      <PostProcessing />
      <OrbitControls
        ref={controlsRef}
        enableRotate={!cameraLocked}
        enablePan={!cameraLocked}
        enableZoom={!cameraLocked}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2 - 0.1}
        maxDistance={580}
        target={[0, -5, 0]}
      />
      <group
        onPointerDown={(e) => onScenePointerDown && onScenePointerDown()}
      />
    </>
  );
}

// ----------------------------------------------------------------
// ASIL SAYFA BİLEŞENİ (HOME)
// ----------------------------------------------------------------
export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [bootComplete, setBootComplete] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  const [resetCamera, setResetCamera] = useState(null);
  const [toComputer, setToComputer] = useState(null);
  const [zoomComputer, setZoomComputer] = useState(null);
  const [unZoomComputer, setUnZoomComputer] = useState(null);
  const [officeAdjuster, setOfficeAdjuster] = useState(null);

  const [cameraLocked, setCameraLocked] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [desktopFocus, setDesktopFocus] = useState(false);

  const handleHtmlTransformChange = (newPosition, newRotation) => {
    // İlgili ayarlamalar...
  };

  // Müzik ayarları
  const audioRef = useRef(null);
  useEffect(() => {
    const audio = new Audio("/sounds/office-ambience.wav");
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-screen relative">
      {showSplash ? (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      ) : (
        <>
          {/* Boot overlay, bootComplete false iken gösteriliyor */}
          {!bootComplete && (
            <Boot
              sceneLoaded={sceneLoaded}
              onComplete={() => setBootComplete(true)}
            />
          )}
          {/* Canvas her zaman render ediliyor, Boot overlay üstte */}
          <Canvas
            onPointerMissed={() => setDesktopFocus(false)}
            shadows
            dpr={[1, 2]}
            camera={{ near: 4, far: 1000, position: [150, 80, -130], fov: 20 }}
            gl={{
              antialias: true,
              physicallyCorrectLights: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
          >
            <Scene
              desktopFocus={desktopFocus}
              onScenePointerDown={() => setDesktopFocus(false)}
              loading={false}
              setResetCamera={setResetCamera}
              setToComputer={setToComputer}
              setZoomComputer={setZoomComputer}
              setUnZoomComputer={setUnZoomComputer}
              setOfficeAdjuster={setOfficeAdjuster}
              handleHtmlTransformChange={handleHtmlTransformChange}
              onAnimationEnd={(mode) => {
                if (
                  mode === "computer" ||
                  mode === "zoomComputer" ||
                  mode === "unZoomComputer"
                ) {
                  setCameraLocked(true);
                  setShowHtml(true);
                } else if (mode === "reset" || mode === "initialIntro") {
                  setCameraLocked(false);
                  setShowHtml(false);
                }
              }}
              cameraLocked={cameraLocked}
              showHtml={showHtml}
              setDesktopFocus={setDesktopFocus}
              setSceneLoaded={setSceneLoaded}
            />
          </Canvas>
          <div style={{ zIndex: 9999 }}>
            <div className="flex flex-col gap-2 fixed top-0 left-0 m-2 p-2 text-white z-10">
              <a
                href="#_"
                title="Kamerayı sıfırlamak için tıklayın"
                className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 group hover:scale-105 transition-transform duration-300"
                onClick={() => resetCamera && resetCamera()}
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-700 group-hover:w-56 group-hover:h-56"></span>
                <span className="absolute inset-0 w-full h-full -mt-1 opacity-30 bg-gradient-to-b from-transparent to-gray-700"></span>
                <span className="relative">Reset Camera</span>
              </a>
              <div className="flex">
                <a
                  href="#_"
                  title="Bilgisayara odaklanmak için tıklayın"
                  className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 group hover:scale-105 transition-transform duration-300"
                  onClick={() => toComputer && toComputer()}
                >
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-700 group-hover:w-56 group-hover:h-56"></span>
                  <span className="absolute inset-0 w-full h-full -mt-1 opacity-30 bg-gradient-to-b from-transparent to-gray-700"></span>
                  <span className="relative">Set to Computer</span>
                </a>
                <LockButton
                  locked={cameraLocked}
                  onToggle={() => setCameraLocked((prev) => !prev)}
                />
              </div>
              <AudioControls audioRef={audioRef} />
            </div>
          </div>
          {showHtml && (
            <div className="flex flex-col gap-2 fixed top-0 right-0 m-2 p-2 text-white z-10">
              <a
                href="#_"
                title={
                  isZoomed
                    ? "Bilgisayardan uzaklaşmak için tıklayın"
                    : "Bilgisayara yakınlaştırmak için tıklayın"
                }
                className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 group hover:scale-105 transition-transform duration-300"
                onClick={() => {
                  if (!isZoomed) {
                    if (zoomComputer) zoomComputer();
                    setIsZoomed(true);
                  } else {
                    if (unZoomComputer) unZoomComputer();
                    setIsZoomed(false);
                  }
                }}
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-green-700 group-hover:w-56 group-hover:h-56"></span>
                <span className="absolute inset-0 w-full h-full -mt-1 opacity-30 bg-gradient-to-b from-transparent to-gray-700"></span>
                <span className="relative">
                  {isZoomed ? "Unzoom The Computer" : "Zoom The Computer"}
                </span>
              </a>
            </div>
          )}
          {/* Diğer tüm içeriklerin altında, ana container'ın kapanışından hemen önce ekleyin */}
          <div className="fixed bottom-0 left-0 m-2 p-2 text-white z-10">
            <div className="cursor-default select-none relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 group hover:scale-105 transition-transform duration-300">
              <span className="relative">Yigitcan Ucar</span>
            </div>
            <div className="text-xs select-none text-gray-300 font-mono text-center mt-1 cursor-default">
              Cyber Security Developer
            </div>
          </div>
        </>
      )}
    </div>
  );
}
