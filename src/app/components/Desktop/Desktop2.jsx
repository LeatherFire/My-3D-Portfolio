"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { LuEthernetPort } from "react-icons/lu";
import { RxExit } from "react-icons/rx";

// Draggable/Resizable => custom "Window" bileşenimiz
import Window from "./Window";
// File Manager bileşeni (gelişmiş kategori desteği eklenmiş versiyon)
import FileManager from "./FileManager";
// Yeni: Terminal bileşeni
import Terminal from "./Terminal";
// Yeni: Paint bileşeni
import Paint from "./Paint";

// YENİ: Firefox bileşeni
import Firefox from "./Firefox";

// Basit benzersiz id oluşturma fonksiyonu
const generateId = () => "id-" + new Date().getTime();

export default function Desktop2({ onFocusDesktop, onExit }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const [submenuOpen, setSubmenuOpen] = useState(false);

  // Pencere state'leri
  const [fileManagerWindowOpen, setFileManagerWindowOpen] = useState(false);
  const [editorWindows, setEditorWindows] = useState([]); // { id, name, content }
  const [terminalWindowOpen, setTerminalWindowOpen] = useState(false);
  const [paintWindowOpen, setPaintWindowOpen] = useState(false);

  // YENİ: Firefox penceresi state
  const [firefoxWindowOpen, setFirefoxWindowOpen] = useState(false);

  const [windowOrder, setWindowOrder] = useState([]);

  // Önemli dosyalar; cv.txt'nin yanında iki klasör (handshakes ve wordlists) olacak.
  const [importantFiles, setImportantFiles] = useState([
    {
      type: "file",
      name: "cv.txt",
      content: `Yiğitcan Ucar
    Computer Engineer & Cybersecurity Enthusiast
    
    Email: ucar.yigitcan2003@gmail.com
    Phone: +90-505-007-4569
    Website: yigitcan-ucar.vercel.app
    LinkedIn: linkedin.com/in/leatherfire
    GitHub: github.com/LeatherFire
    
    Summary:
    Highly motivated and top-ranked Computer Engineering student with a passion for cybersecurity, artificial intelligence, and system administration. Experienced in building scalable web applications and innovative IoT solutions through academic and internship projects.
    
    Experience:
    - Red Team Member Intern at Jotform, San Francisco (Aug 2024 – Sept 2024): Led simulated cyberattacks and implemented defensive strategies.
    - Academic Projects: Designed and implemented a variety of cutting-edge projects during university studies.
    
    Projects:
    - Cyber Defense Simulator: Created a simulation platform using Python scripts to test network vulnerabilities with real-world hacking tools.
    - IoT Drone Automation: Developed an autonomous drone control system with Arduino and Raspberry Pi, integrating real-time analytics for optimal flight performance.
    - AI-Powered Image Processing: Designed and deployed machine learning models to enhance digital image quality and predictive analysis capabilities.
    - MERN Stack E-commerce Platform: Led a team to build a robust and scalable e-commerce application using React, Node.js, and MongoDB, with a strong emphasis on security and performance.
    
    Education:
    Süleyman Demirel University, Isparta, Turkey (2021 - ongoing, AGNO 3.70)
    Recep Gungor Anadolu High School, Buyukcekmece/Istanbul (2017-2021) – Top-ranked student
    
    Skills:
    Python, C, JavaScript, Java, C#, SQL, Bash/Shell, R, Arduino, Swift, Ruby, Assembly
    Cybersecurity, Artificial Intelligence, Machine Learning, Data Engineering & Big Data, System Administration, Drone/Arduino Programming, iOS Development
    
    Interests:
    Open-source projects, Cybersecurity research, Drone technology, AI innovations, Tech Blogging, Continuous learning
    
    [END OF TRANSMISSION]`
    },    
    {
      type: "folder",
      name: "handshakes",
      icon: "/icons/folder-private.svg",
      children: [
        {
          type: "file",
          name: "whoami.cap",
          fileUrl: "/texts/whoami.txt",
        },
        {
          type: "file",
          name: "mywifi.handshake",
          fileUrl: "/texts/mywifi.txt",
        },
        {
          type: "file",
          name: "classified_manifest.doc",
          fileUrl: "/texts/classified_manifest.txt",
        },
        {
          type: "file",
          name: "shadow_gateway.cap",
          fileUrl: "/texts/shadow_gateway.txt",
        },
        {
          type: "file",
          name: "evil_twin.pcap",
          fileUrl: "/texts/evil_twin.txt",
        },
        {
          type: "file",
          name: "covert_protocol.handshake",
          fileUrl: "/texts/covert_protocol.txt",
        },
        {
          type: "file",
          name: "compromised_archive.handshake",
          fileUrl: "/texts/compromised_archive.txt",
        },
        {
          type: "file",
          name: "global_intelligence.cap",
          fileUrl: "/texts/global_intelligence.txt",
        },
        {
          type: "file",
          name: "encrypted_chronicle.txt",
          fileUrl: "/texts/encrypted_chronicle.txt",
        },
      ],
    },
    {
      type: "folder",
      name: "wordlists",
      icon: "/icons/folder-private.svg",
      children: [
        {
          type: "file",
          name: "RockYou (1TB)",
          fileUrl: "/texts/RockYou.txt",
        },
        {
          type: "file",
          name: "CrackStation (250MB)",
          fileUrl: "/texts/CrackStation.txt",
        },
        {
          type: "file",
          name: "PhantomKeys (100MB)",
          fileUrl: "/texts/PhantomKeys.txt",
        },
        {
          type: "file",
          name: "SpectreCodes (50MB)",
          fileUrl: "/texts/SpectreCodes.txt",
        },
        {
          type: "file",
          name: "ObscureForum.txt (5MB)",
          fileUrl: "/texts/ObscureForum.txt",
        },
        {
          type: "file",
          name: "StealthWPA.txt (2MB)",
          fileUrl: "/texts/StealthWPA.txt",
        },
        {
          type: "file",
          name: "RapidBypass.txt (1MB)",
          fileUrl: "/texts/RapidBypass.txt",
        },
        {
          type: "file",
          name: "ShadowCipher.txt (35MB)",
          fileUrl: "/texts/ShadowCipher.txt",
        },
        {
          type: "file",
          name: "DualityDump.txt (18MB)",
          fileUrl: "/texts/DualityDump.txt",
        },
        {
          type: "file",
          name: "ReconBlueprint.lst (100KB)",
          fileUrl: "/texts/ReconBlueprint.txt",
        },
        {
          type: "file",
          name: "ExploitsManifest.wordlist (450KB)",
          fileUrl: "/texts/ExploitsManifest.txt",
        },
        {
          type: "file",
          name: "SecLists Top1M (200MB)",
          fileUrl: "/texts/SecLists.txt",
        },
        {
          type: "file",
          name: "SpectralCandidates (16MB)",
          fileUrl: "/texts/SpectralCandidates.txt",
        },
      ],
    },
  ]);

  useEffect(() => {
    async function fetchFileContents(files) {
      return Promise.all(
        files.map(async (file) => {
          if (file.type === "file" && file.fileUrl) {
            try {
              const res = await fetch(file.fileUrl);
              const text = await res.text();
              return { ...file, content: text };
            } catch (error) {
              console.error("Error loading file", file.name, error);
              return file;
            }
          } else if (file.type === "folder" && file.children) {
            return { ...file, children: await fetchFileContents(file.children) };
          }
          return file;
        })
      );
    }
    fetchFileContents(importantFiles).then((updatedFiles) => {
      setImportantFiles(updatedFiles);
    });
  }, []);
  

  // Gerçek zamanlı saat
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Dosyalar açılırken hangi kategori -> file manager
  const [fileManagerCategory, setFileManagerCategory] = useState("important");

  // Mouse click sesi
  const clickSoundRef = useRef(null);
  const [halfDuration, setHalfDuration] = useState(null);
  const halfTimeoutRef = useRef(null);
  useEffect(() => {
    clickSoundRef.current = new Audio("/sounds/mouse-click.mp3");
    clickSoundRef.current.volume = 0.75;
    clickSoundRef.current.addEventListener("loadedmetadata", () => {
      setHalfDuration(clickSoundRef.current.duration / 11);
    });
  }, []);
  const handleMouseDown = () => {
    if (clickSoundRef.current && halfDuration) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play();
      halfTimeoutRef.current = setTimeout(() => {
        if (clickSoundRef.current) {
          clickSoundRef.current.pause();
        }
      }, halfDuration * 1000);
    }
  };
  const handleMouseUp = () => {
    if (clickSoundRef.current && halfDuration) {
      clearTimeout(halfTimeoutRef.current);
      clickSoundRef.current.pause();
      clickSoundRef.current.currentTime = halfDuration;
      clickSoundRef.current.play();
    }
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
  };
  const handleIconClick = (e, iconName) => {
    e.stopPropagation();
    setSelectedIcon(iconName);
  };
  const handleIconDoubleClick = (iconName) => {
    if (iconName === "filesystem") return;
    if (
      iconName === "trash" ||
      iconName === "home" ||
      iconName === "important"
    ) {
      setFileManagerCategory(iconName);
      if (!fileManagerWindowOpen) {
        setFileManagerWindowOpen(true);
        setWindowOrder((prev) =>
          prev.includes("fm") ? prev : [...prev, "fm"]
        );
      } else {
        bringWindowToFront("fm");
      }
    }
    if (iconName === "terminal") {
      if (!terminalWindowOpen) {
        setTerminalWindowOpen(true);
        setWindowOrder((prev) =>
          prev.includes("term") ? prev : [...prev, "term"]
        );
      } else {
        bringWindowToFront("term");
      }
    }
    if (iconName === "paint") {
      if (!paintWindowOpen) {
        setPaintWindowOpen(true);
        setWindowOrder((prev) =>
          prev.includes("paint") ? prev : [...prev, "paint"]
        );
      } else {
        bringWindowToFront("paint");
      }
    }
  };

  // FileManager üzerinden dosya açma işlemi
  const handleFileOpen = (file) => {
    // Eğer açılacak öğe dosya ise text editörü aç
    if (file.type === "file") {
      const newId = generateId();
      const newEditor = { id: newId, name: file.name, content: file.content };
      setEditorWindows((prev) => [...prev, newEditor]);
      setWindowOrder((prev) => [...prev, newId]);
    }
  };

  const handleEditorSave = (newContent, windowId) => {
    setEditorWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, content: newContent } : w))
    );
  };

  const bringWindowToFront = (windowId) => {
    setWindowOrder((prev) => {
      const filtered = prev.filter((id) => id !== windowId);
      return [...filtered, windowId];
    });
  };
  const getZIndex = (windowId) => {
    const index = windowOrder.indexOf(windowId);
    return 100 + index;
  };
  const closeFileManagerWindow = () => {
    setFileManagerWindowOpen(false);
    setWindowOrder((prev) => prev.filter((id) => id !== "fm"));
  };
  const closeTerminalWindow = () => {
    setTerminalWindowOpen(false);
    setWindowOrder((prev) => prev.filter((id) => id !== "term"));
  };
  const closePaintWindow = () => {
    setPaintWindowOpen(false);
    setWindowOrder((prev) => prev.filter((id) => id !== "paint"));
  };
  const closeFirefoxWindow = () => {
    setFirefoxWindowOpen(false);
    setWindowOrder((prev) => prev.filter((id) => id !== "firefox"));
  };
  const closeEditorWindow = (windowId) => {
    setEditorWindows((prev) => prev.filter((w) => w.id !== windowId));
    setWindowOrder((prev) => prev.filter((id) => id !== windowId));
  };

  const handleTopBarIconClick = (iconName) => {
    if (iconName === "filesystem") {
      setFileManagerCategory("home");
      if (!fileManagerWindowOpen) {
        setFileManagerWindowOpen(true);
        setWindowOrder((prev) =>
          prev.includes("fm") ? prev : [...prev, "fm"]
        );
      } else {
        bringWindowToFront("fm");
      }
    } else if (iconName === "firefox") {
      if (!firefoxWindowOpen) {
        setFirefoxWindowOpen(true);
        setWindowOrder((prev) =>
          prev.includes("firefox") ? prev : [...prev, "firefox"]
        );
      } else {
        bringWindowToFront("firefox");
      }
    } else {
      handleIconDoubleClick(iconName);
    }
  };

  const openEmptyEditor = () => {
    const newId = generateId();
    const newEditor = { id: newId, name: "Untitled.txt", content: "" };
    setEditorWindows((prev) => [...prev, newEditor]);
    setWindowOrder((prev) => [...prev, newId]);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: "705px",
        height: "584px",
        borderRadius: "6px",
        boxShadow: "0 0 20px rgba(5, 16, 220, 0.5)",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onFocusDesktop && onFocusDesktop();
        handleDesktopClick();
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div
        className="select-none"
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: 'url("/photos/kali-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#fff",
          fontFamily: "'Verdana', sans-serif",
        }}
      >
        {/* Üst Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 34,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            backdropFilter: "blur(1px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/icons/kali-panel-menu.svg"
              onClick={(e) => {
                e.stopPropagation();
                setIsStartMenuOpen((prev) => !prev);
              }}
              style={{
                width: 23,
                height: 23,
                cursor: "pointer",
                marginRight: 6,
              }}
            />
            <div
              style={{
                width: 1,
                height: 22,
                backgroundColor: "#fff",
                margin: "0 8px",
              }}
            />
            <img
              src="/icons/user-desktop.svg"
              alt="Desktop Icon"
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
                cursor: "pointer",
              }}
            />

            <img
              src="/icons/system-file-manager.svg"
              alt="File Manager"
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTopBarIconClick("filesystem");
              }}
            />

            <img
              src="/icons/accessories-text-editor.svg"
              alt="Text Editor"
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                openEmptyEditor();
              }}
            />

            {/* YENİ: Firefox ikonu */}
            <img
              src="/icons/tor_browser.svg"
              alt="firefox"
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTopBarIconClick("firefox");
              }}
            />

            <img
              src="/icons/libreoffice-main.svg"
              alt="Libreoffice"
              style={{
                width: 22,
                height: 22,
                marginRight: 8,
                cursor: "pointer",
              }}
            />
            <img
              src="/icons/utilities-terminal.svg"
              alt="Terminal"
              style={{
                width: 22,
                height: 22,
                marginRight: 2,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTopBarIconClick("terminal");
              }}
            />

            <MdKeyboardArrowDown />
            <div
              style={{
                width: 1,
                height: 22,
                backgroundColor: "#fff",
                margin: "0 5px",
              }}
            />
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <span style={{ fontSize: 14, cursor: "pointer", marginLeft: 10 }}>
                1
              </span>
              <span style={{ fontSize: 14, cursor: "pointer", opacity: 0.6 }}>
                2
              </span>
              <span style={{ fontSize: 14, cursor: "pointer", opacity: 0.6 }}>
                3
              </span>
              <span style={{ fontSize: 14, cursor: "pointer", opacity: 0.6 }}>
                4
              </span>
            </div>
            <div
              style={{
                width: 1,
                height: 22,
                backgroundColor: "#fff",
                margin: "0 15px",
              }}
            />
          </div>
          {/* Sağ Kısım */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <LuEthernetPort
              style={{ width: 15, height: 15, marginRight: 10 }}
            />
            <img
              src="/icons/audio-volume-high-symbolic.svg"
              alt="Volume"
              style={{ width: 18, height: 18, marginRight: 10 }}
            />
            <FaBell style={{ width: 12, height: 12, marginRight: 10 }} />
            <img
              src="/icons/battery-100-charged.svg"
              alt="Battery"
              style={{ width: 19, height: 19, marginRight: 10 }}
            />
            <span style={{ fontSize: 14, marginRight: 10, userSelect: "none" }}>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <div
              style={{
                width: 1,
                height: 22,
                backgroundColor: "#fff",
                marginRight: 10,
              }}
            />
            <img
              src="/icons/nm-vpn-standalone-lock.svg"
              alt="Lock"
              style={{
                width: 19,
                height: 19,
                marginRight: 10,
                cursor: "pointer",
              }}
            />
            <RxExit
              style={{
                width: 12,
                height: 12,
                marginRight: 1,
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onExit && onExit();
              }}
            />
          </div>
        </div>

        {isStartMenuOpen && (
          <div className="start-menu" onClick={(e) => e.stopPropagation()}>
            <div className="start-menu-header">
              <span className="start-menu-title">Kali</span> Menu
            </div>
            <div className="menu-content">
              <div className="menu-item">Favorites</div>
              <div className="menu-item">Recently Used</div>
              <div className="menu-item">All Applications</div>
              <div className="menu-item">Documents</div>
              <div className="menu-item">Settings</div>
              <div className="menu-item">System Info</div>
            </div>
            <div className="start-menu-footer">
              <div className="profile">
                <img
                  className="profile-image"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Kali-dragon-icon.svg/2048px-Kali-dragon-icon.svg.png"
                  alt="Profile"
                />
                <span className="profile-name">leatherfire</span>
              </div>
              <div className="footer-icons">
                <div className="footer-icon" title="Lock Screen">
                  🔒
                </div>
                <div className="footer-icon" title="Shut Down">
                  ⏻
                </div>
              </div>
            </div>
            <style>{`
              .start-menu {
                position: absolute;
                top: 34px;
                left: 0;
                width: 320px;
                height: calc(100% - 150px);
                background: linear-gradient(135deg, #23252e, #2a2d37);
                color: #ddd;
                padding: 10px;
                overflow-y: auto;
                z-index: 50;
                box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
                border-radius: 0 10px 10px 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              .start-menu-header { font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #555; }
              .start-menu-title { color: #08f; }
              .menu-content { flex: 1; overflow-y: auto; margin-top: 10px; }
              .menu-item { margin-bottom: 6px; padding: 8px; border-radius: 4px; cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; }
              .menu-item:hover { background: rgba(8, 143, 255, 0.2); transform: translateX(5px); }
              .start-menu-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid #555; }
              .profile { display: flex; align-items: center; }
              .profile-image { width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; }
              .profile-name { font-size: 14px; }
              .footer-icons { display: flex; gap: 10px; }
              .footer-icon { font-size: 20px; cursor: pointer; transition: transform 0.2s ease, color 0.2s ease; }
              .footer-icon:hover { transform: scale(1.1); color: #08f; }
            `}</style>
          </div>
        )}

        {/* Masaüstü İkonları */}
        <div
          className="absolute top-[55px] left-[15px] grid grid-flow-col grid-rows-5 gap-x-[28px] gap-y-[28px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Trash */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "trash")}
            onDoubleClick={() => handleIconDoubleClick("trash")}
          >
            <img
              src="/icons/user-trash-full.svg"
              alt="Trash"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "trash"
                    ? "brightness-75"
                    : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "trash"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              Trash
            </div>
          </div>

          {/* File System */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "filesystem")}
            onDoubleClick={() => handleIconDoubleClick("filesystem")}
          >
            <img
              src="/icons/drive-optical.svg"
              alt="File System"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "filesystem"
                    ? "brightness-75"
                    : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "filesystem"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              File System
            </div>
          </div>

          {/* Home */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "home")}
            onDoubleClick={() => handleIconDoubleClick("home")}
          >
            <img
              src="/icons/folder-blue-home.svg"
              alt="Home"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "home" ? "brightness-75" : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "home"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              Home
            </div>
          </div>

          {/* Important Files */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "important")}
            onDoubleClick={() => handleIconDoubleClick("important")}
          >
            <img
              src="/icons/folder-blue_open.svg"
              alt="Important Files"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "important"
                    ? "brightness-75"
                    : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "important"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              Important Files
            </div>
          </div>

          {/* Terminal */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "terminal")}
            onDoubleClick={() => handleIconDoubleClick("terminal")}
          >
            <img
              src="/icons/utilities-terminal.svg"
              alt="Terminal"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "terminal"
                    ? "brightness-75"
                    : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "terminal"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              Terminal
            </div>
          </div>

          {/* Paint */}
          <div
            className="flex flex-col items-center w-[60px] text-center cursor-pointer"
            onClick={(e) => handleIconClick(e, "paint")}
            onDoubleClick={() => handleIconDoubleClick("paint")}
          >
            <img
              src="/icons/paint.svg"
              alt="Paint"
              className={`
                w-[40px] h-[40px] transition-opacity
                ${
                  selectedIcon === "paint"
                    ? "brightness-75"
                    : "hover:opacity-70"
                }
              `}
            />
            <div
              className={`
                mt-[3px] text-[12px]
                ${
                  selectedIcon === "paint"
                    ? "bg-blue-600 text-white px-1 rounded"
                    : ""
                }
              `}
            >
              Paint
            </div>
          </div>
        </div>

        {/* Açık Pencereler */}
        {fileManagerWindowOpen && (
          <Window
            windowId="fm"
            title="File Manager"
            onClose={closeFileManagerWindow}
            defaultWidth={600}
            defaultHeight={400}
            minWidth={400}
            minHeight={300}
            windowType="default"
            onFocus={() => bringWindowToFront("fm")}
            style={{ zIndex: getZIndex("fm") }}
          >
            <FileManager
              importantFiles={importantFiles}
              onFileOpen={handleFileOpen}
              onClose={closeFileManagerWindow}
              initialCategory={fileManagerCategory}
            />
          </Window>
        )}

        {terminalWindowOpen && (
          <Window
            windowId="term"
            title="kali@kali:~/Desktop"
            onClose={closeTerminalWindow}
            defaultWidth={600}
            defaultHeight={400}
            minWidth={400}
            minHeight={300}
            windowType="terminal"
            onFocus={() => bringWindowToFront("term")}
            style={{ zIndex: getZIndex("term") }}
          >
            <Terminal />
          </Window>
        )}

        {paintWindowOpen && (
          <Window
            windowId="paint"
            title="Paint"
            onClose={closePaintWindow}
            defaultWidth={600}
            defaultHeight={400}
            minWidth={400}
            minHeight={300}
            windowType="default"
            onFocus={() => bringWindowToFront("paint")}
            style={{ zIndex: getZIndex("paint") }}
          >
            <Paint />
          </Window>
        )}

        {firefoxWindowOpen && (
          <Window
            windowId="firefox"
            title="Tor Browser"
            onClose={closeFirefoxWindow}
            defaultWidth={603}
            defaultHeight={400}
            minWidth={600}
            minHeight={400}
            windowType="default"
            onFocus={() => bringWindowToFront("firefox")}
            style={{ zIndex: getZIndex("firefox") }}
          >
            <Firefox />
          </Window>
        )}

        {editorWindows.map((editor) => (
          <Window
            key={editor.id}
            windowId={editor.id}
            title={editor.name}
            onClose={() => closeEditorWindow(editor.id)}
            defaultWidth={500}
            defaultHeight={300}
            minWidth={300}
            minHeight={200}
            windowType="editor"
            initialContent={editor.content}
            onSave={(newContent) => handleEditorSave(newContent, editor.id)}
            onFocus={() => bringWindowToFront(editor.id)}
            style={{ zIndex: getZIndex(editor.id) }}
          />
        ))}
      </div>
      {/* Tüm ekranı kaplayan vintage overlay */}
<div className="vintage-overlay" />

<style jsx>{`
  .vintage-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDZoNjBhdjJhbG5tb3pvODdobjU0OXNrZDlseXVkdDdtYWdjOG9oeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oEI9uBYSzLpBK/giphy.webp");
    background-size: cover;
    opacity: 0.05;
    pointer-events: none;
    z-index: 9999;
  }
`}</style>

      
    </div>
  );
}
