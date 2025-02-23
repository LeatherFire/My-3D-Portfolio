// app/components/Window.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";

/**
 * Props:
 * - title: pencerenin başlangıç dosya adı (ör. "untitled.txt")
 * - onClose: pencere kapatma callback'i
 * - onFocus: pencereye tıklandığında focus (ön plana getirme) için çağrılan callback
 * - children: eğer windowType "default" ise içerik olarak render edilir
 * - defaultWidth, defaultHeight, minWidth, minHeight: boyut ayarları
 * - windowType: "default", "editor" veya "terminal" (varsayılan: "default")
 * - initialContent: windowType "editor" ise başlangıç metni
 * - onSave: editor tipi pencere için kaydetme callback'i (opsiyonel)
 * - style: dışarıdan eklenebilecek stil nesnesi (ör. zIndex ayarı)
 */

// İlk olarak, pencerenin başlangıç pozisyon ve boyutunu belirleyelim:
export default function Window({
  windowId,
  title = "untitled.txt",
  onClose,
  onFocus,
  children,
  defaultWidth = 500,
  defaultHeight = 300,
  minWidth = 300,
  minHeight = 200,
  windowType = "default",
  initialContent = "",
  onSave,
  style = {},
}) {
  let initPos, initSize;
  if (windowType === "terminal") {
    initPos = { x: 100, y: 100 };
    initSize = { width: 600, height: 400 };
  } else if (windowType !== "editor") {
    initPos = { x: 120, y: 80 };
    initSize = { width: defaultWidth, height: defaultHeight };
  } else {
    // editor tipi
    initPos = { x: 120, y: 80 };
    initSize = { width: defaultWidth, height: defaultHeight };
  }

  // Maximize/restore için state'ler:
  const [isMaximized, setIsMaximized] = useState(false);
  const [controlledPosition, setControlledPosition] = useState(initPos);
  const [controlledSize, setControlledSize] = useState(initSize);
  const [prevPosition, setPrevPosition] = useState(null);
  const [prevSize, setPrevSize] = useState(null);

  // Toggle fonksiyonu: Maksimize (tam ekran) / Restore (önceki boyut)
  const toggleMaximize = (e) => {
    e.stopPropagation();
    if (!isMaximized) {
      // Mevcut pozisyon ve boyutu sakla
      setPrevPosition(controlledPosition);
      setPrevSize(controlledSize);
      // Desktop2 container'ının boyutları 705x584 olarak varsayılıyor
      setControlledPosition({ x: 12, y: 40 });
      setControlledSize({ width: 705, height: 551 });
      setIsMaximized(true);
    } else {
      // Önceki boyutlara geri dön
      setControlledPosition(prevPosition);
      setControlledSize(prevSize);
      setIsMaximized(false);
    }
  };

  // --- Terminal Tipi İçin Özel Render ---
  if (windowType === "terminal") {
    return (
      <Rnd
        size={controlledSize}
        position={controlledPosition}
        onDragStop={(e, d) => setControlledPosition({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, pos) => {
          setControlledSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setControlledPosition(pos);
        }}
        minWidth={400}
        minHeight={300}
        dragHandleClassName="myWindowTitleBar"
        style={{
          zIndex: 999,
          backgroundColor: "#0F111A", // Terminal arka planı
          border: "1px solid #666",
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          ...style,
        }}
        onMouseDown={() => {
          onFocus && onFocus();
        }}
      >
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Terminal Title Bar */}
          <div
            className="myWindowTitleBar"
            style={{
              height: "28px",
              backgroundColor: "#1B1E2B",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 8px",
              userSelect: "none",
              cursor: "default", // Drag handle
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                &#9472;
              </button>
              <button
                onClick={toggleMaximize}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {isMaximized ? "❐" : "◻"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose && onClose();
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                &#10005;
              </button>
            </div>
            <span style={{ pointerEvents: "none" }}>{title}</span>
            <div />
          </div>
          {/* Terminal İçerik Alanı */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </Rnd>
    );
  }

  // --- Default Tipi İçin (editor dışı) ---
  if (windowType !== "editor") {
    return (
      <Rnd
        size={controlledSize}
        position={controlledPosition}
        onDragStop={(e, d) => setControlledPosition({ x: d.x, y: d.y })}
        onResizeStop={(e, direction, ref, delta, pos) => {
          setControlledSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setControlledPosition(pos);
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        style={{
          zIndex: 999,
          backgroundColor: "#2e2e2e",
          border: "1px solid #666",
          display: "flex",
          flexDirection: "column",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
          ...style,
        }}
        dragHandleClassName="myWindowTitleBar"
        onMouseDown={() => {
          onFocus && onFocus();
        }}
      >
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Başlık Çubuğu */}
          <div
            className="myWindowTitleBar"
            style={{
              height: 28,
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 8px",
              userSelect: "none",
              cursor: "default",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
                &#9472;
              </button>
              <button
                onClick={toggleMaximize}
                style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
              >
                {isMaximized ? "❐" : "◻"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose && onClose();
                }}
                style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
              >
                &#10005;
              </button>
            </div>
            <span style={{ pointerEvents: "none" }}>{title}</span>
            <div />
          </div>
          {/* İçerik */}
          <div style={{ flex: 1, padding: 8, overflow: "auto" }}>{children}</div>
        </div>
      </Rnd>
    );
  }

  // --- Editor Tipi İçin ---
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentFileName, setCurrentFileName] = useState(title);
  const storageKey = `file-${currentFileName}`;
  const [editorContent, setEditorContent] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || initialContent;
    }
    return initialContent;
  });
  const [originalContent, setOriginalContent] = useState(editorContent);
  const [theme, setTheme] = useState("dark");
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [lineEnding, setLineEnding] = useState("LF");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const unsavedChanges = editorContent !== originalContent;

  const toggleMenu = (menuName) => {
    setMenuOpen((prev) => (prev === menuName ? null : menuName));
  };

  const handleNewFile = () => {
    if (unsavedChanges && !confirm("Unsaved changes will be lost. Continue?")) return;
    setEditorContent("");
    setOriginalContent("");
    setCurrentFileName("untitled.txt");
    localStorage.removeItem(`file-${currentFileName}`);
    setMenuOpen(null);
  };

  const handleOpenFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setMenuOpen(null);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setEditorContent(content);
      setOriginalContent(content);
      setCurrentFileName(file.name);
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleSave = () => {
    localStorage.setItem(storageKey, editorContent);
    setOriginalContent(editorContent);
    alert(`Saving changes...\n${currentFileName} saved successfully.`);
    setMenuOpen(null);
  };

  const handleSaveAs = () => {
    const newName = prompt("Enter new file name:", currentFileName);
    if (newName && newName.trim() !== "") {
      localStorage.removeItem(storageKey);
      setCurrentFileName(newName.trim());
      const newKey = `file-${newName.trim()}`;
      localStorage.setItem(newKey, editorContent);
      setOriginalContent(editorContent);
      alert(`File saved as ${newName.trim()}`);
    }
    setMenuOpen(null);
  };

  const execEditorCmd = (cmd) => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      document.execCommand(cmd);
    }
    setMenuOpen(null);
  };

  const openFindReplace = () => {
    setShowFindReplace(true);
    setMenuOpen(null);
  };

  const doFindReplace = () => {
    if (findText === "") return;
    const regex = new RegExp(findText, "g");
    const newContent = editorContent.replace(regex, replaceText);
    setEditorContent(newContent);
    setShowFindReplace(false);
  };

  const toggleLineNumbers = () => {
    setShowLineNumbers((prev) => !prev);
    setMenuOpen(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setMenuOpen(null);
  };

  const toggleLineEnding = () => {
    setLineEnding((prev) => (prev === "LF" ? "CRLF" : "LF"));
    setMenuOpen(null);
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setShowSaveWarning(true);
  };

  const handleConfirmSave = (e) => {
    e.stopPropagation();
    setShowSaveWarning(false);
    handleSave();
  };

  const handleCancelSave = (e) => {
    e.stopPropagation();
    setShowSaveWarning(false);
    alert("Save cancelled. Your changes are not saved.");
  };

  const editorStyles = {
    backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
    color: theme === "dark" ? "#ddd" : "#000",
    border: "none",
    padding: "8px",
    fontFamily: "monospace",
    fontSize: "14px",
    outline: "none",
    resize: "none",
    width: "100%",
    height: "100%",
  };

  const lineNumberStyles = {
    backgroundColor: theme === "dark" ? "#2e2e2e" : "#f0f0f0",
    color: theme === "dark" ? "#888" : "#555",
    padding: "8px",
    textAlign: "right",
    userSelect: "none",
  };

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#333",
    color: "#ddd",
    padding: "4px 0",
    minWidth: "140px",
    zIndex: 10,
    border: "1px solid #555",
  };

  const dropdownItemStyle = {
    padding: "4px 12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const statusBarStyle = {
    backgroundColor: "#333",
    color: "#ddd",
    fontSize: "12px",
    padding: "4px 8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  useEffect(() => {
    // Her değişiklikte unsavedChanges hesaplanabilir.
  }, [editorContent, originalContent]);

  return (
    <Rnd
      size={controlledSize}
      position={controlledPosition}
      onDragStop={(e, d) => setControlledPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setControlledSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setControlledPosition(pos);
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      style={{
        zIndex: 999,
        backgroundColor: "#2e2e2e",
        border: "1px solid #666",
        display: "flex",
        flexDirection: "column",
        willChange: "transform",
        transform: "translate3d(0,0,0)",
        ...style,
      }}
      dragHandleClassName="myWindowTitleBar"
      onMouseDown={() => {
        onFocus && onFocus();
      }}
    >
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
        <div
          className="myWindowTitleBar"
          style={{
            height: 28,
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 8px",
            userSelect: "none",
            cursor: "default",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
              &#9472;
            </button>
            <button
              onClick={toggleMaximize}
              style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
            >
              {isMaximized ? "❐" : "◻"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
              style={{ backgroundColor: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
            >
              &#10005;
            </button>
          </div>
          <span style={{ pointerEvents: "none" }}>{currentFileName}</span>
          <div />
        </div>
        <div style={{ backgroundColor: "#333", padding: "4px 8px", display: "flex", alignItems: "center", color: "#ddd", fontSize: "14px", position: "relative" }}>
          <div style={{ position: "relative", marginRight: "16px" }}>
            <span onClick={() => toggleMenu("file")} style={{ cursor: "pointer" }}>
              File
            </span>
            {menuOpen === "file" && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={handleNewFile}>
                  New
                </div>
                <div style={dropdownItemStyle} onClick={handleOpenFile}>
                  Open
                </div>
                <div style={dropdownItemStyle} onClick={handleSave}>
                  Save
                </div>
                <div style={dropdownItemStyle} onClick={handleSaveAs}>
                  Save As...
                </div>
              </div>
            )}
          </div>
          <div style={{ position: "relative", marginRight: "16px" }}>
            <span onClick={() => toggleMenu("edit")} style={{ cursor: "pointer" }}>
              Edit
            </span>
            {menuOpen === "edit" && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={() => execEditorCmd("undo")}>
                  Undo
                </div>
                <div style={dropdownItemStyle} onClick={() => execEditorCmd("redo")}>
                  Redo
                </div>
                <div style={dropdownItemStyle} onClick={() => execEditorCmd("cut")}>
                  Cut
                </div>
                <div style={dropdownItemStyle} onClick={() => execEditorCmd("copy")}>
                  Copy
                </div>
                <div style={dropdownItemStyle} onClick={() => execEditorCmd("paste")}>
                  Paste
                </div>
                <div style={dropdownItemStyle} onClick={openFindReplace}>
                  Find & Replace
                </div>
              </div>
            )}
          </div>
          <div style={{ position: "relative", marginRight: "16px" }}>
            <span onClick={() => toggleMenu("view")} style={{ cursor: "pointer" }}>
              View
            </span>
            {menuOpen === "view" && (
              <div style={dropdownStyle}>
                <div style={dropdownItemStyle} onClick={toggleLineNumbers}>
                  {showLineNumbers ? "Hide" : "Show"} Line Numbers
                </div>
                <div style={dropdownItemStyle} onClick={toggleTheme}>
                  {theme === "dark" ? "Light Theme" : "Dark Theme"}
                </div>
                <div style={dropdownItemStyle} onClick={toggleLineEnding}>
                  Line Ending: {lineEnding === "LF" ? "CRLF" : "LF"}
                </div>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}></div>
          <button
            onClick={handleSaveClick}
            style={{
              backgroundColor: "#444",
              border: "1px solid #555",
              color: "#fff",
              padding: "2px 8px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
        <div style={{ flex: 1, display: "flex", width: "100%", position: "relative" }}>
  {showLineNumbers && (
    <div style={lineNumberStyles}>
      {editorContent.split("\n").map((_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  )}
  <textarea
    ref={textareaRef}
    value={editorContent}
    onChange={(e) => setEditorContent(e.target.value)}
    style={{
      ...editorStyles,
      marginLeft: showLineNumbers ? "4px" : 0,
    }}
  />
  {currentFileName === "cv.txt" && (
    <div
    style={{
      position: "absolute",
      bottom: "10px",
      right: "10px",
      color: "yellow",
      cursor: "pointer",
      fontWeight: "bold",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "2px 4px",
      borderRadius: "4px",
      animation: "blinking 1.5s infinite",
    }}
      onClick={() => window.open("/pdfs/CVENG.pdf", "_blank")}
    >
      (PDF)
    </div>
  )}
</div>

        <div style={statusBarStyle}>
          <div>{unsavedChanges ? "Unsaved Changes" : "All changes saved"}</div>
          <div>
            Encoding: UTF-8 | Line Ending: {lineEnding} | Theme: {theme}
          </div>
        </div>
        {showSaveWarning && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                backgroundColor: "#2e2e2e",
                border: "1px solid #555",
                padding: "16px",
                width: "300px",
                boxShadow: "0 0 10px rgba(0,0,0,0.7)",
              }}
            >
              <p style={{ marginBottom: "16px", color: "#fff" }}>
                Do you want to save changes to {currentFileName}?
              </p>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={handleConfirmSave}
                  style={{ backgroundColor: "#4caf50", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelSave}
                  style={{ backgroundColor: "#f44336", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}
                >
                  Don't Save
                </button>
              </div>
            </div>
          </div>
        )}
        {showFindReplace && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 110,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                backgroundColor: "#2e2e2e",
                border: "1px solid #555",
                padding: "16px",
                width: "300px",
                boxShadow: "0 0 10px rgba(0,0,0,0.7)",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <label style={{ color: "#fff", fontSize: "14px" }}>Find: </label>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  style={{ width: "100%", padding: "4px", marginTop: "4px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: "8px" }}>
                <label style={{ color: "#fff", fontSize: "14px" }}>Replace: </label>
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  style={{ width: "100%", padding: "4px", marginTop: "4px", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  onClick={doFindReplace}
                  style={{ backgroundColor: "#4caf50", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}
                >
                  Replace
                </button>
                <button
                  onClick={() => setShowFindReplace(false)}
                  style={{ backgroundColor: "#f44336", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="text/plain" style={{ display: "none" }} onChange={onFileChange} />
        <style jsx>{`
  @keyframes blinking {
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
    </Rnd>
  );
}
