import Piscina from "piscina";
import path from "path";

const piscina = new Piscina({
  filename: path.resolve(__dirname, "./piston.worker.js"), 
  execArgv: ['-r', 'ts-node/register'],
  minThreads: 2,
  maxThreads: 8,
});

export default piscina;