export function tsWrapper(userCode: string, funcName: string) {
  const content = `
// USER CODE
${userCode}

// RUNNER (JS-style, SAME as JavaScript)
function getArgs(): unknown[] {
  try {
    const raw = require('fs').readFileSync(0, 'utf8');
    const json = raw ? JSON.parse(raw) : {};
    return Array.isArray(json.args) ? json.args : [];
  } catch {
    return [];
  }
}

try {
  const args = getArgs();
  const fn = (globalThis as Record<string, unknown>)["${funcName}"] ?? eval("${funcName}");

  if (typeof fn !== "function") {
    console.log(JSON.stringify({ error: "Function not found" }));
  } else {
    const result = (fn as (...x: unknown[]) => unknown)(...args);
    console.log(JSON.stringify({ result }));
  }
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.log(JSON.stringify({ error: msg }));
}
`.trim();

  return { name: "script.ts", content };
}
