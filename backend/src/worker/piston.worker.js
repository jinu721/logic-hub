const { runCodeWithJudge0 } = require("../execution/judge0.helper");

module.exports = async function ({ language, files, options }) {
  try {
    console.log("WORKER PROCESSING:", { language, files, options });

    const langMap = {
      javascript: 63,
      typescript: 74,
      python: 71,
      java: 62
    };

    const languageId = langMap[language.toLowerCase()];

    if (!languageId) throw new Error("Unsupported language for Judge0");

    const result = await runCodeWithJudge0(languageId, files, options.stdin);

    return result;
  } catch (error) {
    console.error("WORKER ERROR:", error);
    throw error;
  }
};
