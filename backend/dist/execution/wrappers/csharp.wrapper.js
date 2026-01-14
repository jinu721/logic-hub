"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csharpWrapper = void 0;
const csharpWrapper = (userCode, funcName, testCases) => `
using System;

public class Program {

    // === USER CODE START ===
${userCode}
    // === USER CODE END ===

    public static void Main() {

        string[] inputs = new string[] {
            ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
        };

        foreach (var input in inputs) {
            try {
                var result = ${funcName}(input);
                Console.WriteLine(result);
            } catch {
                Console.WriteLine("error");
            }
        }
    }
}
`.trim();
exports.csharpWrapper = csharpWrapper;
