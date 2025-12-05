import {
  jsWrapper,
  pythonWrapper,
  rubyWrapper,
  phpWrapper,
  dartWrapper,
} from "@execution/wrappers";
import { transpileTsToJs } from "@execution";

export function generateExecutableFiles(
  language: string,
  userCode: string,
  funcName: string
): { name: string; content: string }[] {
  const lang = (language || "").toLowerCase();
  if (lang === "typescript" || lang === "ts") {
    const jsCode = transpileTsToJs(userCode);
    return [jsWrapper(jsCode, funcName)];
  }
  switch (lang) {
    case "javascript":
    case "js":
      return [jsWrapper(userCode, funcName)];
    case "python":
    case "py":
      return [pythonWrapper(userCode, funcName)];
    case "ruby":
      return [rubyWrapper(userCode, funcName)];
    case "php":
      return [phpWrapper(userCode, funcName)];
    case "dart":
      return [dartWrapper(userCode, funcName)];
    default:
      throw new Error("Unsupported language: " + language);
  }
}
