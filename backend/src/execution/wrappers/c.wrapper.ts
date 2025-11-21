export function cWrapper(userCode: string, funcName: string) {
  const content = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// USER CODE
${userCode}

// Extract numbers inside JSON "args":[...]
double* parse_args(const char *json, int *count) {
    const char *start = strstr(json, "[");
    if (!start) { *count = 0; return NULL; }
    start++;

    double *list = malloc(sizeof(double) * 64); // allow up to 64 args
    *count = 0;
    char num[64];
    int ni = 0;

    while (*start && *start != ']') {
        char c = *start;
        if ((c >= '0' && c <= '9') || c == '.' || c == '-') {
            num[ni++] = c;
        } else {
            if (ni > 0) {
                num[ni] = 0;
                list[*count] = atof(num);
                (*count)++;
                ni = 0;
            }
        }
        start++;
    }

    if (ni > 0) {
        num[ni] = 0;
        list[*count] = atof(num);
        (*count)++;
    }

    return list;
}

int main() {
    char buf[4096];
    int r = fread(buf, 1, sizeof(buf)-1, stdin);
    buf[r] = 0;

    int count = 0;
    double *args = parse_args(buf, &count);

    double result;

    // Switch based on number of arguments
    if (count == 0) {
        result = ${funcName}();
    } else if (count == 1) {
        result = ${funcName}(args[0]);
    } else if (count == 2) {
        result = ${funcName}(args[0], args[1]);
    } else if (count == 3) {
        result = ${funcName}(args[0], args[1], args[2]);
    } else {
        // You can extend more if needed
        printf("{\\"error\\":\\"Too many args\\"}\\n");
        return 0;
    }

    printf("{\\"result\\":%g}\\n", result);
    return 0;
}
`.trim();
  return { name: "main.c", content };
}
