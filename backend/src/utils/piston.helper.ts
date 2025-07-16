import axios from "axios";

export const runCodeWithPiston = async (
  language: string,
  sourceCode: string,
  input: string
) => {
  const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
    language,
    version: "*",
    files: [{ name: "main", content: sourceCode }],
    stdin: input,
  });

  return response.data;
};
