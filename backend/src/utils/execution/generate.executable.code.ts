export function generateExecutableCode(
  language: string,
  sourceCode: string,
  funcName: string,
  testCases: any[], 
  additionalImports?: string[]
): string {
  const templates = {
    javascript: {
      template: `{imports}\n{source}\n\nconst results = [];\nconst originalLog = console.log;\n\n{testCalls}\n\nconsole.log = originalLog;\nconsole.log(JSON.stringify(results));`,
      testCall: (n: string, a: string, index: number) => `// Test case ${index + 1}\nconst caseLogs${index} = [];\nconsole.log = (...args) => caseLogs${index}.push(args.map(arg => String(arg)).join(' '));\ntry {\n  const result${index} = ${n}(${a});\n  results.push({ success: true, result: result${index}, logs: caseLogs${index} });\n} catch (error) {\n  results.push({ success: false, error: error.message, logs: caseLogs${index} });\n}\nconsole.log = originalLog;`,
      imports: '',
      argFormatter: (arg: any) => JSON.stringify(arg),
    },

    typescript: {
      template: `{imports}\n{source}\n\nconst results: any[] = [];\nconst originalLog = console.log;\n\n{testCalls}\n\nconsole.log = originalLog;\nconsole.log(JSON.stringify(results));`,
      testCall: (n: string, a: string, index: number) => `// Test case ${index + 1}\nconst caseLogs${index}: string[] = [];\nconsole.log = (...args: any[]) => caseLogs${index}.push(args.map(arg => String(arg)).join(' '));\ntry {\n  const result${index} = ${n}(${a});\n  results.push({ success: true, result: result${index}, logs: caseLogs${index} });\n} catch (error) {\n  results.push({ success: false, error: (error as Error).message, logs: caseLogs${index} });\n}\nconsole.log = originalLog;`,
      imports: '',
      argFormatter: (arg: any) => JSON.stringify(arg),
    },

    python: {
      template: `import json\nimport sys\nfrom io import StringIO\n{imports}\n{source}\n\nresults = []\noriginal_stdout = sys.stdout\n\n{testCalls}\n\nsys.stdout = original_stdout\nprint(json.dumps(results))`,
      testCall: (n: string, a: string, index: number) => `# Test case ${index + 1}\ncaptured_output${index} = StringIO()\nsys.stdout = captured_output${index}\ntry:\n    result${index} = ${n}(${a})\n    logs${index} = [line.rstrip() for line in captured_output${index}.getvalue().split('\\n') if line.strip()]\n    results.append({"success": True, "result": result${index}, "logs": logs${index}})\nexcept Exception as error:\n    logs${index} = [line.rstrip() for line in captured_output${index}.getvalue().split('\\n') if line.strip()]\n    results.append({"success": False, "error": str(error), "logs": logs${index}})\nfinally:\n    sys.stdout = original_stdout`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return JSON.stringify(arg);
      },
    },

    java: {
      template: `import com.google.gson.Gson;\nimport java.util.*;\nimport java.io.*;\n{imports}\n\n{source}\n\npublic class Main {\n    private static final ByteArrayOutputStream logBuffer = new ByteArrayOutputStream();\n    private static final PrintStream originalOut = System.out;\n    \n    public static void main(String[] args) {\n        Solution solution = new Solution();\n        List<Map<String, Object>> results = new ArrayList<>();\n        Gson gson = new Gson();\n        \n{testCalls}\n        \n        System.setOut(originalOut);\n        System.out.println(gson.toJson(results));\n    }\n    \n    private static List<String> getLogsAndReset() {\n        String output = logBuffer.toString();\n        logBuffer.reset();\n        List<String> logs = new ArrayList<>();\n        if (!output.isEmpty()) {\n            String[] lines = output.split("\\n");\n            for (String line : lines) {\n                if (!line.trim().isEmpty()) {\n                    logs.add(line.trim());\n                }\n            }\n        }\n        return logs;\n    }\n}`,
      testCall: (n: string, a: string, index: number) => `        // Test case ${index + 1}\n        System.setOut(new PrintStream(logBuffer));\n        try {\n            Object result${index} = solution.${n}(${a});\n            List<String> logs${index} = getLogsAndReset();\n            Map<String, Object> successResult${index} = new HashMap<>();\n            successResult${index}.put("success", true);\n            successResult${index}.put("result", result${index});\n            successResult${index}.put("logs", logs${index});\n            results.add(successResult${index});\n        } catch (Exception error) {\n            List<String> logs${index} = getLogsAndReset();\n            Map<String, Object> errorResult${index} = new HashMap<>();\n            errorResult${index}.put("success", false);\n            errorResult${index}.put("error", error.getMessage());\n            errorResult${index}.put("logs", logs${index});\n            results.add(errorResult${index});\n        } finally {\n            System.setOut(originalOut);\n        }`,
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
      template: `#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\n#include <exception>\nusing namespace std;\n\n{source}\n\nclass LogCapture {\npublic:\n    vector<string> logs;\n    streambuf* originalCoutBuf;\n    ostringstream capturedOutput;\n    \n    LogCapture() {\n        originalCoutBuf = cout.rdbuf();\n        cout.rdbuf(capturedOutput.rdbuf());\n    }\n    \n    ~LogCapture() {\n        cout.rdbuf(originalCoutBuf);\n    }\n    \n    void captureLogs() {\n        string output = capturedOutput.str();\n        capturedOutput.str("");\n        capturedOutput.clear();\n        \n        if (!output.empty()) {\n            stringstream ss(output);\n            string line;\n            while (getline(ss, line)) {\n                if (!line.empty()) {\n                    logs.push_back(line);\n                }\n            }\n        }\n    }\n};\n\nstring toJsonString(const string& value) {\n    return "\\""+value+"\\"";\n}\n\ntemplate<typename T>\nstring toJsonString(const vector<T>& vec) {\n    stringstream ss;\n    ss << "[";\n    for (size_t i = 0; i < vec.size(); ++i) {\n        if (i > 0) ss << ",";\n        ss << toJsonString(vec[i]);\n    }\n    ss << "]";\n    return ss.str();\n}\n\ntemplate<typename T>\nstring toJsonString(const T& value) {\n    stringstream ss;\n    ss << value;\n    return ss.str();\n}\n\nstring vectorToJsonArray(const vector<string>& logs) {\n    stringstream ss;\n    ss << "[";\n    for (size_t i = 0; i < logs.size(); ++i) {\n        if (i > 0) ss << ",";\n        ss << "\\"" << logs[i] << "\\"";\n    }\n    ss << "]";\n    return ss.str();\n}\n\nint main() {\n    cout << "[";\n    bool first = true;\n    \n{testCalls}\n    \n    cout << "]" << endl;\n    return 0;\n}`,
      testCall: (n: string, a: string, index: number) => `    // Test case ${index + 1}\n    {\n        LogCapture logCapture;\n        try {\n            auto result${index} = ${n}(${a});\n            logCapture.captureLogs();\n            if (!first) cout << ",";\n            cout << "{\\"success\\":true,\\"result\\":" << toJsonString(result${index}) << ",\\"logs\\":" << vectorToJsonArray(logCapture.logs) << "}";\n            first = false;\n        } catch (const exception& error) {\n            logCapture.captureLogs();\n            if (!first) cout << ",";\n            cout << "{\\"success\\":false,\\"error\\":\\"" << error.what() << "\\",\\"logs\\":" << vectorToJsonArray(logCapture.logs) << "}"; \n            first = false;\n        }\n    }`,
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
      template: `using System;\nusing System.Collections.Generic;\nusing System.IO;\nusing Newtonsoft.Json;\n{imports}\n\n{source}\n\nclass Program {\n    static void Main() {\n        Solution solution = new Solution();\n        var results = new List<object>();\n        var originalOut = Console.Out;\n        \n{testCalls}\n        \n        Console.SetOut(originalOut);\n        Console.WriteLine(JsonConvert.SerializeObject(results));\n    }\n}`,
      testCall: (n: string, a: string, index: number) => `        // Test case ${index + 1}\n        using (var logWriter${index} = new StringWriter()) {\n            Console.SetOut(logWriter${index});\n            try {\n                var result${index} = solution.${n}(${a});\n                var logs${index} = logWriter${index}.ToString().Split(new[] { '\\n' }, StringSplitOptions.RemoveEmptyEntries);\n                results.Add(new { success = true, result = result${index}, logs = logs${index} });\n            } catch (Exception error) {\n                var logs${index} = logWriter${index}.ToString().Split(new[] { '\\n' }, StringSplitOptions.RemoveEmptyEntries);\n                results.Add(new { success = false, error = error.Message, logs = logs${index} });\n            } finally {\n                Console.SetOut(originalOut);\n            }\n        }`,
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
      template: `package main\n\nimport (\n    "bytes"\n    "encoding/json"\n    "fmt"\n    "io"\n    "os"\n    "strings"\n)\n\ntype Result struct {\n    Success bool        \`json:"success"\`\n    Result  interface{} \`json:"result,omitempty"\`\n    Error   string      \`json:"error,omitempty"\`\n    Logs    []string    \`json:"logs"\`\n}\n\n{source}\n\nfunc captureOutput(fn func()) ([]string, interface{}, error) {\n    originalStdout := os.Stdout\n    r, w, _ := os.Pipe()\n    os.Stdout = w\n    \n    var result interface{}\n    var err error\n    var logs []string\n    \n    done := make(chan bool)\n    go func() {\n        defer func() {\n            if r := recover(); r != nil {\n                err = fmt.Errorf("%v", r)\n            }\n            done <- true\n        }()\n        result = fn()\n    }()\n    \n    go func() {\n        var buf bytes.Buffer\n        io.Copy(&buf, r)\n        output := buf.String()\n        if output != "" {\n            lines := strings.Split(strings.TrimSpace(output), "\\n")\n            for _, line := range lines {\n                if strings.TrimSpace(line) != "" {\n                    logs = append(logs, strings.TrimSpace(line))\n                }\n            }\n        }\n        done <- true\n    }()\n    \n    <-done\n    w.Close()\n    <-done\n    os.Stdout = originalStdout\n    \n    return logs, result, err\n}\n\nfunc main() {\n    var results []Result\n    \n{testCalls}\n    \n    jsonResult, _ := json.Marshal(results)\n    fmt.Println(string(jsonResult))\n}`,
      testCall: (n: string, a: string, index: number) => `    // Test case ${index + 1}\n    logs${index}, result${index}, err${index} := captureOutput(func() interface{} {\n        return ${n}(${a})\n    })\n    \n    if err${index} != nil {\n        results = append(results, Result{Success: false, Error: err${index}.Error(), Logs: logs${index}})\n    } else {\n        results = append(results, Result{Success: true, Result: result${index}, Logs: logs${index}})\n    }`,
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
      template: `use serde_json;\nuse serde::{Serialize, Deserialize};\nuse std::sync::{Arc, Mutex};\nuse std::io::{self, Write};\n\n#[derive(Serialize, Deserialize)]\nstruct TestResult {\n    success: bool,\n    #[serde(skip_serializing_if = "Option::is_none")]\n    result: Option<serde_json::Value>,\n    #[serde(skip_serializing_if = "Option::is_none")]\n    error: Option<String>,\n    logs: Vec<String>,\n}\n\nstruct LogCapture {\n    logs: Arc<Mutex<Vec<String>>>,\n}\n\nimpl LogCapture {\n    fn new() -> Self {\n        LogCapture {\n            logs: Arc::new(Mutex::new(Vec::new())),\n        }\n    }\n    \n    fn capture_print(&self, msg: &str) {\n        if let Ok(mut logs) = self.logs.lock() {\n            logs.push(msg.to_string());\n        }\n    }\n    \n    fn get_logs(&self) -> Vec<String> {\n        if let Ok(logs) = self.logs.lock() {\n            logs.clone()\n        } else {\n            Vec::new()\n        }\n    }\n}\n\n// Mock print macro for capturing\nstatic mut LOG_CAPTURE: Option<*const LogCapture> = None;\n\nmacro_rules! captured_println {\n    ($($arg:tt)*) => {\n        unsafe {\n            if let Some(capture_ptr) = LOG_CAPTURE {\n                let capture = &*capture_ptr;\n                capture.capture_print(&format!($($arg)*));\n            }\n        }\n    };\n}\n\n{source}\n\nfn main() {\n    let mut results = Vec::new();\n    \n{testCalls}\n    \n    println!("{}", serde_json::to_string(&results).unwrap());\n}`,
      testCall: (n: string, a: string, index: number) => `    // Test case ${index + 1}\n    {\n        let log_capture${index} = LogCapture::new();\n        unsafe {\n            LOG_CAPTURE = Some(&log_capture${index} as *const LogCapture);\n        }\n        \n        match std::panic::catch_unwind(|| {\n            ${n}(${a})\n        }) {\n            Ok(result${index}) => {\n                let logs${index} = log_capture${index}.get_logs();\n                results.push(TestResult {\n                    success: true,\n                    result: Some(serde_json::to_value(&result${index}).unwrap()),\n                    error: None,\n                    logs: logs${index},\n                });\n            }\n            Err(_) => {\n                let logs${index} = log_capture${index}.get_logs();\n                results.push(TestResult {\n                    success: false,\n                    result: None,\n                    error: Some("Function panicked".to_string()),\n                    logs: logs${index},\n                });\n            }\n        }\n        \n        unsafe {\n            LOG_CAPTURE = None;\n        }\n    }`,
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
      template: `{imports}\n{source}\n\nrequire 'json'\nrequire 'stringio'\n\nresults = []\noriginal_stdout = $stdout\n\n{testCalls}\n\n$stdout = original_stdout\nputs JSON.generate(results)`,
      testCall: (n: string, a: string, index: number) => `# Test case ${index + 1}\ncaptured_output${index} = StringIO.new\n$stdout = captured_output${index}\nbegin\n  result${index} = ${n}(${a})\n  logs${index} = captured_output${index}.string.split("\\n").map(&:strip).reject(&:empty?)\n  results << { success: true, result: result${index}, logs: logs${index} }\nrescue => error\n  logs${index} = captured_output${index}.string.split("\\n").map(&:strip).reject(&:empty?)\n  results << { success: false, error: error.message, logs: logs${index} }\nensure\n  $stdout = original_stdout\nend`,
      imports: (additionalImports || []).join('\n'),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return JSON.stringify(arg);
      },
    },

    php: {
      template: `<?php\n{imports}\n{source}\n\n$results = array();\n\nfunction captureOutput($callable) {\n    ob_start();\n    $error = null;\n    $result = null;\n    \n    try {\n        $result = call_user_func($callable);\n    } catch (Exception $e) {\n        $error = $e;\n    }\n    \n    $output = ob_get_clean();\n    $logs = array_filter(array_map('trim', explode("\\n", $output)), function($line) {\n        return !empty($line);\n    });\n    \n    return array(\n        'result' => $result,\n        'error' => $error,\n        'logs' => array_values($logs)\n    );\n}\n\n{testCalls}\n\necho json_encode($results);`,
      testCall: (n: string, a: string, index: number) => `// Test case ${index + 1}\n$captured${index} = captureOutput(function() use (${'$' + a}) {\n    return ${n}(${a});\n});\n\nif ($captured${index}['error'] !== null) {\n    $results[] = array(\n        'success' => false,\n        'error' => $captured${index}['error']->getMessage(),\n        'logs' => $captured${index}['logs']\n    );\n} else {\n    $results[] = array(\n        'success' => true,\n        'result' => $captured${index}['result'],\n        'logs' => $captured${index}['logs']\n    );\n}`,
      imports: (additionalImports || []).join("\n"),
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg.replace(/"/g, '\\"')}"`;
        if (Array.isArray(arg)) return `array(${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')})`;
        return JSON.stringify(arg);
      },
    },

    swift: {
      template: `import Foundation\n\nstruct TestResult: Codable {\n    let success: Bool\n    let result: AnyCodable?\n    let error: String?\n    let logs: [String]\n}\n\nstruct AnyCodable: Codable {\n    let value: Any\n    \n    init<T: Codable>(_ value: T) {\n        self.value = value\n    }\n    \n    func encode(to encoder: Encoder) throws {\n        var container = encoder.singleValueContainer()\n        if let intValue = value as? Int {\n            try container.encode(intValue)\n        } else if let stringValue = value as? String {\n            try container.encode(stringValue)\n        } else if let arrayValue = value as? [Any] {\n            try container.encode(arrayValue.map { AnyCodable($0 as! Codable) })\n        }\n    }\n    \n    init(from decoder: Decoder) throws {\n        let container = try decoder.singleValueContainer()\n        if let intValue = try? container.decode(Int.self) {\n            value = intValue\n        } else if let stringValue = try? container.decode(String.self) {\n            value = stringValue\n        } else {\n            value = ""\n        }\n    }\n}\n\nclass LogCapture {\n    private var logs: [String] = []\n    private let originalPrint = print\n    \n    func startCapturing() {\n        // Note: Swift doesn't have easy stdout redirection in playground/script context\n        // This is a simplified version that would need platform-specific implementation\n    }\n    \n    func stopCapturing() -> [String] {\n        let capturedLogs = logs\n        logs.removeAll()\n        return capturedLogs\n    }\n    \n    func capturePrint(_ items: Any..., separator: String = " ", terminator: String = "\\n") {\n        let output = items.map { "\\($0)" }.joined(separator: separator)\n        logs.append(output)\n    }\n}\n\n{source}\n\nvar results: [TestResult] = []\n{testCalls}\n\nif let jsonData = try? JSONEncoder().encode(results) {\n    if let jsonString = String(data: jsonData, encoding: .utf8) {\n        print(jsonString)\n    }\n}`,
      testCall: (n: string, a: string, index: number) => `// Test case ${index + 1}\ndo {\n    let logCapture${index} = LogCapture()\n    logCapture${index}.startCapturing()\n    \n    let result${index} = ${n}(${a})\n    let logs${index} = logCapture${index}.stopCapturing()\n    \n    results.append(TestResult(success: true, result: AnyCodable(result${index}), error: nil, logs: logs${index}))\n} catch {\n    let logs${index}: [String] = [] // Would need proper log capture implementation\n    results.append(TestResult(success: false, result: nil, error: error.localizedDescription, logs: logs${index}))\n}`,
      imports: '',
      argFormatter: (arg: any) => {
        if (typeof arg === 'string') return `"${arg}"`;
        if (Array.isArray(arg)) return `[${arg.map(i => (typeof i === 'string' ? `"${i}"` : i)).join(', ')}]`;
        return String(arg);
      },
    },

    kotlin: {
      template: `import kotlinx.serialization.Serializable\nimport kotlinx.serialization.encodeToString\nimport kotlinx.serialization.json.Json\nimport java.io.*\n\n@Serializable\ndata class TestResult(\n    val success: Boolean,\n    val result: String? = null,\n    val error: String? = null,\n    val logs: List<String> = emptyList()\n)\n\n{source}\n\nfun captureOutput(block: () -> Any?): Triple<Any?, Throwable?, List<String>> {\n    val originalOut = System.out\n    val outputStream = ByteArrayOutputStream()\n    val printStream = PrintStream(outputStream)\n    System.setOut(printStream)\n    \n    var result: Any? = null\n    var error: Throwable? = null\n    \n    try {\n        result = block()\n    } catch (e: Throwable) {\n        error = e\n    } finally {\n        System.setOut(originalOut)\n    }\n    \n    val output = outputStream.toString()\n    val logs = output.split("\\n").map { it.trim() }.filter { it.isNotEmpty() }\n    \n    return Triple(result, error, logs)\n}\n\nfun main() {\n    val results = mutableListOf<TestResult>()\n    \n{testCalls}\n    \n    println(Json.encodeToString(results))\n}`,
      testCall: (n: string, a: string, index: number) => `    // Test case ${index + 1}\n    val (result${index}, error${index}, logs${index}) = captureOutput {\n        ${n}(${a})\n    }\n    \n    if (error${index} != null) {\n        results.add(TestResult(\n            success = false,\n            error = error${index}.message,\n            logs = logs${index}\n        ))\n    } else {\n        results.add(TestResult(\n            success = true,\n            result = result${index}.toString(),\n            logs = logs${index}\n        ))\n    }`,
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

  const testCalls = testCases.map((testCase, index) => {
    const formattedArgs = testCase.input.map(config.argFormatter).join(", ");
    return config.testCall(funcName, formattedArgs, index);
  }).join('\n\n');

  return config.template
    .replace("{imports}", config.imports)
    .replace("{source}", sourceCode)
    .replace("{testCalls}", testCalls);
}