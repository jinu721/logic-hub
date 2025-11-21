import piscina from "./workerPool";


export const runInWorkerThread = async (language, files, options = {}) => {
  return await piscina.run({ language, files, options });
};
