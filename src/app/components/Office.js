"use client";
import React, { useEffect, useState, useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import Desktop from "./Desktop/Desktop";
import Desktop2 from "./Desktop/Desktop2"; // <-- YENİ
import { FaPowerOff } from "react-icons/fa";

export default function Office({
  setOfficeAdjuster,
  onHtmlTransformChange,
  showHtml,
  desktopFocus,
  setDesktopFocus,
  ...props
}) {
  const { nodes, materials } = useGLTF("/models/office_props_pack2.glb");

  // ================= NEW: whichDesktop State ===================
  // "Desktop" veya "Desktop2"
  const [whichDesktop, setWhichDesktop] = useState("Desktop");

  // HTML bileşeninin başlangıç konum/rotasyon değerleri
  const [htmlPosition, setHtmlPosition] = useState([-2.46, -2.84, 4.171]);
  const [buttonPosition, setButtonPosition] = useState([-2.46, -3.34, 4.171]);
  const [htmlRotation, setHtmlRotation] = useState([Math.PI / 2, 2.41, 0]);

  // "Terminal" (Desktop) göster/gizle butonu için local state
  const [desktopVisible, setDesktopVisible] = useState(false);
  const [desktopOpacity, setDesktopOpacity] = useState(0);
  const [shouldRenderDesktop, setShouldRenderDesktop] = useState(false);

  // Kısa power sesini tutan ref
  const audioRef = useRef(null);
  // Sürekli oynayacak static sesini tutan ref
  const staticAudioRef = useRef(null);

  // Butonu kontrol edecek ref
  const buttonRef = useRef(null);

  // Kısa power sesi
  useEffect(() => {
    audioRef.current = new Audio("/sounds/buttonclicktrim.mp3");
  }, []);

  // Desktop görünürlük değişince fade in/out
  useEffect(() => {
    if (desktopVisible) {
      setShouldRenderDesktop(true);
      requestAnimationFrame(() => {
        setDesktopOpacity(1);
      });
    } else {
      setDesktopOpacity(0);
      setTimeout(() => {
        setShouldRenderDesktop(false);
      }, 500);
    }
  }, [desktopVisible]);

  const waterCoolerMaterial = new THREE.MeshStandardMaterial({
    color: "lightblue",
    metalness: 0.9,
    roughness: 0.3,
    envMapIntensity: 3.5,
    transparent: true,
    opacity: 0.8,
  });

  // ================== HTML konum ayarlama fonksiyonu ==================
  const adjustHtml = (posDelta = [0, 0, 0], rotDelta = [0, 0, 0]) => {
    setHtmlPosition((prev) => {
      const newPos = [
        prev[0] + posDelta[0],
        prev[1] + posDelta[1],
        prev[2] + posDelta[2],
      ];
      return newPos;
    });

    setHtmlRotation((prev) => {
      const newRot = [
        prev[0] + rotDelta[0],
        prev[1] + rotDelta[1],
        prev[2] + rotDelta[2],
      ];
      // Parent'e haber ver
      setHtmlPosition((prevPos) => {
        const newerPos = [
          prevPos[0] + posDelta[0],
          prevPos[1] + posDelta[1],
          prevPos[2] + posDelta[2],
        ];
        onHtmlTransformChange?.(newerPos, newRot);
        return newerPos;
      });
      return newRot;
    });
  };

  useEffect(() => {
    if (setOfficeAdjuster) {
      setOfficeAdjuster(() => adjustHtml);
    }
  }, [setOfficeAdjuster]);

  // ================= POWER Butonu Tıklanınca ==================
  const handleButtonClick = () => {
    // 1) Kısa power sesi 
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      audioRef.current.volume = 0.1;
      setTimeout(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }, 300);
    }

    // 2) Desktop'ı göster/gizle
    setDesktopVisible((prev) => !prev);

    // 3) Focus kaldır
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  // ================== "turn desktop" => Desktop2 ==================
  const handleTurnDesktop = () => {
    setWhichDesktop("Desktop2");
  };

  // Klavye event engelleme
  const handleButtonKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Damacana mesh'leri */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_24.geometry}
          material={waterCoolerMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_25.geometry}
          material={waterCoolerMaterial}
        />

        {/* =========== Monitör mesh'i =========== */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_9.geometry}
          material={materials.Monitor}
        >
          {/* 
            showHtml && shouldRenderDesktop => monitör açık 
            Tek bir <Html> içinde hangi masaüstünü göstereceğimize 
            whichDesktop'a bakarak karar veriyoruz.
          */}
          {showHtml && shouldRenderDesktop && (
            <Html
              transform
              zIndexRange={[0, 0]}
              position={htmlPosition}
              rotation={htmlRotation}
              distanceFactor={1}
              style={{
                width: "912px",
                height: "1384px",
                pointerEvents: "auto",
                opacity: desktopOpacity,
                transition: "opacity 2s ease-in-out",
              }}
            >
              {/* Koşullu render: hangi masaüstü? */}
              {whichDesktop === "Desktop" ? (
                <Desktop onCommandTurnDesktop={handleTurnDesktop} onFocusDesktop={() => setDesktopFocus(true)}/>
              ) : (
                <Desktop2 
                onExit={() => setWhichDesktop("Desktop")}
                onFocusDesktop={() => {
                  if (typeof setDesktopFocus === "function") {
                    setDesktopFocus(true);
                  }
                }}/>
              )}
            </Html>
          )}

          {/* =========== Power Butonu =========== */}
          {showHtml && (
            <Html
              transform
              zIndexRange={[1, 1]}
              position={[
                buttonPosition[0] - 0.52,
                buttonPosition[1] + 0.95,
                buttonPosition[2] - 0.01,
              ]}
              rotation={htmlRotation}
              distanceFactor={1}
              style={{
                pointerEvents: "auto",
                zIndex: 9999,
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <button
                ref={buttonRef}
                type="button"
                onClick={handleButtonClick}
                onKeyDown={handleButtonKeyDown}
                style={{
                  backgroundColor: "rgba(130, 130, 130, 0.1)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                <FaPowerOff className="scale-125" />
              </button>
            </Html>
          )}
        </mesh>

        {/* Diğer mesh'ler ... */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_2.geometry}
          material={materials.Big_Wallpaper}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.Cactus}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.Drawer}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.File_Stand}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials.File_Storage}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_7.geometry}
          material={materials.Keyboard}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_8.geometry}
          material={materials.Lamp}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_10.geometry}
          material={materials.material_15}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_11.geometry}
          material={materials.material_16}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_12.geometry}
          material={materials.Pencil}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_13.geometry}
          material={materials.Photo}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_14.geometry}
          material={materials.PinBoard}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_15.geometry}
          material={materials.Shelf01}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_16.geometry}
          material={materials.Shelf02}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_17.geometry}
          material={materials.Shelf03}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_18.geometry}
          material={materials.Stool}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_19.geometry}
          material={materials.Table}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_20.geometry}
          material={materials.Tape}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_21.geometry}
          material={materials.Telephone}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_22.geometry}
          material={materials.Walls}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_23.geometry}
          material={materials.Water_Cooler}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_26.geometry}
          material={materials.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_27.geometry}
          material={materials.File01}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_28.geometry}
          material={materials.File02}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_29.geometry}
          material={materials.File03}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_30.geometry}
          material={materials.File04}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_31.geometry}
          material={materials.File_Stack}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_32.geometry}
          material={materials.Paper01}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_33.geometry}
          material={materials.Paper02}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_34.geometry}
          material={materials.Paper03}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_35.geometry}
          material={materials.Paper_Cup}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_36.geometry}
          material={materials.Paper_Stack}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_37.geometry}
          material={materials.material_24}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/office_props_pack2.glb");
