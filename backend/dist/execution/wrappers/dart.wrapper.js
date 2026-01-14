"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dartWrapper = dartWrapper;
function dartWrapper(userCode, funcName) {
    const content = `
import 'dart:convert';
import 'dart:io';

// USER CODE
${userCode}

// RUNNER SUPPORT
final Map<String, Function> globalFunctions = {
  "${funcName}": ${funcName},
};

dynamic safeCall(Function fn, List<dynamic> args) {
  try {
    return {"actual": Function.apply(fn, args)};
  } catch (e) {
    return {"error": e.toString()};
  }
}

void main() {
  try {
    final raw = stdin.readLineSync() ?? "{}";
    final payload = jsonDecode(raw);

    final fnName = payload["funcName"];
    final fn = globalFunctions[fnName];

    if (fn == null) {
      print(jsonEncode({"error": "Function not found"}));
      return;
    }

    final List results = [];

    for (final tc in payload["testcases"] ?? []) {
      final args = tc["input"] is List ? tc["input"] : [];
      final r = safeCall(fn, args);
      results.add({
        "input": tc["input"],
        "expected": tc["expected"],
        "actual": r["actual"],
        "error": r["error"]
      });
    }

    print(jsonEncode({"results": results}));
  } catch (e) {
    print(jsonEncode({"error": e.toString()}));
  }
}
`.trim();
    return { name: "main.dart", content };
}
