"use client";

import React, { useState, useEffect, useRef } from "react";
// Harici JSON dosyasındaki simülasyon verilerini içe aktarıyoruz:
import simulationData from "./simulationData.json";

export default function Cv() {
  // Stage: 1 = panel, 2 = brute force, 3 = profile
  const [stage, setStage] = useState(1);



  // Brute force “aircrack” benzeri statik bloğun güncel verileri
  const [currentAircrackState, setCurrentAircrackState] = useState({
    timeStr: "",
    keysTested: 0,
    speed: "",
    passphrase: "",
    masterKey: "",
    transientKey: "",
  });

  // Log satırları
  const [aircrackLogs, setAircrackLogs] = useState([]);
  // Logs div için ref (otomatik scroll)
  const logsContainerRef = useRef(null);

  // Profilin satır satır gösterimi
  const [displayedProfile, setDisplayedProfile] = useState("");

  // Profil yazımının başlatıldığını kontrol etmek için ref
  const typingStartedRef = useRef(false);

  // Handshake & Wordlist örnekleri
  const handshakeOptions = [                // Değişmedi
    "mywifi.handshake",            // Değişmedi
    "classified_manifest.doc",     // Gizli belgeler, derin bilgiler çağrıştırır
    "shadow_gateway.cap",          // Karanlık ağ geçidi, siber dünyanın gizemini yansıtır
    "evil_twin.pcap",              // Değişmedi
    "covert_protocol.handshake",
    "whoami.cap",   // Gizli protokoller, operasyonel sırlar ima eder
    "compromised_archive.handshake",// Ele geçirilmiş arşiv, derin bilgi ve şifreler
    "global_intelligence.cap",     // Küresel istihbarat, ülke bilgileri ve stratejik veriler
    "encrypted_chronicle.txt"      // Şifrelenmiş kronik, uzun süreli ve önemli belgeler
  ];
  
  const wordlistOptions = [ // Değişmedi
    "CrackStation (250MB)", // Değişmedi
    "PhantomKeys (100MB)",          // WeakPass_1 yerine
    "SpectreCodes (50MB)",          // WeakPass_2 yerine
    "ObscureForum.txt (5MB)",       // phpbb.txt yerine
    "StealthWPA.txt (2MB)",         // wpa-lowercase.txt yerine
    "RapidBypass.txt (1MB)",        // Fasttrack.txt yerine
    "ShadowCipher.txt (35MB)",      // Darkc0de.txt yerine
    "DualityDump.txt (18MB)",       // Cain_and_Abel.txt yerine
    "ReconBlueprint.lst (100KB)",   // nmap.lst yerine
    "ExploitsManifest.wordlist (450KB)",
    "RockYou (1TB)", // metasploit.wordlist yerine
    "SecLists Top1M (200MB)",       // Değişmedi
    "SpectralCandidates (16MB)"     // ProbableWordlists yerine
  ];

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const [selectedHandshake, setSelectedHandshake] = useState(getRandomItem(handshakeOptions));
const [selectedWordlist, setSelectedWordlist] = useState(getRandomItem(wordlistOptions));

  

  /**
   * STAGE 2: Brute force benzeri “aircrack-ng” animasyonu
   * - Her 50 ms’de güncelleme (20 adım/saniye)
   * - Toplam 25 sn => 500 adım
   */
  useEffect(() => {
    if (stage === 2) {
      let timeElapsed = 0;
      let totalKeysTested = 0;

      const randomLogPhrases = [
        "Verifying handshake...",
        "Handshake found, starting dictionary attack...",
        "Deauth frames sent to target...",
        "Capturing WPA handshake packets...",
        "Analyzing IVs...",
        "Reading wordlist entries...",
        "Attempting next passphrase...",
        "Injecting ARP requests...",
        "Sniffing EAPOL packets...",
        "WPA handshake validated...",
      ];

      const interval = setInterval(() => {
        timeElapsed++;
        const realSeconds = timeElapsed * 0.05;

        // Rastgele 12 karakterlik passphrase oluştur
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
        let passphrase = "";
        for (let i = 0; i < 12; i++) {
          passphrase += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Rastgele 16 adet hex değerden master/transient key üretimi
        const randomHexPairs = (count) => {
          let line = "";
          for (let i = 0; i < count; i++) {
            const hex = Math.floor(Math.random() * 256)
              .toString(16)
              .toUpperCase()
              .padStart(2, "0");
            line += hex + " ";
          }
          return line.trim();
        };

        const minutes = String(Math.floor(realSeconds / 60)).padStart(2, "0");
        const seconds = String(Math.floor(realSeconds % 60)).padStart(2, "0");

        const increment = Math.floor(12000 + Math.random() * 18000);
        totalKeysTested += increment;
        const speed = (increment / 1000).toFixed(2);

        setCurrentAircrackState({
          timeStr: `[00:${minutes}:${seconds}] ${totalKeysTested} keys tested (${speed} k/s)`,
          keysTested: totalKeysTested,
          speed: speed,
          passphrase,
          masterKey: randomHexPairs(16),
          transientKey: randomHexPairs(16),
        });

        const randomPhrase =
          randomLogPhrases[Math.floor(Math.random() * randomLogPhrases.length)];
        setAircrackLogs((prev) => [
          ...prev,
          `+${realSeconds.toFixed(2)}s: ${randomPhrase}`,
        ]);

        if (timeElapsed >= 500) {
          clearInterval(interval);
          setStage(3);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [stage]);

  /**
   * Logs her değiştiğinde scroll'u en alta ayarla.
   */
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [aircrackLogs]);

  /**
   * STAGE 3: Profilin satır satır yazımını, rekürsif setTimeout ile gerçekleştir.
   * Böylece Strict Mode'da oluşabilecek çakışmalar önlenir.
   */
  useEffect(() => {
    if (stage === 3 && !typingStartedRef.current) {
      typingStartedRef.current = true;
  
      let selectedProfileText;
      if (
        selectedHandshake === simulationData.cv.handshake &&
        selectedWordlist === simulationData.cv.wordlist
      ) {
        selectedProfileText = simulationData.cv.content;
      } else if (
        selectedHandshake === simulationData.wifi.handshake &&
        selectedWordlist === simulationData.wifi.wordlist
      ) {
        selectedProfileText = simulationData.wifi.content;
      } else if (
        selectedHandshake === simulationData.deepweb.handshake &&
        selectedWordlist === simulationData.deepweb.wordlist
      ) {
        selectedProfileText = simulationData.deepweb.content;
      } else if (
        selectedHandshake === simulationData.classified.handshake &&
        selectedWordlist === simulationData.classified.wordlist
      ) {
        selectedProfileText = simulationData.classified.content;
      } else if (
        selectedHandshake === simulationData.shadow.handshake &&
        selectedWordlist === simulationData.shadow.wordlist
      ) {
        selectedProfileText = simulationData.shadow.content;
      } else if (
        selectedHandshake === simulationData.covert.handshake &&
        selectedWordlist === simulationData.covert.wordlist
      ) {
        selectedProfileText = simulationData.covert.content;
      } else if (
        selectedHandshake === simulationData.compromised.handshake &&
        selectedWordlist === simulationData.compromised.wordlist
      ) {
        selectedProfileText = simulationData.compromised.content;
      } else if (
        selectedHandshake === simulationData.global.handshake &&
        selectedWordlist === simulationData.global.wordlist
      ) {
        selectedProfileText = simulationData.global.content;
      } else if (
        selectedHandshake === simulationData.encrypted.handshake &&
        selectedWordlist === simulationData.encrypted.wordlist
      ) {
        selectedProfileText = simulationData.encrypted.content;
      } else {
        selectedProfileText = simulationData.default.content;
      }
  
      const lines = selectedProfileText.split("\n");
      setDisplayedProfile("");
  
      const typeLine = (index) => {
        if (index < lines.length) {
          setDisplayedProfile((prev) => prev + lines[index] + "\n");
          setTimeout(() => typeLine(index + 1), 400);
        }
      };
  
      typeLine(0);
    }
  }, [stage, selectedHandshake, selectedWordlist]);
  

  return (
    <div className="bg-black text-green-400 p-6 font-mono min-h-screen relative">
      {/* STAGE 1: Panel */}
      {stage === 1 && (
        <div className="panel max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">BRUTEFORCE ATTACK</h1>
          {/* Handshake Seçimi */}
          <div className="mb-4">
            <label className="mr-2 font-semibold">Select Handshake File:</label>
            <select
              value={selectedHandshake}
              onChange={(e) => setSelectedHandshake(e.target.value)}
              className="bg-black border border-green-600 text-green-400 px-2 py-1"
            >
              {handshakeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* Wordlist Seçimi */}
          <div className="mb-6">
            <label className="mr-2 font-semibold">Select Wordlist:</label>
            <select
              value={selectedWordlist}
              onChange={(e) => setSelectedWordlist(e.target.value)}
              className="bg-black border border-green-600 text-green-400 px-2 py-1"
            >
              {wordlistOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-green-600 hover:bg-green-700 text-black px-6 py-2"
            onClick={() => {
              // Reset: typingStartedRef'i sıfırlıyoruz ve stage'i 2'ye çekiyoruz
              typingStartedRef.current = false;
              setStage(2);
            }}
          >
            START
          </button>
        </div>
      )}

      {/* STAGE 2: Brute force simülasyonu */}
      {stage === 2 && (
        <div className="border border-green-400 p-4 mb-4 bg-black h-96 overflow-auto">
          <pre className="text-sm mb-4">
            Aircrack-ng 1.6{"\n"}
            Handshake File: {selectedHandshake}
            {"\n"}Wordlist: {selectedWordlist}
            {"\n\n"}
            {currentAircrackState.timeStr}
            {"\n"}Current passphrase: {currentAircrackState.passphrase}
            {"\n"}
            {"\n"}Master Key     : {currentAircrackState.masterKey}
            {"\n"}Transient Key : {currentAircrackState.transientKey}
          </pre>
          <div
            className="logs-container border-t border-green-600 pt-2 mt-2 h-32 overflow-y-auto"
            ref={logsContainerRef}
          >
            <p className="font-bold">Logs:</p>
            <pre className="text-xs">
              {aircrackLogs.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </pre>
          </div>
          <p className="mt-4">Brute force attack in progress...</p>
        </div>
      )}

      {/* STAGE 3: Profil gösterimi */}
      {stage === 3 && (
  <div
    className="fade-in border border-green-400 p-4 bg-black"
    style={{ position: "relative", height: "100%" }}
  >
    <div
      style={{
        maxHeight: "calc(100% - 40px)",
        overflowY: "auto",
        paddingBottom: "40px",
      }}
    >
      <pre>{displayedProfile}</pre>
    </div>
    {selectedHandshake === simulationData.cv.handshake &&
      selectedWordlist === simulationData.cv.wordlist && (
        <span
          className="blinking"
          onClick={() => window.open("/pdfs/CVENG.PDF", "_blank")}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            color: "yellow",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          (PDF FOUND)
        </span>
      )}
  </div>
)}



      <style jsx>{`
        .panel select {
          outline: none;
        }
        pre {
          white-space: pre-wrap;
          font-family: "Source Code Pro", monospace;
        }
        .fade-in {
          animation: fadeIn 1s forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      <style jsx>{`
  .panel select {
    outline: none;
  }
  pre {
    white-space: pre-wrap;
    font-family: "Source Code Pro", monospace;
  }
  .fade-in {
    animation: fadeIn 1s forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .blinking {
    animation: blinkingText 1.5s infinite;
    color: yellow;
    font-weight: bold;
  }
  @keyframes blinkingText {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`}</style>

    </div>
  );
}
