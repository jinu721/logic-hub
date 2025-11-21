import { env } from "../config/env";
import axios from "axios";

type FileItem = { name: string; content: string };
type ExecOptions = {
  runTimeoutMs?: number;
  compileTimeoutMs?: number;
  runMemoryLimitBytes?: number;
  compileMemoryLimitBytes?: number;
  stdin?: string;
  args?: string[];
};

export const runCodeWithPiston = async (
  language: string,
  files: FileItem[],
  options: ExecOptions = {}
) => {
  console.log("FINAL REQUEST TO PISTON:", {
    language,
    files: files.map(f => f.name),
    options,
  });

  const pistonLangMap: Record<string, string> = {
    javascript: "javascript",
    typescript: "typescript",
    python: "python",
    java: "java",
    cpp: "c++",
    csharp: "csharp",
    go: "go",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
  };

  const pistonLang = pistonLangMap[language] || language;

  const body: any = {
    language: pistonLang,
    version: "*",
    files,
    stdin: options.stdin || "",
    args: options.args || [],
  };

  // if (options.compileTimeoutMs !== undefined) body.compile_timeout = options.compileTimeoutMs;
  // if (options.runTimeoutMs !== undefined) body.run_timeout = options.runTimeoutMs;
  // if (options.compileMemoryLimitBytes !== undefined) body.compile_memory_limit = options.compileMemoryLimitBytes;
  // if (options.runMemoryLimitBytes !== undefined) body.run_memory_limit = options.runMemoryLimitBytes;

  const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

  const response = await axios.post(PISTON_URL, body, {
    timeout: (body.run_timeout || 10000) + 5000,
  });

  const data = response.data || {};
  const run = data.run || {};
  const stdout = run.stdout ?? "";
  const stderr = run.stderr ?? "";
  const output = run.output ?? `${stdout}\n${stderr}`;

  const meta = {
    timedOut: false,
    memoryKilled: false,
    truncated: false,
    exitCode: run.code ?? null,
    signal: run.signal ?? null,
  };

  if (run.signal) {
    meta.timedOut = ["SIGKILL", "SIGTERM"].includes(run.signal);
  }

  if (run.code === null && run.signal) meta.timedOut = true;

  if (output.length > 20000) meta.truncated = true; 

  return {
    raw: data,
    run: {
      stdout,
      stderr,
      output,
      code: run.code ?? null,
      signal: run.signal ?? null,
    },
    meta,
  };
};
