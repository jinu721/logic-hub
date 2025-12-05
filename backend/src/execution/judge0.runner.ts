import axios from "axios";

export const runCodeWithJudge0 = async (languageId: number, sourceCode: string, stdin = "") => {
  //   const JUDGE0_URL = "http://16.16.182.216:2358/submissions?wait=true";
  const JUDGE0_URL =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

  //   const response = await axios.post(JUDGE0_URL, {
  //     language_id: languageId,
  //     source_code: files[0].content,
  //     stdin: stdin
  //   });

  const response = await axios.post(
    JUDGE0_URL,
    {
      language_id: languageId,
      source_code:sourceCode,
      stdin: stdin,
    },
    {
      headers: {
        "X-RapidAPI-Key": "89e6b7db7cmshfb847498a7c7e66p1bc5ccjsnb6232f2fbd6e",
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;

  return {
    run: {
      stdout: data.stdout || "",
      stderr: data.stderr || "",
      resultStatus: data.status?.description || "",
      statusId: data.status?.id || null,
      time: data.time ? Number(data.time) : null,      
      memory: data.memory ? Number(data.memory) : null,
      cpuTime: data.cpu_time ? Number(data.cpu_time) : null,
      compileOutput: data.compile_output || null,
      output: (data.stdout || "") + (data.stderr || "")
    },
    raw: data
  };
};


