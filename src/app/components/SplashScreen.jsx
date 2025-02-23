"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Rastgele karakter üreten yardımcı fonksiyon
function getRandomChar() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ÇĞİÖŞÜçğıöşü!@#$%^&*()-_=+[]{};:'\",.<>/?\\|`~";
  return chars[Math.floor(Math.random() * chars.length)];
}

// İki RGB renk arasında lineer interpolasyon
function lerpColor([r1, g1, b1], [r2, g2, b2], t) {
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Yumuşak geçiş için easeInOutQuad fonksiyonu
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const SplashScreen = ({ onComplete }) => {
  // Durumlar
  const [matrixText, setMatrixText] = useState("");
  const [styleColor, setStyleColor] = useState("rgb(85,85,85)");
  const [languageIndex, setLanguageIndex] = useState(0);

  // Grid ayarları
  const rows = 100;
  const cols = 210;
  const total = rows * cols;

  // Diller
  const languages = [
    "I LOVE YOU SO MUCH BUSE ",
    "TE AMO MUCHO BUSE ",
    "BYUSU DAISUKI DA YO ",
    "JE TAIME TELLEMENT BUSE ",
    "Σ' ΑΓΑΠΏ ΤΌΣΟ ΠΟΛΎ ΜΠΟΎΣΕ ",
    "Я ТЕБЯ ОЧЕНЬ ЛЮБЛЮ BUSE ",
    "EU TE AMO MUITO BUSE ",
    "WO HAO AI NI ",
    "AKU CINTA KAMU SANGAT BUSE ",
    "SENİ ÇOK SEVİYORUM BUSE ",
  ];

  // Ref'ler
  const currentLanguageIndexRef = useRef(0);
  const finalTextRef = useRef("");
  const thresholdsRef = useRef([]);

  // Zamanlama ayarları (ms)
  const cycleDuration = 8000;
  const textRampUpDuration = 5000;
  const textHoldDuration = 1500;
  const textRampDownDuration = 1500;
  const totalTextDuration =
    textRampUpDuration + textHoldDuration + textRampDownDuration;
  const minMix = 0.2; // Ani solmayı önlemek için minimum textMix
  const cycleStartRef = useRef(performance.now());

  // Render döngüsü kaç ms’de bir tekrar edecek
  const updateDelay = 30;

  // Renk ayarları
  const greyColor = [85, 85, 85];
  const pinkColors = [
    [250, 101, 10],
    [226, 240, 13],
    [51, 240, 13],
    [13, 240, 202],
    [13, 151, 240],
    [13, 30, 240],
    [96, 13, 240],
    [213, 13, 240],
    [240, 13, 161],
    [240, 13, 13],
  ];

  // Her döngüde final metni ve eşiklerini hazırlar.
  const initCycle = () => {
    const lang = languages[currentLanguageIndexRef.current];
    const repeated = lang.repeat(Math.ceil(total / lang.length));
    finalTextRef.current = repeated.slice(0, total);
    thresholdsRef.current = Array.from({ length: total }, () => Math.random());
  };

  useEffect(() => {
    // Bu ref/d değişkeni, setTimeout ID’sini tutar ve cleanup’ta iptal ederiz.
    let timeoutId;

    initCycle();

    const update = () => {
      const now = performance.now();
      let elapsedCycle = now - cycleStartRef.current;

      // Döngü süresi dolduğunda bir sonraki dile geç
      if (elapsedCycle >= cycleDuration) {
        cycleStartRef.current += cycleDuration;
        currentLanguageIndexRef.current =
          (currentLanguageIndexRef.current + 1) % languages.length;
        setLanguageIndex(currentLanguageIndexRef.current);
        initCycle();
        elapsedCycle = now - cycleStartRef.current;
      }

      // Metin morph: ramp up, hold, ramp down
      let textMix;
      if (elapsedCycle < textRampUpDuration) {
        const ratio = elapsedCycle / textRampUpDuration;
        textMix = minMix + (1 - minMix) * ratio;
      } else if (elapsedCycle < textRampUpDuration + textHoldDuration) {
        textMix = 1;
      } else if (elapsedCycle < totalTextDuration) {
        const ratio =
          (elapsedCycle - (textRampUpDuration + textHoldDuration)) /
          textRampDownDuration;
        textMix = 1 - (1 - minMix) * ratio;
      } else {
        textMix = minMix;
      }
      textMix = Math.max(minMix, Math.min(textMix, 1));

      // Easing uygulanarak daha yumuşak geçiş sağlanıyor.
      const easedMix = easeInOutQuad(textMix);

      // Her hücre için final veya random karakter seçimi:
      let output = "";
      for (let i = 0; i < total; i++) {
        const finalChar = finalTextRef.current[i];
        const randomChar = getRandomChar();
        const char =
          easedMix >= thresholdsRef.current[i] ? finalChar : randomChar;
        output += char;
        if ((i + 1) % cols === 0) {
          output += "\n";
        }
      }

      // Renk geçişi: gri'den ilgili pembe tonuna.
      const currentLangIndex = currentLanguageIndexRef.current;
      const pinkColor = pinkColors[currentLangIndex] || [233, 30, 99];
      const currentColor = lerpColor(greyColor, pinkColor, easedMix);

      setStyleColor(currentColor);
      setMatrixText(output);

      // Tekrar çağır
      timeoutId = setTimeout(update, updateDelay);
    };

    // Döngüyü başlat
    update();

    // Cleanup: Bileşen unmount olduğunda setTimeout’ı iptal ediyoruz
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      <div className="absolute inset-0 bg-black overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ y: ["0%", "-100%"] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <pre
              className="font-mono text-[12px] leading-[12px] m-0 p-0 whitespace-pre block"
              style={{
                fontFamily: "'Noto Sans Mono', monospace",
                color: styleColor,
              }}
            >
              {matrixText}
            </pre>
            <pre
              className="font-mono text-[12px] leading-[12px] m-0 p-0 whitespace-pre block"
              style={{
                fontFamily: "'Noto Sans Mono', monospace",
                color: styleColor,
              }}
            >
              {matrixText}
            </pre>
            <pre
              className="font-mono text-[12px] leading-[12px] m-0 p-0 whitespace-pre block"
              style={{
                fontFamily: "'Noto Sans Mono', monospace",
                color: styleColor,
              }}
            >
              {matrixText}
            </pre>
          </motion.div>
        </div>

        {/* Geliştirilmiş Start Butonu */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.button
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors duration-300"
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start
          </motion.button>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default SplashScreen;
