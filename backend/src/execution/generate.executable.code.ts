
import { 
  jsWrapper,
  tsWrapper,
  pythonWrapper,
  javaWrapper,
  goWrapper,
  cWrapper,
  cppWrapper,
  csharpWrapper,
  rubyWrapper,
  phpWrapper,
  dartWrapper,
  rustWrapper
} from "@execution/wrappers";


export function generateExecutableFiles(
  language: string,
  userCode: string,
  funcName: string
): { name: string; content: string }[] {
  const lang = language.toLowerCase();
  switch (lang) {
    case "javascript":
    case "js":
      return [jsWrapper(userCode, funcName)];
    case "typescript":
    case "ts":
      return [tsWrapper(userCode, funcName)];
    case "python":
    case "py":
      return [pythonWrapper(userCode, funcName)];
    case "java":
      return [javaWrapper(userCode, funcName)];
    case "go":
      return [goWrapper(userCode, funcName)];
    case "c":
      return [cWrapper(userCode, funcName)];
    case "cpp":
    case "c++":
      return [cppWrapper(userCode, funcName)];
    case "csharp":
    case "c#":
      return [csharpWrapper(userCode, funcName)];
    case "ruby":
      return [rubyWrapper(userCode, funcName)];
    case "php":
      return [phpWrapper(userCode, funcName)];
    case "dart":
      return [dartWrapper(userCode, funcName)];
    case "rust":
      return [rustWrapper(userCode, funcName)];
    default:
      throw new Error("Unsupported language: " + language);
  }
}
