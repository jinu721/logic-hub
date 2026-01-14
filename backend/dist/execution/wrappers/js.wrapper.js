"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsWrapper = jsWrapper;
function jsWrapper(userCode, funcName) {
    const content = `
// USER CODE
${userCode}

// RUNNER
const fs = require("fs");

function safeCall(fn, args) {
  try {
    return { actual: fn(...args) };
  } catch (err) {
    return { error: String(err.message || err) };
  }
}

try {
  const raw = fs.readFileSync(0, "utf8") || "{}";
  const payload = JSON.parse(raw);

  // Node.js does NOT put functions on globalThis -> use eval
  let fn = null;
  try { fn = eval(payload.funcName); } catch {}

  if (typeof fn !== "function") {
    console.log(JSON.stringify({ error: "Function not found" }));
    process.exit(0);
  }

  const results = [];

  for (const t of payload.testcases || []) {
    const res = safeCall(fn, t.input || []);
    results.push({
      input: t.input,
      expected: t.expected,
      actual: res.actual,
      error: res.error
    });
  }

  console.log(JSON.stringify({ results }));
} catch (e) {
  console.log(JSON.stringify({ error: String(e.message || e) }));
}
  `.trim();
    return { name: "index.js", content };
}
