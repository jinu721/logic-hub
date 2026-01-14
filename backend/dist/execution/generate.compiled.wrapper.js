"use strict";
// export const generateCompiledWrapper = (
//   language: string,
//   userCode: string,
//   funcName: string,
//   testCases: any[]
// ): string => {
//   switch (language.toLowerCase()) {
//     case "c":
//       return `
// #include <stdio.h>
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCompiledWrapper = void 0;
// // === USER CODE START ===
// ${userCode}
// // === USER CODE END ===
// int main() {
//     char* inputs[] = {
//         ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
//     };
//     int count = sizeof(inputs) / sizeof(inputs[0]);
//     for (int i = 0; i < count; i++) {
//         char* result = ${funcName}(inputs[i]);
//         printf("%s\\n", result ? result : "null");
//     }
//     return 0;
// }
// `.trim();
//     case "cpp":
//     case "c++":
//       return `
// #include <bits/stdc++.h>
// using namespace std;
// // === USER CODE START ===
// ${userCode}
// // === USER CODE END ===
// int main() {
//     vector<string> inputs = {
//         ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
//     };
//     for (auto &input : inputs) {
//         try {
//             auto result = ${funcName}(input);
//             cout << result << endl;
//         } catch (...) {
//             cout << "error" << endl;
//         }
//     }
//     return 0;
// }
// `.trim();
//     case "c#":
//     case "cs":
//     case "csharp":
//       return `
// using System;
// public class Program {
//     // === USER CODE START ===
// ${userCode}
//     // === USER CODE END ===
//     public static void Main() {
//         string[] inputs = new string[] {
//             ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
//         };
//         foreach (var input in inputs) {
//             try {
//                 var result = ${funcName}(input);
//                 Console.WriteLine(result);
//             } catch {
//                 Console.WriteLine("error");
//             }
//         }
//     }
// }
// `.trim();
//     case "java":
//       return `
// public class Main {
//     // === USER CODE START ===
// ${userCode}
//     // === USER CODE END ===
//     public static void main(String[] args) {
//         String[] inputs = new String[] {
//             ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
//         };
//         for (String input : inputs) {
//             try {
//                 String result = ${funcName}(input);
//                 System.out.println(result);
//             } catch (Exception e) {
//                 System.out.println("error");
//             }
//         }
//     }
// }
// `.trim();
//     case "go":
//       return `
// package main
// import (
//     "fmt"
//     "unicode"
// )
// // === USER CODE START ===
// ${userCode}
// // === USER CODE END ===
// func main() {
//     inputs := []string{
//         ${testCases.map((t) => `"${t.input[0]}",`).join("\n        ")}
//     }
//     for _, input := range inputs {
//         result := ${funcName}(input)
//         fmt.Println(result)
//     }
// }
// `.trim();
//     case "rust":
//       return `
// // === USER CODE START ===
// ${userCode}
// // === USER CODE END ===
// fn main() {
//     let inputs = vec![
//         ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
//     ];
//     for input in inputs {
//         let result = ${funcName}(input.to_string());
//         println!("{}", result);
//     }
// }
// `.trim();
//     default:
//       throw new Error("Compiled wrapper not implemented for: " + language);
//   }
// };
const wrappers_1 = require("./wrappers");
const generateCompiledWrapper = (language, userCode, funcName, testCases) => {
    switch (language.toLowerCase()) {
        case "c": return (0, wrappers_1.cWrapper)(userCode, funcName, testCases);
        case "cpp":
        case "c++": return (0, wrappers_1.cppWrapper)(userCode, funcName, testCases);
        case "java": return (0, wrappers_1.javaWrapper)(userCode, funcName, testCases);
        case "c#":
        case "csharp":
        case "cs": return (0, wrappers_1.csharpWrapper)(userCode, funcName, testCases);
        case "go": return (0, wrappers_1.goWrapper)(userCode, funcName, testCases);
        case "rust": return (0, wrappers_1.rustWrapper)(userCode, funcName, testCases);
        default: throw new Error("Compiled wrapper not implemented for: " + language);
    }
};
exports.generateCompiledWrapper = generateCompiledWrapper;
