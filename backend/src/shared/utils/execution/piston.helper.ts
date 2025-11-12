import axios from "axios";

export const runCodeWithPiston = async (
  language: string,
  sourceCode: string,
  input: string
) => {
  console.log("FINAL REQUEST:", { language, sourceCode, input });
  const extMap: Record<string, string> = {
    javascript: "main.js",
    typescript: "main.ts",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    csharp: "Program.cs",
    go: "main.go",
    rust: "main.rs",
    php: "main.php",
    ruby: "main.rb",
    swift: "main.swift",
    kotlin: "Main.kt",
  };

  const pistonLangMap: Record<string, string> = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "c++", 
  };

  const filename = extMap[language] || "main.txt";
  const pistonLang = pistonLangMap[language] || language;

  const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    language: pistonLang,
    version: "*",
    files: [{ name: filename, content: sourceCode }],
    run: [{ stdin: input }],
  });

  return response.data;
};
