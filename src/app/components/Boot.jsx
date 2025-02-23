"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";

// Uygulama kökünün Modal için tanımlanması (örneğin Next.js'de #__next olabilir)
if (typeof window !== "undefined") {
  ReactModal.setAppElement(document.body);
}

// 500 adet benzersiz boot mesajı üretmek için yardımcı fonksiyon
function generateBootMessages(num) {
  const baseMessages = [
    "Initializing subsystem",
    "Loading module",
    "Activating service",
    "Calibrating sensors",
    "Configuring hardware",
    "Starting process",
    "Verifying configuration",
    "Synchronizing clocks",
    "Optimizing performance",
    "Checking integrity",
  ];
  const failedCount = 3;
  const warningCount = 8;
  const okCount = 50;
  const indices = [...Array(num).keys()];

  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const failedIndices = new Set(indices.slice(0, failedCount));
  const warningIndices = new Set(indices.slice(failedCount, failedCount + warningCount));
  const okIndices = new Set(
    indices.slice(failedCount + warningCount, failedCount + warningCount + okCount)
  );

  const messages = [];
  for (let i = 0; i < num; i++) {
    const base = baseMessages[Math.floor(Math.random() * baseMessages.length)];
    let msg = "";
    if (failedIndices.has(i)) {
      const percent = Math.floor(Math.random() * 100);
      msg = `[FAILED] ${base}... [ ${percent}% ]`;
    } else if (warningIndices.has(i)) {
      const percent = Math.floor(Math.random() * 100);
      msg = `[WARNING] ${base}... [ ${percent}% ]`;
    } else if (okIndices.has(i)) {
      const percent = Math.floor(Math.random() * 100);
      msg = `[OK] ${base}... [ ${percent}% ]`;
    } else {
      if (Math.random() < 0.3) {
        const percent = Math.floor(Math.random() * 100);
        msg = `${base}... [ ${percent}% ]`;
      } else {
        msg = base;
      }
    }
    messages.push(msg);
  }
  return messages;
}

const rawBootMessages = generateBootMessages(500);

// Her 5 satırdan 1'ini gösterecek şekilde filtreleme (yaklaşık 100 satır)
const displayedMessages = rawBootMessages.filter((_, i) => i % 5 === 0);

const Boot = ({ onComplete, sceneLoaded }) => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const messageIndexRef = useRef(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // Mobil cihaz tespiti
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Mesajların ekrana yazdırılması (80ms aralıkla)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessages((prev) => {
        if (messageIndexRef.current < displayedMessages.length) {
          const newMessage = displayedMessages[messageIndexRef.current];
          messageIndexRef.current += 1;
          return [...prev, newMessage];
        } else {
          clearInterval(intervalRef.current);
          // Tüm mesajlar bittiğinde ve sahne yüklendiyse modalı tetikle
          if (sceneLoaded) {
            setTimeout(() => {
              setShowModal(true);
            }, 500);
          }
          return prev;
        }
      });
    }, 80);

    return () => clearInterval(intervalRef.current);
  }, [sceneLoaded]);

  // Yeni mesaj eklendiğinde container'ı otomatik en alta kaydır
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Sahne yüklendiğinde ve mesajlar bittiğinde modalı aç
  useEffect(() => {
    if (
      messageIndexRef.current >= displayedMessages.length &&
      sceneLoaded &&
      !showModal
    ) {
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }
  }, [sceneLoaded, showModal]);

  // Masaüstü: Enter tuşu, mobil: dokunma ile tetikleme
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMobile && e.key === "Enter" && showModal) {
        onComplete();
      }
    };

    const handleTouch = () => {
      if (isMobile && showModal) {
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [showModal, onComplete, isMobile]);

  // Mesajların başındaki durum etiketlerini renklendiren fonksiyon
  const formatMessage = (msg) => {
    const regex = /^\[(OK|WARNING|FAILED)\]/;
    const match = msg.match(regex);
    if (match) {
      const status = `[${match[1]}]`;
      const rest = msg.slice(status.length);
      let style = "";
      if (status === "[OK]") style = "color:#00ff00;";
      else if (status === "[WARNING]") style = "color:yellow;";
      else if (status === "[FAILED]") style = "color:red;";
      return `<span style="${style}">${status}</span>${rest}`;
    }
    return msg;
  };

  return (
    <>
      {/* Ana siyah ekran ve mesajların bulunduğu container */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          color: "white",
          fontFamily: "monospace",
          padding: "20px",
          overflowY: "hidden",
          whiteSpace: "pre-line",
          zIndex: 50,
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: formatMessage(msg) }}
          />
        ))}
      </div>

      {/* React Modal - Estetik açıdan geliştirilmiş */}
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => {}}
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
        {/* Yanıp sönen metin için CSS keyframes */}
        <style>{`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .blink {
            animation: blink 1s infinite;
          }
        `}</style>
        <h2 className="blink" style={{ margin: 0 }}>
          {isMobile ? "Please Tap on Screen" : "Please Press Enter"}
        </h2>
      </ReactModal>
    </>
  );
};

export default Boot;
