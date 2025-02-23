"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Desktop.module.css";

export default function Desktop({ onCommandTurnDesktop }) {
  const terminalRef = useRef(null);
  const [inputBuffer, setInputBuffer] = useState("");
  const [awaitPassword, setAwaitPassword] = useState(false);
  const [outputLines, setOutputLines] = useState([
    "Welcome to the LeatherFire Terminal!",
    "Type 'help' to see available commands.",
  ]);
  const [currentDir, setCurrentDir] = useState("/");

  const fileSystem = {
    "/": ["home", "usr", "bin"],
    "/home": ["user1", "user2"],
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [outputLines]);

  const processCommand = (command) => {
    const trimmed = command.trim();

    if (trimmed === "help") {
      return ["Available commands: help, clear, learn passwd, date, cd, ls, turn desktop"];
    } else if (trimmed === "clear") {
      setOutputLines([]);
      return [];
    } else if (trimmed === "date") {
      return [new Date().toString()];
    } else if (trimmed.startsWith("cd ")) {
      const dir = trimmed.split(" ")[1];
      if (fileSystem[currentDir]?.includes(dir)) {
        const newDir = `${currentDir}/${dir}`;
        setCurrentDir(newDir);
        return [`Moved to ${newDir}`];
      } else {
        return [`No such directory: ${dir}`];
      }
    } else if (trimmed === "ls") {
      return [fileSystem[currentDir]?.join(" ") || ""];
    } else if (trimmed === "learn passwd") {
      return [
        "I love someone? Hint: check the frame on the desk and the startup entry page.",
      ];
    } else if (trimmed === "turn desktop") {
      setAwaitPassword(true);
      return ["Enter security code:"];
    } else if (awaitPassword) {
      setAwaitPassword(false);
      if (trimmed === "buse" || trimmed === "BUSE") {
        onCommandTurnDesktop && onCommandTurnDesktop();
        return ["Password accepted. Switching to the Kali desktop..."];
      } else {
        return ["Incorrect security code."];
      }
    } else {
      return [`Unknown command: ${trimmed}`];
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const trimmedCommand = inputBuffer.trim();
      setOutputLines((prev) => [
        ...prev,
        `${currentDir}$ ${trimmedCommand}`,
        ...processCommand(trimmedCommand),
      ]);
      setInputBuffer("");
    } else if (event.key === "Backspace") {
      setInputBuffer((prev) => prev.slice(0, -1));
    } else if (event.key.length === 1) {
      setInputBuffer((prev) => prev + event.key);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputBuffer]);

  return (
    <div
      style={{
        width: "705px",
        height: "584px",
        borderRadius: "6px",
        boxShadow: "0 0 20px rgba(5, 16, 220, 0.5)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className={styles.overlay}></div>
      <div className={styles.noise}></div>
      <div
        ref={terminalRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#27334A",
          color: "#ffffff",
          fontFamily: "'VT323', monospace",
          fontSize: "25px",
          lineHeight: "1.2",
          padding: "10px",
          overflowY: "auto",
          zIndex: "10",
        }}
      >
        {outputLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div>
          {currentDir}$ {inputBuffer}
          <span className={styles.cursor}>_</span>
        </div>
      </div>
    </div>
  );
}
