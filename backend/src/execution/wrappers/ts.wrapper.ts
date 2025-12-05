export function tsWrapper(userCode: string, funcName: string) {
  const content = `
// USER CODE
${userCode}

// RUNNER (JS-style, SAME as JavaScript)
function getArgs(): any[] {
  try {
    const raw = require('fs').readFileSync(0, 'utf8');
    const json = raw ? JSON.parse(raw) : {};
    return json.args || [];
  } catch {
    return [];
  }
}

try {
  const args = getArgs();
  const fn = (globalThis as any)["${funcName}"] || eval("${funcName}");

  if (typeof fn !== "function") {
    console.log(JSON.stringify({ error: "Function not found" }));
  } else {
    const result = fn(...args);
    console.log(JSON.stringify({ result }));
  }
} catch (e) {
  console.log(JSON.stringify({ error: String(e && e.message ? e.message : e) }));
}
`.trim();

  return { name: "script.ts", content };
}
