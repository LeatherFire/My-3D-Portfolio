"use client";
import React, { useState } from "react";

export default function FileManager({
  importantFiles,
  onFileOpen,
  onClose,
  initialCategory = "important",
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [currentFolder, setCurrentFolder] = useState(null);

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2b2b2b",
    padding: "6px 12px",
    color: "#ddd",
    fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
    fontSize: "14px",
  };

  const menuItems = ["File", "Edit", "View", "Go", "Bookmarks", "Help"];
  const breadcrumb = currentFolder
    ? `Home > ${currentFolder.name}`
    : "Home > Desktop";

  const sidebarStyle = {
    width: "180px",
    backgroundColor: "#222",
    color: "#ccc",
    padding: "12px",
    fontSize: "13px",
    fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
  };

  const sidebarItems = [
    { name: "Home" },
    { name: "Desktop" },
    { name: "Documents" },
    { name: "Music" },
    { name: "Pictures" },
    { name: "Videos" },
    { name: "Downloads" },
    { name: "Recent" },
    { name: "File System" },
    { name: "Trash" },
  ];

  const tabBarStyle = {
    display: "flex",
    backgroundColor: "#2a2a2a",
    padding: "6px 12px",
    fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
    fontSize: "14px",
  };

  const tabItemStyle = (cat) => ({
    marginRight: "16px",
    cursor: "pointer",
    paddingBottom: "4px",
    borderBottom: activeCategory === cat ? "2px solid #9ECB6A" : "none",
    textTransform: "capitalize",
    color: activeCategory === cat ? "#9ECB6A" : "#ccc",
  });

  // Eğer currentFolder varsa onun children'ını, yoksa activeCategory'ye göre dosya listesini döndür
  const getFileList = () => {
    if (currentFolder) {
      return currentFolder.children || [];
    }
    if (activeCategory === "trash") {
      return [
        {
          type: "file",
          name: "old_file.txt",
          content: `MISSILE LAUNCH PROTOCOL:
    This document details classified missile launch codes intended for emergency military operations. Each code is generated using advanced cryptographic algorithms and is designed to be activated only under the highest security clearances. The protocol comprises multiple layers of authentication to prevent unauthorized usage. Missile A is designated as FUS-911-BETA-CRYPTOX and must be initiated via secure command channels. Missile B is identified as FUS-314-ALPHA-NETSEC, reserved for rapid countermeasure deployment. Missile C, marked as FUS-007-OMEGA-RED, is engineered for precision targeting in hostile environments. Missile D carries the designation FUS-666-DELTA-VECTOR and serves as a last-resort measure. Each missile code is secured with a unique digital signature and stored in a decentralized, encrypted database. Routine security audits ensure that these protocols remain uncompromised and up-to-date. In case of a breach, an override key labeled OVERRIDE: XCV-47PL-8NMK will immediately disable the system to prevent accidental launch. All personnel are required to maintain absolute secrecy regarding these codes. Unauthorized disclosure will trigger severe countermeasures. The protocol undergoes continuous monitoring and periodic updates to counter evolving cyber threats. Every access attempt is logged and reviewed by security commanders. Redundant encryption layers safeguard each code sequence. Backup communication channels ensure secure code transmission during critical operations. Regular training sessions are held to ensure operational readiness. Strict operational guidelines must be followed at all times. Any deviation from protocol results in immediate revocation of access privileges. Maintain the highest standards of confidentiality.`
        },
        {
          type: "file",
          name: "unused.doc",
          content: `SECRET COUNTRY INTELLIGENCE REPORT:
    This document compiles classified cyber intelligence from various national networks.
    - Turkey: The Turkish cyber defense network employs the SHW-2345 protocol within its closed system for reverse bootstrapping. To breach this system, disable the local firewall and initiate exploit sequence TUX-007.
    - America: The United States secures its internal communications with the USX-908 protocol. Analysts monitor data packets for anomalies to detect breaches.
    - Russia: Russian operatives use the RUS-Delta-42 protocol to continuously monitor and counteract domestic cyber threats.
    - Germany: Germany has implemented the GER-SEC-311 protocol to protect classified transmissions, requiring dual-factor authentication.
    - United Kingdom: The UK network uses the UKN-556 protocol for robust internal segregation of sensitive data.
    - China: Chinese systems operate under the CHN-Blue-19 protocol, which utilizes quantum-resistant encryption for state secrets.
    - France: French cyber units deploy the FR-Guard-88 protocol, involving multi-step verification to prevent espionage.
    - Japan: Japan employs the JPN-99N protocol for advanced threat detection and rapid response.
    Each country’s protocol is integrated into an international intelligence framework. Any attempt to tamper with these systems will trigger immediate countermeasures. Continuous simulations test the system’s resilience. All information remains strictly confidential and accessible only to authorized personnel. This report is updated in real-time and is critical for national security decision-making.`
        },
      ];
    }
    if (activeCategory === "home") {
      return [
        {
          type: "file",
          name: "welcome.txt",
          content: `Welcome!
    I have created an interactive 3D portfolio website that simulates my office environment. When you click on the interface, the camera smoothly zooms in to reveal a desktop HTML simulation of my workspace. This model represents my professional office and provides detailed information about my work and projects. The experience is designed to be both interactive and fun. To learn more about how the system works, please refer to the readme.md file. Enjoy exploring this innovative digital environment!`
        },
        {
          type: "file",
          name: "readme.md",
          content: `Readme:
        In the terminal application, type 'help' to review example commands and their usage instructions.
        Additionally, using the Tor Browser, you can extract secret information by employing the following valid handshake and wordlist combinations:
        - whoami.cap with RockYou (1TB)
        - mywifi.handshake with CrackStation (250MB)
        - evil_twin.pcap with SecLists Top1M (200MB)
        - classified_manifest.doc with PhantomKeys (100MB)
        - shadow_gateway.cap with SpectreCodes (50MB)
        - covert_protocol.handshake with ObscureForum.txt (5MB)
        - compromised_archive.handshake with ShadowCipher.txt (35MB)
        - global_intelligence.cap with DualityDump.txt (18MB)
        - encrypted_chronicle.txt with RapidBypass.txt (1MB)
        These pairs have been verified to yield critical security insights.
        You may also try the simple Paint application or explore the available text editors.
        Remember, this is a simulation—do not expect every feature to work flawlessly.
        For further instructions on how to use the system, please refer to this readme.`
        },
      ];
    }
    if (activeCategory === "important") {
      return importantFiles;
    }
    return [];
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "12px",
    padding: "12px",
    fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
    fontSize: "13px",
    color: "#ccc",
  };

  const gridItemStyle = {
    textAlign: "center",
    cursor: "pointer",
    padding: "8px",
    backgroundColor: "#222",
    borderRadius: "4px",
  };

  const footerStyle = {
    backgroundColor: "#333",
    color: "#aaa",
    padding: "4px 8px",
    fontSize: "12px",
    display: "flex",
    justifyContent: "space-between",
    fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
  };

  // Klasör öğesine çift tıklanırsa navigasyona geçir, dosya ise onFileOpen çağır.
  const handleDoubleClick = (item) => {
    if (item.type === "folder") {
      setCurrentFolder(item);
    } else {
      onFileOpen(item);
    }
  };

  const handleBack = () => {
    setCurrentFolder(null);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#2e2e2e",
      }}
    >
      {/* Üst Menü Çubuğu */}
      <header style={headerStyle}>
        <div style={{ display: "flex", gap: "12px" }}>
          {menuItems.map((item) => (
            <span
              key={item}
              style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#ddd")}
            >
              {item}
            </span>
          ))}
        </div>
        <div>{breadcrumb}</div>
      </header>

      {/* Gezinti ve Araçlar */}
      <nav
        style={{
          backgroundColor: "#222",
          padding: "6px 12px",
          color: "#ccc",
          fontFamily: "DejaVu Sans, Ubuntu, sans-serif",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {currentFolder && (
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
              marginRight: "16px",
            }}
          >
            ← Back
          </button>
        )}
        <span>{breadcrumb}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#ccc",
              cursor: "pointer",
            }}
          >
            🔍
          </button>
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sol Kenar Çubuğu */}
        <aside style={sidebarStyle}>
          <h4 style={{ marginBottom: "8px", color: "#9ECB6A" }}>My Computer</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarItems.map((item, idx) => (
              <li
                key={idx}
                style={{
                  padding: "4px 0",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#333")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {item.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Ana İçerik Alanı */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          {/* Kategori Tab Bar */}
          <div style={tabBarStyle}>
            {["trash", "home", "important"].map((cat) => (
              <div
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentFolder(null);
                }}
                style={tabItemStyle(cat)}
              >
                {cat === "important" ? "Important Files" : cat}
              </div>
            ))}
          </div>
          {/* Dosya Grid */}
          <div style={gridStyle}>
            {getFileList().map((item, idx) => (
              <div
                key={idx}
                style={gridItemStyle}
                onDoubleClick={() => handleDoubleClick(item)}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.type === "folder" ? (
                    <img
                      src={item.icon || "/icons/folder_temp.svg"}
                      alt="Folder"
                      style={{ width: "32px", height: "32px" }}
                    />
                  ) : (
                    <span style={{ fontSize: "32px", color: "#9ECB6A" }}>
                      📄
                    </span>
                  )}
                </div>
                <div className="truncate max-w-[100px] text-center">{item.name}</div>
                </div>
            ))}
          </div>
        </main>
      </div>

      {/* Alt Durum Çubuğu */}
      <footer style={footerStyle}>
        <span>Total Items: {getFileList().length}</span>
        <span>Free space: 28.4 GB</span>
      </footer>
    </div>
  );
}
