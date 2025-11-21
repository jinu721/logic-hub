export function safeParseExecutionOutput(rawOutput: string, testCases: any[]) {
  if (!rawOutput || typeof rawOutput !== "string") {
    return testCases.map((_, i) => ({
      success: false,
      error: `No output for test case ${i + 1}`,
    }));
  }

  let jsonText = "";

  const match = rawOutput.match(/\[[\s\S]*\]/);
  if (match) {
    jsonText = match[0];
  }

  try {
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    console.warn("Failed JSON parse:", e.message);
  }

  return testCases.map((_, i) => ({
    success: false,
    error: `Failed to parse result for test #${i + 1}`,
    raw: rawOutput,
  }));
}
