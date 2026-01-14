"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goWrapper = void 0;
const goWrapper = (userCode, funcName, testCases) => `
package main
import (
    "fmt"
    "unicode"
)

// === USER CODE START ===
${userCode}
// === USER CODE END ===

func main() {
    inputs := []string{
        ${testCases.map((t) => `"${t.input[0]}",`).join("\n        ")}
    }

    for _, input := range inputs {
        result := ${funcName}(input)
        fmt.Println(result)
    }
}
`.trim();
exports.goWrapper = goWrapper;
