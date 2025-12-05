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
  const getCodeValue = (codeField: string | Record<string, string>): string => {
    if (typeof codeField === "string") {
      return codeField || "";
    }
    if (typeof codeField === "object" && codeField !== null) {
      return codeField[selectedLanguage] || "";
    }
    return "";
  };

  const getCurrentLanguageName = (): string => {
    return languageOptions.find((l) => l.id === selectedLanguage)?.name || selectedLanguage;
  };

  const getLanguagesWithTemplates = (): string => {
    if (typeof formData.initialCode !== "object" || formData.initialCode === null) {
      return "None";
    }

    const langs = Object.keys(formData.initialCode)
      .filter((lang) => formData.initialCode[lang]?.trim())
      .map((lang) => languageOptions.find((l) => l.id === lang)?.name || lang);

    return langs.length > 0 ? langs.join(", ") : "None";
  };

  const isMultiLanguage = formData.type === "code";
  const initialCodeValue = getCodeValue(formData.initialCode);
  const solutionCodeValue = getCodeValue(formData.solutionCode);

  return (
    <>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-medium">
          Programming Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        >
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-medium">
          {isMultiLanguage
            ? `Initial Code (${getCurrentLanguageName()})`
            : "Initial Code"}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="initialCode"
          value={initialCodeValue}
          onChange={handleCodeChange}
          className={`w-full bg-gray-800 border ${
            errors.initialCode ? "border-red-500" : "border-gray-700"
          } rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
          rows={10}
          placeholder={`// ${getCurrentLanguageName()} template for the challenge`}
        />
        {errors.initialCode && (
          <p className="text-sm text-red-500 mt-1">{errors.initialCode}</p>
        )}

        {isMultiLanguage && typeof formData.initialCode === "object" && (
          <div className="mt-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400">
              <span className="font-medium">Languages with templates:</span>{" "}
              {getLanguagesWithTemplates()}
            </p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-medium">
          {isMultiLanguage
            ? `Solution Code (${getCurrentLanguageName()})`
            : "Solution Code"}
          <span className="text-xs text-gray-500 ml-2">(Admin only)</span>
        </label>
        <textarea
          name="solutionCode"
          value={solutionCodeValue}
          onChange={handleCodeChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          rows={10}
          placeholder={`// ${getCurrentLanguageName()} solution code (only visible to admins)`}
        />
      </div>
    </>
  );
};

export default ChallengeFormCode;