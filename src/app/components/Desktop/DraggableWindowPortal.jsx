// app/components/DraggableWindowPortal.jsx
"use client";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function DraggableWindowPortal({ children }) {
  const [portalRoot, setPortalRoot] = useState(null);

  useEffect(() => {
    let element = document.getElementById("portal-root");
    // Eğer yoksa kendimiz oluşturup body'ye ekleyelim.
    if (!element) {
      element = document.createElement("div");
      element.id = "portal-root";
      document.body.appendChild(element);
    }
    setPortalRoot(element);
  }, []);

  if (portalRoot) {
    return ReactDOM.createPortal(children, portalRoot);
  }
  return null;
}
