"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rustWrapper = void 0;
const rustWrapper = (userCode, funcName, testCases) => `
// === USER CODE START ===
${userCode}
// === USER CODE END ===

fn main() {
    let inputs = vec![
        ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
    ];

    for input in inputs {
        let result = ${funcName}(input.to_string());
        println!("{}", result);
    }
}
`.trim();
exports.rustWrapper = rustWrapper;
