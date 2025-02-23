"use client";
import React, { useState, useEffect } from "react";
import * as THREE from "three";

const Boot = ({ onComplete }) => {
  // Her asset'in yükleme durumunu takip ediyoruz.
  const [loadingProgress, setLoadingProgress] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  // Yüklenmesi gereken asset'lerin listesi (ihtiyacınıza göre güncelleyebilirsiniz)
  const assets = [
    { name: "Background Image", url: "/photos/background3.jpg", type: "texture" },
    { name: "Office Ambience", url: "/sounds/office-ambience.wav", type: "audio" },
  ];

  useEffect(() => {
    // Başlangıçta tüm asset'lerin progress'ini 0 yapalım
    const initialProgress = {};
    assets.forEach(asset => {
      initialProgress[asset.url] = 0;
    });
    setLoadingProgress(initialProgress);

    // Her asset için uygun loader kullanılarak promise oluşturuluyor.
    const promises = assets.map(asset => {
      if (asset.type === "texture") {
        return new Promise((resolve) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            asset.url,
            (texture) => {
              setLoadingProgress(prev => ({ ...prev, [asset.url]: 100 }));
              resolve(texture);
            },
            (xhr) => {
              if (xhr.total) {
                const progress = (xhr.loaded / xhr.total) * 100;
                setLoadingProgress(prev => ({ ...prev, [asset.url]: progress }));
              }
            },
            (err) => {
              console.error("Error loading texture:", asset.url, err);
              setLoadingProgress(prev => ({ ...prev, [asset.url]: 100 }));
              resolve(null);
            }
          );
        });
      } else if (asset.type === "audio") {
        return new Promise((resolve) => {
          const audio = new Audio();
          audio.src = asset.url;
          audio.oncanplaythrough = () => {
            setLoadingProgress(prev => ({ ...prev, [asset.url]: 100 }));
            resolve(audio);
          };
          audio.onerror = (err) => {
            console.error("Error loading audio:", asset.url, err);
            setLoadingProgress(prev => ({ ...prev, [asset.url]: 100 }));
            resolve(null);
          };
          audio.load();
        });
      } else {
        return Promise.resolve(null);
      }
    });

    // Tüm asset'ler yüklendiğinde sahne otomatik açılıyor.
    Promise.all(promises).then(() => {
      setAllLoaded(true);
      onComplete();
    });
  }, [assets, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        zIndex: 50,
      }}
    >
      <div
        className="spinner"
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #ccc",
          borderTop: "5px solid #0f0",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <div style={{ marginTop: "20px", fontFamily: "monospace", fontSize: "18px" }}>
        Loading...
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Boot;
