export const rustWrapper = (userCode: string, funcName: string, testCases: any[]) => `
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
