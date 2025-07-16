export function generateExecutableCode(
  language: string,
  sourceCode: string,
  funcName: string,
  args: any[],
  additionalImports?: string[]
): string {
  const templates = {
    javascript: {
      template: `{imports}\n{source}\n\nconsole.log(JSON.stringify({funcCall}));`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => JSON.stringify(arg),
    },

    typescript: {
      template: `{imports}\n{source}\n\nconsole.log(JSON.stringify({funcCall}));`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => JSON.stringify(arg),
    },

    python: {
      template: `import json\n{imports}\n{source}\n\nresult = {funcCall}\nprint(json.dumps(result))`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return JSON.stringify(arg);
      },
    },

    java: {
      template: `import com.google.gson.Gson;\n{imports}\n\n{source}\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution solution = new Solution();\n        Object result = solution.{funcCall};\n        Gson gson = new Gson();\n        System.out.println(gson.toJson(result));\n    }\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) {
          if (arg.length > 0 && typeof arg[0] === 'number') return `new int[]{${arg.join(', ')}}`;
          return `new String[]{"${arg.join('", "')}"}`;
        }
        return String(arg);
      },
    },

    cpp: {
      template: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\nusing namespace std;\n\n{source}\n\nstring toJsonString(const string& value) {\n    return "\\""+value+"\\"";\n}\n\ntemplate<typename T>\nstring toJsonString(const vector<T>& vec) {\n    stringstream ss;\n    ss << "[";\n    for (size_t i = 0; i < vec.size(); ++i) {\n        if (i > 0) ss << ",";\n        ss << toJsonString(vec[i]);\n    }\n    ss << "]";\n    return ss.str();\n}\n\ntemplate<typename T>\nstring toJsonString(const T& value) {\n    stringstream ss;\n    ss << value;\n    return ss.str();\n}\n\nint main() {\n    auto result = {funcCall};\n    cout << toJsonString(result) << endl;\n    return 0;\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) {
          if (arg.length > 0 && typeof arg[0] === 'number') return `{${arg.join(', ')}}`;
          return `{"${arg.join('", "')}"}`;
        }
        return String(arg);
      },
    },

    csharp: {
      template: `using System;\nusing Newtonsoft.Json;\n{imports}\n\n{source}\n\nclass Program {\n    static void Main() {\n        Solution solution = new Solution();\n        var result = solution.{funcCall};\n        Console.WriteLine(JsonConvert.SerializeObject(result));\n    }\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) {
          if (arg.length > 0 && typeof arg[0] === 'number') return `new int[]{${arg.join(', ')}}`;
          return `new string[]{"${arg.join('", "')}"}`;
        }
        return String(arg);
      },
    },

    go: {
      template: `package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\n{source}\n\nfunc main() {\n    result := {funcCall}\n    jsonResult, _ := json.Marshal(result)\n    fmt.Println(string(jsonResult))\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) {
          if (arg.length > 0 && typeof arg[0] === 'number') return `[]int{${arg.join(', ')}}`;
          return `[]string{"${arg.join('", "')}"}`;
        }
        return String(arg);
      },
    },

    rust: {
      template: `use serde_json;\n\n{source}\n\nfn main() {\n    let result = {funcCall};\n    println!("{}", serde_json::to_string(&result).unwrap());\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) {
          if (arg.length > 0 && typeof arg[0] === 'number') return `vec![${arg.join(', ')}]`;
          return `vec!["${arg.join('", "')}".to_string()]`;
        }
        return String(arg);
      },
    },

    ruby: {
      template: `{imports}\n{source}\n\nrequire 'json'\nresult = {funcCall}\nputs JSON.generate(result)`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return JSON.stringify(arg);
      },
    },

    php: {
      template: `<?php\n{imports}\n{source}\n\n$result = {funcCall};\necho json_encode($result);`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: (additionalImports || []).join("\n"),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) return `array(${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')})`;
        return JSON.stringify(arg);
      },
    },

    swift: {
      template: `import Foundation\n\n{source}\n\nlet result = {funcCall}\nif let jsonData = try? JSONEncoder().encode(result) {\n    if let jsonString = String(data: jsonData, encoding: .utf8) {\n        print(jsonString)\n    }\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return String(arg);
      },
    },

    kotlin: {
      template: `import kotlinx.serialization.encodeToString\nimport kotlinx.serialization.json.Json\n\n{source}\n\nfun main() {\n    val result = {funcCall}\n    println(Json.encodeToString(result))\n}`,
      funcCall: (n: string, a: string) => `${n}(${a})`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg}"`;
        if (Array.isArray(arg)) return `listOf(${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')})`;
        return arg;
      },
    },
  };

  const config = templates[language as keyof typeof templates];
  if (!config) throw new Error(`Unsupported language: ${language}`);

  const formattedArgs = args.map(config.argFormatter).join(", ");
  const funcCall = config.funcCall(funcName, formattedArgs);

  return config.template
    .replace("{imports}", config.imports)
    .replace("{source}", sourceCode)
    .replace("{funcCall}", funcCall);
}
