export function jsWrapper(userCode: string, funcName: string) {
  const content = `
// user code
${userCode}

// runner
const fs = require('fs');
try {
  const raw = fs.readFileSync(0, 'utf8');
  const data = raw ? JSON.parse(raw) : { args: [] };
  const args = data.args || [];
  const fn = globalThis["${funcName}"] || (typeof ${funcName} === "function" && ${funcName});
  if (!fn) throw new Error("Function ${funcName} not found");
  const result = fn(...args);
  console.log(JSON.stringify({ result }));
} catch (e) {
  console.log(JSON.stringify({ error: String(e && e.message ? e.message : e) }));
}
`.trim();
  return { name: "index.js", content };
}
