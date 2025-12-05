export const goWrapper = (userCode: string, funcName: string, testCases: any[]) => `
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
