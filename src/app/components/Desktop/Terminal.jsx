// app/components/Terminal.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";

// Typewriter komponenti: verilen metni harf harf ekranda yazar.
function Typewriter({ text, speed = 30 }) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Metin değiştiğinde indeksi ve görüntülenen metni sıfırla
    setDisplayedText("");
    indexRef.current = 0;

    function typeNext() {
      // Mevcut indekse kadar metni keserek güncelle
      setDisplayedText(text.slice(0, indexRef.current + 1));
      indexRef.current++;
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(typeNext, speed);
      }
    }

    timerRef.current = setTimeout(typeNext, speed);

    return () => clearTimeout(timerRef.current);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}


export default function Terminal() {
  const [history, setHistory] = useState([]); // Girilen komut geçmişi
  const [currentCommand, setCurrentCommand] = useState(""); // Şu anki komut
  const [prompt] = useState("kali@kali:~/Desktop$ ");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Komut işleyici: echo, pwd, ls, neofetch, clear, help ve portföy’e özel komutları simüle eder.
  const processCommand = (command) => {
    const trimmed = command.trim();
    if (trimmed.startsWith("echo ")) {
      return trimmed.slice(5);
    } else if (trimmed === "pwd") {
      return "/home/kali/Desktop";
    } else if (trimmed === "dir") {
      return "Documents  Downloads  Music  Pictures  Public  Templates  Videos";
    } else if (trimmed === "sysinfo") {
      return `       .-/+oossssoo+/-.              
     \`/osssssssssssssssso-\`
    /sssssssssssssssssssss\\
   :ssssssssssssssssssssss:
   /sssssssssssssssssssssss\\
  :ssssssssssssssssssssssss:
  ssssssssssssssssssssssssss
  :ssssssssssssssssssssssss:
   \\sssssssssssssssssssssss/
    \\ssssssssssssssssssssss/
     \`/osssssssssssssssso-'\`
  OS: Kali (rolling)
  Kernel: 6.0.0-kali1-amd64
  Shell: bash 5.2.2`;
    } else if (trimmed === "help") {
      return `Available commands:
    echo [text]           - Print text
    pwd                   - Print current directory
    dir                   - List directory contents
    sysinfo               - Display system information
    sysid                 - Show your identity information
    cvinfo                - Display complete CV summary
    expdetail             - Show detailed experience and projects
    eduinfo               - Show educational background
    skillset              - List technical skills and domains
    projlist              - List portfolio projects
    contact-info          - Display contact details
    portfolio             - Describe the interactive portfolio
    instructions          - Show usage instructions and valid handshake pairs
    ascii-banner          - Display ASCII art banner
    social-links          - List social media links
    simversion            - Show simulation version
    clear                 - Clear the terminal
    help                  - Show available commands`;
    } else if (trimmed === "sysid") {
      return `Yigitcan Ucar
  Computer Engineer | Cybersecurity Enthusiast
  Passionate about building interactive, secure, and scalable digital solutions.`;
    } else if (trimmed === "cvinfo") {
      return `Education:
    - Süleyman Demirel University, Isparta, Turkey (2021 - ongoing, AGNO 3.70)
    - Recep Gungor Anadolu High School, Buyukcekmece/Istanbul (2017-2021)
  
  Skills:
    - Python, C, JavaScript, Java, C#, SQL, Bash/Shell, R, Arduino, Swift, Ruby, Assembly
    - Cybersecurity, AI, Machine Learning, Data Engineering, System Administration, IoT, Mobile Development
  
  Experience:
    - Red Team Member Intern at Jotform, San Francisco (Aug 2024 – Sept 2024)`;
    } else if (trimmed === "expdetail") {
      return `Professional Experience:
  - Red Team Member Intern at Jotform, San Francisco (Aug 2024 – Sept 2024)
    * Led simulated cyberattacks.
    * Developed defensive strategies.
  Academic Projects:
  - Cyber Defense Simulator: A Python-based platform for testing network vulnerabilities.
  - IoT Drone Automation: An autonomous drone system with real-time analytics.
  - AI-Powered Image Processing: Machine learning models to enhance digital image quality.
  - MERN Stack E-commerce Platform: A scalable web application built with React, Node.js, and MongoDB.`;
    } else if (trimmed === "eduinfo") {
      return `Education:
  - Süleyman Demirel University, Isparta, Turkey (2021 - ongoing, AGNO 3.70)
  - Recep Gungor Anadolu High School, Buyukcekmece/Istanbul (2017-2021)`;
    } else if (trimmed === "skillset") {
      return `Skills:
  - Programming: Python, C, JavaScript, Java, C#, SQL, Bash/Shell, R, Arduino, Swift, Ruby, Assembly
  - Domains: Cybersecurity, Artificial Intelligence, Machine Learning, Data Engineering, System Administration, IoT, Mobile Development`;
    } else if (trimmed === "projlist") {
      return `Projects:
  - Cyber Defense Simulator: A platform for testing network vulnerabilities using Python.
  - IoT Drone Automation: An autonomous drone system with Arduino and Raspberry Pi.
  - AI-Powered Image Processing: Machine learning models to enhance digital image quality.
  - MERN Stack E-commerce Platform: A scalable web application built with React, Node.js, and MongoDB.`;
    } else if (trimmed === "contact-info") {
      return `Contact Information:
  - Email: ucar.yigitcan2003@gmail.com
  - Phone: +90-505-007-4569
  - Website: yigitcan-ucar.vercel.app
  - LinkedIn: linkedin.com/in/leatherfire
  - GitHub: github.com/LeatherFire`;
    } else if (trimmed === "portfolio") {
      return `Portfolio:
  I have developed an interactive 3D portfolio website that simulates my office environment. Click on the interface to zoom in and explore a realistic desktop simulation. The site is designed to be both interactive and fun, providing insights into my work and projects.
  For more details, refer to the instructions command.`;
    } else if (trimmed === "instructions") {
      return `Readme:
  In the terminal, type 'help' to view all available commands.
  You can extract secret information using these valid handshake–wordlist combinations:
  - whoami.cap with RockYou (1TB)
  - mywifi.handshake with CrackStation (250MB)
  - evil_twin.pcap with SecLists Top1M (200MB)
  - classified_manifest.doc with PhantomKeys (100MB)
  - shadow_gateway.cap with SpectreCodes (50MB)
  - covert_protocol.handshake with ObscureForum.txt (5MB)
  - compromised_archive.handshake with ShadowCipher.txt (35MB)
  - global_intelligence.cap with DualityDump.txt (18MB)
  - encrypted_chronicle.txt with RapidBypass.txt (1MB)
  You may also experiment with the Paint application or explore available text editors.
  Note: This is a simulation—features may not work flawlessly.`;
    } else if (trimmed === "ascii-banner") {
      return `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠟⠃⠀⠀⠙⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠋⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠾⢛⠒⠀⠀⠀⠀⠀⠀⠀⢸⡆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣶⣄⡈⠓⢄⠠⡀⠀⠀⠀⣄⣷⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣷⠀⠈⠱⡄⠑⣌⠆⠀⠀⡜⢻⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡿⠳⡆⠐⢿⣆⠈⢿⠀⠀⡇⠘⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣷⡇⠀⠀⠈⢆⠈⠆⢸⠀⠀⢣⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⠀⠀⠈⢂⠀⡇⠀⠀⢨⠓⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣦⣤⠖⡏⡸⠀⣀⡴⠋⠀⠈⠢⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠁⣹⣿⣿⣿⣷⣾⠽⠖⠊⢹⣀⠄⠀⠀⠀⠈⢣⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⣇⣰⢫⢻⢉⠉⠀⣿⡆⠀⠀⡸⡏⠀⠀⠀⠀⠀⠀⢇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢨⡇⡇⠈⢸⢸⢸⠀⠀⡇⡇⠀⠀⠁⠻⡄⡠⠂⠀⠀⠀⠘
⢤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠛⠓⡇⠀⠸⡆⢸⠀⢠⣿⠀⠀⠀⠀⣰⣿⣵⡆⠀⠀⠀⠀
⠈⢻⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡿⣦⣀⡇⠀⢧⡇⠀⠀⢺⡟⠀⠀⠀⢰⠉⣰⠟⠊⣠⠂⠀⡸
⠀⠀⢻⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢧⡙⠺⠿⡇⠀⠘⠇⠀⠀⢸⣧⠀⠀⢠⠃⣾⣌⠉⠩⠭⠍⣉⡇
⠀⠀⠀⠻⣿⣿⣿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣞⣋⠀⠈⠀⡳⣧⠀⠀⠀⠀⠀⢸⡏⠀⠀⡞⢰⠉⠉⠉⠉⠉⠓⢻⠃
⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⢀⣀⠠⠤⣤⣤⠤⠞⠓⢠⠈⡆⠀⢣⣸⣾⠆⠀⠀⠀⠀⠀⢀⣀⡼⠁⡿⠈⣉⣉⣒⡒⠢⡼⠀
⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣎⣽⣶⣤⡶⢋⣤⠃⣠⡦⢀⡼⢦⣾⡤⠚⣟⣁⣀⣀⣀⣀⠀⣀⣈⣀⣠⣾⣅⠀⠑⠂⠤⠌⣩⡇⠀
⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁⣺⢁⣞⣉⡴⠟⡀⠀⠀⠀⠁⠸⡅⠀⠈⢷⠈⠏⠙⠀⢹⡛⠀⢉⠀⠀⠀⣀⣀⣼⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⡟⢡⠖⣡⡴⠂⣀⣀⣀⣰⣁⣀⣀⣸⠀⠀⠀⠀⠈⠁⠀⠀⠈⠀⣠⠜⠋⣠⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⡟⢿⣿⣿⣷⡟⢋⣥⣖⣉⠀⠈⢁⡀⠤⠚⠿⣷⡦⢀⣠⣀⠢⣄⣀⡠⠔⠋⠁⠀⣼⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⡄⠈⠻⣿⣿⢿⣛⣩⠤⠒⠉⠁⠀⠀⠀⠀⠀⠉⠒⢤⡀⠉⠁⠀⠀⠀⠀⠀⢀⡿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣤⣤⠴⠟⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠤⠀⠀⠀⠀⠀⢩⠇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀        
  Welcome to my interactive portfolio!`;
    } else if (trimmed === "social-links") {
      return `Social Media:
      - GitHub: https://github.com/LeatherFire
      - LinkedIn: https://linkedin.com/in/leatherfire
      - Twitter: https://twitter.com/_leatherfire_
      - Instagram: https://www.instagram.com/_leatherfire_
      - Email: ucar.yigitcan2003@gmail.com
      - Website: https://yigitcan-ucar.vercel.app`;
    }
     else if (trimmed === "simversion") {
      return `Terminal Simulation Version 1.0.0`;
    } else if (trimmed === "clear") {
      return "";
    } else {
      return `command not found: ${trimmed}`;
    }
  };
  

  const handleCommandSubmit = () => {
    const trimmedCommand = currentCommand.trim();

    // Eğer clear komutuysa, geçmişi temizle ve scroll'u en üste ayarla.
    if (trimmedCommand === "clear") {
      setHistory([]);
      setCommandHistory((prev) => [...prev, currentCommand]);
      setCurrentCommand("");
      setHistoryIndex(-1);
      // Container'ın scroll konumunu en üste ayarlama
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }, 50);
      return;
    }

    const output = processCommand(currentCommand);
    const newEntry = { prompt, command: currentCommand, output };
    setHistory((prevHistory) => [...prevHistory, newEntry]);
    setCommandHistory((prev) => [...prev, currentCommand]);
    setCurrentCommand("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommandSubmit();
    } else if (e.key === "ArrowUp") {
      // Önceki komutu getir
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      // Sonraki komutu getir
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setCurrentCommand("");
        }
      }
    }
  };

  // Her history güncellendiğinde, container'ı en alta kaydır.
  useEffect(() => {
    if (containerRef.current && history.length > 0) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Terminale tıklandığında input odaklanır.
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Stil ayarları
  const containerStyle = {
    width: "100%",
    height: "100vh", // Tüm viewport yüksekliğini kaplar
    backgroundColor: "#0F111A",
    color: "#DEDEDE",
    fontFamily: "'Fira Code', 'Ubuntu Mono', monospace",
    fontSize: "14px",
    boxSizing: "border-box",
    padding: "10px",
    overflowY: "auto",
    cursor: "text",
  };

  const lineStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    flexWrap: "wrap",
  };

  const promptTextStyle = { marginRight: "4px", color: "#56B6C2" };
  const hostnameStyle = { marginRight: "4px", color: "#56B6C2" };
  const pathStyle = { marginRight: "4px", color: "#ABB2BF" };
  const dollarStyle = { marginRight: "4px", color: "#98C379" };

  const inputStyle = {
    width: "auto",
    minWidth: "2ch",
    background: "none",
    border: "none",
    outline: "none",
    color: "#DEDEDE",
    fontFamily: "inherit",
    fontSize: "inherit",
  };
  useEffect(() => {
    if (history.length === 0) {
      const initialOutput = "Type 'help' to view available commands.";
      const initialEntry = { prompt, command: "", output: initialOutput };
      setHistory([initialEntry]);
    }
  }, []);
  

  return (
    <div style={containerStyle} ref={containerRef} onClick={handleContainerClick}>
      {/* Girilmiş komutlar ve çıktılar (history) */}
      {history.map((entry, idx) => (
        <div key={idx} style={{ marginBottom: "8px" }}>
          <div style={lineStyle}>
            <span style={promptTextStyle}>kali</span>
            <span style={hostnameStyle}>@kali:</span>
            <span style={pathStyle}>~/Desktop</span>
            <span style={dollarStyle}>$</span>
            <span style={{ marginLeft: "4px" }}>{entry.command}</span>
          </div>
          {entry.output && (
            <div style={{ marginLeft: "20px", whiteSpace: "pre-wrap" }}>
              <Typewriter text={entry.output} />
            </div>
          )}
        </div>
      ))}

      {/* Komut giriş alanı (input) her zaman en altta görünür */}
      <div style={lineStyle}>
        <span style={promptTextStyle}>kali</span>
        <span style={hostnameStyle}>@kali:</span>
        <span style={pathStyle}>~/Desktop</span>
        <span style={dollarStyle}>$</span>
        <input
          id="terminal-input"
          name="terminal-input"
          type="text"
          autoComplete="off"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
          ref={inputRef}
          autoFocus
        />
      </div>
    </div>
  );
}
