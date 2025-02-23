// app/components/Paint.jsx
"use client";
import React, { useRef, useState, useEffect } from "react";

export default function Paint() {
  const canvasRef = useRef(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);

  // DEĞİŞİKLİK: ctx.scale kaldırılarak canvas boyutu ayarlanıyor.
  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    // NOT: ctx.scale(ratio, ratio) artık kullanılmıyor.
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);
    return () => window.removeEventListener("resize", setCanvasSize);
  }, []);

  // EKLENDİ: Canvas iç koordinatlarını doğru hesaplamak için yardımcı fonksiyon
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCanvasCoordinates(e); // DEĞİŞİKLİK: Yeni koordinat hesaplama
    lastX.current = x;
    lastY.current = y;
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const { x, y } = getCanvasCoordinates(e); // DEĞİŞİKLİK: Yeni koordinat hesaplama
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX.current = x;
    lastY.current = y;
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#2c2c2c",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          padding: "10px 15px",
          background: "linear-gradient(90deg, #3a3a3a, #1f1f1f)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setColor("#000000")}
            title="Black"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === "#000000" ? "2px solid #fff" : "2px solid transparent",
              backgroundColor: "#000000",
              cursor: "pointer",
            }}
          ></button>
          <button
            onClick={() => setColor("#ff0000")}
            title="Red"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === "#ff0000" ? "2px solid #fff" : "2px solid transparent",
              backgroundColor: "#ff0000",
              cursor: "pointer",
            }}
          ></button>
          <button
            onClick={() => setColor("#00ff00")}
            title="Green"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === "#00ff00" ? "2px solid #fff" : "2px solid transparent",
              backgroundColor: "#00ff00",
              cursor: "pointer",
            }}
          ></button>
          <button
            onClick={() => setColor("#0000ff")}
            title="Blue"
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: color === "#0000ff" ? "2px solid #fff" : "2px solid transparent",
              backgroundColor: "#0000ff",
              cursor: "pointer",
            }}
          ></button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          <span>Line Width:</span>
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ cursor: "pointer" }}
          />
        </div>
        <button
          onClick={clearCanvas}
          style={{
            padding: "6px 12px",
            background: "#444",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#fff",
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            backgroundColor: "#fff",
            cursor: "crosshair",
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
