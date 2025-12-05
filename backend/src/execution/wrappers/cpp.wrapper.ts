export const cppWrapper = (userCode: string, funcName: string, testCases: any[]) => `
#include <bits/stdc++.h>
using namespace std;

// === USER CODE START ===
${userCode}
// === USER CODE END ===

int main() {
    vector<string> inputs = {
        ${testCases.map((t) => `"${t.input[0]}"`).join(", ")}
    };

    for (auto &input : inputs) {
        try {
            auto result = ${funcName}(input);
            cout << result << endl;
        } catch (...) {
            cout << "error" << endl;
        }
    }
    return 0;
}
`.trim();
