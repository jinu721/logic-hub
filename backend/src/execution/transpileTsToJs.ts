import ts from "typescript";

export function transpileTsToJs(code: string): string {
  const output = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.None }
  });
  return output.outputText;
}
