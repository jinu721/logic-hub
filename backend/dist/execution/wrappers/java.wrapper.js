"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.javaWrapper = void 0;
const javaWrapper = (userCode, funcName, testCases) => `
public class Main {

    // === USER CODE START ===
${userCode}
    // === USER CODE END ===

    public static void main(String[] args) {

        String[] inputs = new String[] {
            ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
        };

        for (String input : inputs) {
            try {
                String result = ${funcName}(input);
                System.out.println(result);
            } catch (Exception e) {
                System.out.println("error");
            }
        }
    }
}
`.trim();
exports.javaWrapper = javaWrapper;
