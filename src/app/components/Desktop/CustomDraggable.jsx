// app/components/CustomDraggable.jsx
"use client";
import React, { useState } from "react";

export default function CustomDraggable({ children, dragHandleClass = "", style, ...rest }) {
  const [position, setPosition] = useState({ x: 120, y: 80 });
  
  // Mousedown anında, tıklama noktasının pencere içindeki offset'ini hesaplayacağız.
  const handleMouseDown = (e) => {
    // Eğer dragHandleClass belirtilmişse, sadece o alandan sürüklemeyi aktif edelim.
    if (dragHandleClass && !e.target.classList.contains(dragHandleClass)) return;

    // Tarayıcı davranışlarını engellemek için
    e.preventDefault();

    // e.currentTarget, onMouseDown eventinin atandığı elemandır.
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    // Mouse hareketi esnasında, pencerenin konumunu imlecin konumuna göre ayarla:
    const handleMouseMove = (moveEvent) => {
      // Yeni pozisyon, fare imlecinin konumundan offset çıkarılarak hesaplanır.
      const newX = moveEvent.clientX - offsetX - 520;
      const newY = moveEvent.clientY - offsetY - 233;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
