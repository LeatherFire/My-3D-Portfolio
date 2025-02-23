"use client";
import React, { useState } from "react";
import Cv from "./Cv"; // Cv.jsx dosyasının aynı dizinde olduğunu varsayıyoruz

export default function Firefox() {
  // CV'yi yeniden başlatmak için key değeri
  const [cvKey, setCvKey] = useState(0);

  // En üstte tanımlayın:
const generateRandomOnion = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz234567";
  let domain = "";
  for (let i = 0; i < 50; i++) {
    domain += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `http://${domain}.onion`;
};

  // Adres çubuğu için state; Cv.jsx var ise uygun site ismi
 // address state'ini değiştirin:
const [address, setAddress] = useState(generateRandomOnion());

  // Yenile (⟳) simgesine tıklanınca Cv'yi yeniden başlatır
  function handleRefresh() {
    setCvKey((prev) => prev + 1);
    setAddress(generateRandomOnion());
  }

  return (
    // Ana kapsayıcı: overflow-hidden
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Firefox Pencere Üst Çubuğu */}
      <div className="flex items-center justify-between px-2" style={{ height: "8%" }}>
        <div className="flex items-center space-x-1">
          <img src="/icons/tor_browser.svg" alt="Firefox Logo" className="w-5 h-5" />
          <span className="text-white text-xs">Something found - Tor Browser</span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      {/* Sekme Çubuğu */}
      <div className="flex items-center justify-between px-2" style={{ height: "8%" }}>
        <div className="flex items-center space-x-1">
          <div className="px-2 py-1 bg-[#4b4b4b] border-b-2 border-blue-500 text-white text-xs rounded-t">
            WHOAMI?
          </div>
          <div className="text-white text-lg cursor-pointer">+</div>
        </div>
        <div className="text-white text-lg cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>

      {/* Adres Çubuğu */}
      <div className="flex items-center px-2 space-x-1 bg-[#2b2b2b]" style={{ height: "8%" }}>
        <div className="flex space-x-1">
          <button className="text-white text-xs">←</button>
          <button className="text-white text-xs">→</button>
          {/* Yenile simgesi: büyütüldü */}
          <button className="text-white text-xl" onClick={handleRefresh}>
            ⟳
          </button>
          {/* Home (🏠) simgesi artık hiçbir işlem yapmıyor */}
          <button className="text-white text-xs">🏠</button>
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="flex-grow bg-[#e5e5e5] text-black px-1 py-1 rounded text-xs"
        />
        <div className="flex space-x-1">
          <button className="text-white text-xs">★</button>
          <button className="text-white text-xs">↓</button>
          <button className="text-white text-xs">👤</button>
        </div>
      </div>

      {/* Yer İmleri Çubuğu */}
      <div className="flex items-center space-x-2 px-2 bg-gray-700 text-white text-xs" style={{ height: "6%" }}>
        <a href="#" className="hover:underline">Kali Linux Tools</a>
        <a href="#" className="hover:underline">Kali Training</a>
        <a href="#" className="hover:underline">Kali Forums</a>
        <a href="#" className="hover:underline">NetHunter</a>
        <a href="#" className="hover:underline">Offensive Security</a>
        <a href="#" className="hover:underline">Exploit-DB</a>
        <a href="#" className="hover:underline">GHDB</a>
      </div>

      {/* Ana İçerik: Sadece Cv.jsx */}
      <div className="flex-grow overflow-auto">
        <Cv key={cvKey} />
      </div>
    </div>
  );
}
