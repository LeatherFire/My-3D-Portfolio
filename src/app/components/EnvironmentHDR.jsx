"use client";
import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";

const HDR_Environment = () => {
  const { scene } = useThree();
  useEffect(() => {
    new RGBELoader().load(
      "/hdr/hdr12.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // Sadece environment olarak ata, background'u değiştirme
        scene.environment = texture;
      },
      undefined,
      (err) => {
        console.error("Error loading HDR:", err);
      }
    );
  }, [scene]);
  return null;
};

export default HDR_Environment;
