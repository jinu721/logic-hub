export function cppWrapper(userCode: string, funcName: string) {
  const content = `
#include <bits/stdc++.h>
using namespace std;

${userCode}

vector<double> getArgs(const string &json) {
    vector<double> nums;
    string cur;
    bool inside = false;

    for (char c : json) {
        if (c == '[') { inside = true; continue; }
        if (c == ']') { 
            if (!cur.empty()) nums.push_back(stod(cur));
            break;
        }
        if (!inside) continue;

        if (isdigit(c) || c == '.' || c == '-') {
            cur.push_back(c);
        } else {
            if (!cur.empty()) {
                nums.push_back(stod(cur));
                cur.clear();
            }
        }
    }

    return nums;
}

int main() {
    string json, line;
    while (getline(cin, line)) json += line;

    auto args = getArgs(json);
    double result;

    if (args.size() == 0) result = ${funcName}();
    else if (args.size() == 1) result = ${funcName}(args[0]);
    else if (args.size() == 2) result = ${funcName}(args[0], args[1]);
    else if (args.size() == 3) result = ${funcName}(args[0], args[1], args[2]);
    else {
        cout << "{\\"error\\":\\"Too many args\\"}" << endl;
        return 0;
    }

    cout << "{\\"result\\":" << result << "}" << endl;
    return 0;
}
`.trim();
  return { name: "main.cpp", content };
}
