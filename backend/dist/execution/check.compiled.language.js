"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompiledLanguage = void 0;
const isCompiledLanguage = (lang) => {
    const compiled = ["c", "cpp", "c++", "java", "go", "rust", "csharp", "cs", "c#"];
    return compiled.includes(lang.toLowerCase());
};
exports.isCompiledLanguage = isCompiledLanguage;
