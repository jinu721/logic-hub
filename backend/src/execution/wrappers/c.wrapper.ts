export const cWrapper = (userCode: string, funcName: string, testCases: any[]) => `
#include <stdio.h>

// === USER CODE START ===
${userCode}
// === USER CODE END ===

int main() {
    char* inputs[] = {
        ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
    };

    int count = sizeof(inputs) / sizeof(inputs[0]);
    for (int i = 0; i < count; i++) {
        char* result = ${funcName}(inputs[i]);
        printf("%s\\n", result ? result : "null");
    }

    return 0;
}
`.trim();
