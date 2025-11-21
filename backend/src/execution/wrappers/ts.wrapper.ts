export function tsWrapper(userCode: string, funcName: string) {
  // TypeScript runner — send as .ts (Judge0 supports ts), similar to JS:
  const content = `
// user code
${userCode}

// runner
import * as fs from 'fs';
try {
  const raw = fs.readFileSync(0, 'utf8');
  const data = raw ? JSON.parse(raw) : { args: [] };
  const args = data.args || [];
  // @ts-ignore
  const fn = (globalThis as any)["${funcName}"] || (typeof (globalThis as any)["${funcName}"] === 'function' && (globalThis as any)["${funcName}"]);
  if (!fn) throw new Error("Function ${funcName} not found");
  const result = fn(...args);
  console.log(JSON.stringify({ result }));
} catch (e) {
  console.log(JSON.stringify({ error: String((e as any).message || e) }));
}
`.trim();
  return { name: "index.ts", content };
}