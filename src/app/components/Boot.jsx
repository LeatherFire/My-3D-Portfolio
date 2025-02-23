"use client";
import React, { useEffect, useState } from "react";
import * as THREE from "three";
import ReactModal from "react-modal";

// Uygulamanın kök elemanını belirleyin (örn. Next.js için document.body)
if (typeof window !== "undefined") {
  ReactModal.setAppElement(document.body);
}

const Boot = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  // Yüklenmesi gereken asset’ler – istediğiniz asset’leri buraya ekleyin
  const assets = [
    { name: "Background Image", url: "/photos/background3.jpg", type: "texture" },
    { name: "HDR Environment", url: "/hdr/hdr12.hdr", type: "texture" },
    { name: "Office Ambience", url: "/sounds/office-ambience.wav", type: "audio" },
    // Ek asset’ler eklenebilir…
  ];

  useEffect(() => {
    // Her asset için başlangıç değeri 0
    const initialProgress = {};
    assets.forEach(asset => {
      initialProgress[asset.url] = 0;
    });
    setLoadingProgress(initialProgress);

    // Asset’leri yüklemek için promise’lar oluşturuyoruz
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
          // Ses dosyası için HTMLAudioElement kullanarak oncanplaythrough olayını dinliyoruz.
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

    // Tüm asset’ler yüklendiğinde
    Promise.all(promises).then(() => {
      setAllLoaded(true);
    });
  }, [assets]);

  // Yükleme tamamlandığında, kullanıcı Enter'a veya mobilde dokunduğunda onComplete çağrılır.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && allLoaded) {
        onComplete();
      }
    };
    const handleTouch = () => {
      if (allLoaded) {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouch);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [allLoaded, onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        color: "white",
        fontFamily: "monospace",
        zIndex: 50,
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <h1>Loading Assets</h1>
      <div>
        {assets.map(asset => {
          const progress = loadingProgress[asset.url] || 0;
          return (
            <div key={asset.url} style={{ marginBottom: "20px" }}>
              <div>{asset.name}</div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "#333",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: "#0f0",
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
              <div>{Math.floor(progress)}%</div>
            </div>
          );
        })}
      </div>

      {allLoaded && (
        <ReactModal
          isOpen={true}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
          style={{
            content: {
              backgroundColor: "#333",
              color: "white",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              border: "none",
              borderRadius: "8px",
              padding: "40px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
              fontFamily: "monospace",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              zIndex: 60,
            },
          }}
        >
          <h2 style={{ margin: 0, animation: "blink 1s infinite" }}>
            {window.innerWidth < 768 ? "Please Tap on Screen" : "Please Press Enter"}
          </h2>
          <style>{`
            @keyframes blink {
              0% { opacity: 1; }
              50% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </ReactModal>
      )}
    </div>
  );
};

export default Boot;
