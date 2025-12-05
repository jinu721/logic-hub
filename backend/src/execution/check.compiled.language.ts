export const isCompiledLanguage = (lang: string) => {
  const compiled = ["c", "cpp", "c++", "java", "go", "rust", "csharp", "cs", "c#"];
  return compiled.includes(lang.toLowerCase());
}
