const { runCodeWithPiston } = require("../shared/utils/execution/piston.helper");

module.exports = async function ({ language, code, input }) {
  try {
    console.log("WORKER PROCESSING:", { language, input });
    const result = await runCodeWithPiston(language, code, input);
    console.log("WORKER RESULT:", result?.run?.stdout || 'No output');
    return result;
  } catch (error) {
    console.error("WORKER ERROR:", error.message);
    throw error;
  }
};