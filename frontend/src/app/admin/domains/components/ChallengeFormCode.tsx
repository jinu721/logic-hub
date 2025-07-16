import React from "react";

type LanguageOption = {
  id: string;
  name: string;
};

type FormData = {
  type: string;
  initialCode: string | Record<string, string>;
  solutionCode: string | Record<string, string>;
};

type Errors = {
  initialCode?: string;
};

type Props = {
  languageOptions: LanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: (id: string) => void;
  formData: FormData;
  errors: Errors;
  handleCodeChange: React.ChangeEventHandler<HTMLTextAreaElement>;
};

const ChallengeFormCode = ({
  languageOptions,
  selectedLanguage,
  setSelectedLanguage,
  formData,
  errors,
  handleCodeChange,
}: Props) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium">
          Programming Language
        </label>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium">
          {formData.type === "code"
            ? `Initial Code (${
                languageOptions.find((l) => l.id === selectedLanguage)?.name
              })`
            : "Initial Code"}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          name="initialCode"
          value={
            formData.type === "code" && typeof formData.initialCode === "object"
              ? formData.initialCode[selectedLanguage] || ""
              : typeof formData.initialCode === "string"
              ? formData.initialCode || ""
              : ""
          }
          onChange={handleCodeChange}
          className={`w-full bg-gray-800 border ${
            errors.initialCode ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          rows={8}
          placeholder={
            formData.type === "code"
              ? `// ${
                  languageOptions.find((l) => l.id === selectedLanguage)?.name
                } template for the challenge`
              : "// Code template for the challenge"
          }
        />
        {errors.initialCode && (
          <p className="text-sm text-red-500 mt-1">{errors.initialCode}</p>
        )}

        {formData.type === "code" &&
          typeof formData.initialCode === "object" && (
            <div className="mt-2 p-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400">
                Languages with templates:{" "}
                {typeof formData.initialCode === "object" &&
                formData.initialCode !== null
                  ? Object.keys(formData.initialCode as Record<string, string>)
                      .filter((lang) =>
                        (formData.initialCode as Record<string, string>)[
                          lang
                        ]?.trim()
                      )
                      .map(
                        (lang) =>
                          languageOptions.find((l) => l.id === lang)?.name ||
                          lang
                      )
                      .join(", ") || "None"
                  : "None"}
              </p>
            </div>
          )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium">
          {formData.type === "code"
            ? `Solution Code (${
                languageOptions.find((l) => l.id === selectedLanguage)?.name
              })`
            : "Solution Code"}
        </label>
        <textarea
          name="solutionCode"
          value={
            formData.type === "code" &&
            typeof formData.solutionCode === "object"
              ? formData.solutionCode?.[selectedLanguage] || ""
              : typeof formData.solutionCode === "string"
              ? formData.solutionCode || ""
              : ""
          }
          onChange={handleCodeChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={8}
          placeholder={
            formData.type === "code"
              ? `// ${
                  languageOptions.find((l) => l.id === selectedLanguage)?.name
                } solution code (only visible to admins)`
              : "// Solution code (only visible to admins)"
          }
        />
      </div>
    </>
  );
};

export default ChallengeFormCode;
