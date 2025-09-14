import piscina from "./workerPool";

export const runInWorkerThread = async (
  language: string,
  code: string,
  input: string
): Promise<any> => {
  console.log("RUN IN WORKER THREAD RECEIVED:", { language, code, input });
  return await piscina.run({ language, code, input });
};
