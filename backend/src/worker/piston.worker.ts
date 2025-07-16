import { parentPort } from 'worker_threads';
import { runCodeWithPiston } from '../utils/piston.helper';

if (parentPort) {
  parentPort.on('message', async (data) => {
    const { language, code, input } = data;
    try {
      const result = await runCodeWithPiston(language, code, input);
      parentPort?.postMessage({ result });
    } catch (err: any) {
      parentPort?.postMessage({ error: err.message });
    }
  });
} else {
  console.error('This file is not being run as a worker thread.');
}
