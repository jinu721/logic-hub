import { Worker } from 'worker_threads';
import path from 'path';

export const runInWorkerThread = (language: string, code: string, input: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, './piston.worker')); 

    worker.postMessage({ language, code, input});

    worker.on('message', (msg) => {
      if (msg.result) {
        resolve(msg.result);
      } else {
        reject(msg.error);
      }
      worker.terminate();
    });

    worker.on('error', (err) => {
      reject(err);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}
