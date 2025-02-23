"use client";
import React, { useState, useEffect } from "react";
import * as THREE from "three";
import ReactModal from "react-modal";

// Uygulamanın kök elemanını belirleyin (örn. Next.js için document.body)
if (typeof window !== "undefined") {
  ReactModal.setAppElement(document.body);
}

const Boot = ({ onComplete, sceneLoaded }) => {
  const [overallProgress, setOverallProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  // Yüklenmesi gereken varlıklar (assets) listesi – burada ihtiyaç duyduğunuz varlıkları ekleyebilirsiniz
  const assets = [
    { name: "Background Image", url: "/photos/background3.jpg" },
    { name: "HDR Environment", url: "/hdr/hdr12.hdr" },
    { name: "Office Ambience", url: "/sounds/office-ambience.wav" },
    // Ek varlıklar ekleyebilirsiniz...
  ];

  // Genel yükleme ilerlemesini, varlıkların eşit ağırlıkta olduğunu varsayarak, parçalara bölüyoruz.
  const getAssetProgress = (index) => {
    const segment = 100 / assets.length;
    const lower = index * segment;
    const upper = (index + 1) * segment;
    if (overallProgress >= upper) return 100;
    if (overallProgress <= lower) return 0;
    return ((overallProgress - lower) / segment) * 100;
  };

  // THREE.DefaultLoadingManager’a bağlı olarak ilerlemeyi güncelle
  useEffect(() => {
    const manager = THREE.DefaultLoadingManager;

    const updateProgress = () => {
      if (manager.itemsTotal > 0) {
        const prog = (manager.loaded / manager.itemsTotal) * 100;
        setOverallProgress(prog);
        if (prog >= 100) {
          setAllLoaded(true);
        }
      } else {
        // Hiçbir varlık yüklenmiyorsa bile %100 kabul et (örneğin, sahne render edildiğinde)
        setOverallProgress(100);
        setAllLoaded(true);
      }
    };

    manager.onProgress = (url, loaded, total) => {
      updateProgress();
    };

    manager.onLoad = () => {
      updateProgress();
    };

    // Mount esnasında bir kez güncelleme yapalım
    updateProgress();

    // Cleanup – manager’ın callback’lerini temizliyoruz (diğer loader’larınız varsa dikkatli olun)
    return () => {
      manager.onProgress = null;
      manager.onLoad = null;
    };
  }, []);

  // Yükleme tamamlandığında (allLoaded true olduğunda) Enter ya da dokunma ile onComplete çağrılıyor
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
        {assets.map((asset, index) => {
          const progress = getAssetProgress(index);
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
          <h2
            className="blink"
            style={{ margin: 0, animation: "blink 1s infinite" }}
          >
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
