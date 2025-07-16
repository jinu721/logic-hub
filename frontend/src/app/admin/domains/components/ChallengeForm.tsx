import React from "react";
import {
  Code,
} from "lucide-react";
import ChallengeFormDetails from "./ChallengeFormDetails";
import ChallengeFormCode from "./ChallengeFormCode";
import ChallengeFormTestcases from "./ChallengeFormTestcases";
import ChallengeFormSettings from "./ChallengeFormSettings";
import ChallengeFormReward from "./ChallengeFormReward";
import { ChallengeDomainIF } from "@/types/domain.types";

type LanguageOption = { id: string; name: string };

type FormData = Record<string, any>;

type Errors = Record<string, string | undefined>;

type ChallengeType = any;

type Level = any;
type Status = any;

type Props = {
  challenge?: ChallengeDomainIF | null;
  onClose: () => void;
  activeTab: string;
  setActiveTab: React.Dispatch<
    React.SetStateAction<
      string
    >
  >;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  showCodeFields: boolean;
  languageOptions: LanguageOption[];
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
  challengeTypes: ChallengeType[];
  handleCodeChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  showTestCases: boolean;
  levels: Level[];
  statuses: Status[];
  tagsInput: string;
  handleTagsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  skillsInput: string;
  handleSkillsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  isLoading: boolean;
};

export default function ChallengeForm({
  activeTab,
  showCodeFields,
  languageOptions,
  selectedLanguage,
  setSelectedLanguage,
  formData,
  setFormData,
  errors,
  setErrors,
  challengeTypes,
  handleCodeChange,
  showTestCases,
  levels,
  statuses,
  tagsInput,
  handleTagsChange,
  skillsInput,
  handleSkillsChange,
  handleInputChange,
}: Props) {
  return (
    <>
      {activeTab === "details" && (
        <ChallengeFormDetails
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          challengeTypes={challengeTypes}
        />
      )}
      {activeTab === "code" && (
        <div className="space-y-4">
          {showCodeFields ? (
            <>
              {formData.type === "code" && (
                <ChallengeFormCode
                  languageOptions={languageOptions}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  formData={formData}
                  errors={errors}
                  handleCodeChange={handleCodeChange}
                />
              )}

              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">
                  {formData.type === "code"
                    ? `Initial Code (${
                        languageOptions.find((l) => l.id === selectedLanguage)
                          ?.name
                      })`
                    : "Initial Code"}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="initialCode"
                  value={
                    formData.type === "code" &&
                    typeof formData.initialCode === "object"
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
                          languageOptions.find((l) => l.id === selectedLanguage)
                            ?.name
                        } template for the challenge`
                      : "// Code template for the challenge"
                  }
                />
                {errors.initialCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.initialCode}
                  </p>
                )}

                {formData.type === "code" &&
                  typeof formData.initialCode === "object" && (
                    <div className="mt-2 p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-xs text-gray-400">
                        Languages with templates:{" "}
                        {Object.keys(formData.initialCode)
                          .filter((lang) => formData.initialCode[lang]?.trim())
                          .map(
                            (lang) =>
                              languageOptions.find((l) => l.id === lang)
                                ?.name || lang
                          )
                          .join(", ") || "None"}
                      </p>
                    </div>
                  )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1 font-medium">
                  {formData.type === "code"
                    ? `Solution Code (${
                        languageOptions.find((l) => l.id === selectedLanguage)
                          ?.name
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
                          languageOptions.find((l) => l.id === selectedLanguage)
                            ?.name
                        } solution code (only visible to admins)`
                      : "// Solution code (only visible to admins)"
                  }
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-gray-800 rounded-full p-5 mb-4">
                <Code size={32} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                Code Editor Not Available
              </h3>
              <p className="text-gray-400 max-w-md">
                Code editor is only available for Code challenge types. Switch
                the challenge type in the Details tab to access this feature.
              </p>
            </div>
          )}
        </div>
      )}
      {activeTab === "testCases" && (
        <ChallengeFormTestcases
          showTestCases={showTestCases}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {activeTab === "settings" && (
        <ChallengeFormSettings
          formData={formData}
          setFormData={setFormData}
          levels={levels}
          statuses={statuses}
          errors={errors}
          tagsInput={tagsInput}
          handleTagsChange={handleTagsChange}
          skillsInput={skillsInput}
          handleSkillsChange={handleSkillsChange}
          handleInputChange={handleInputChange}
        />
      )}
      {activeTab === "rewards" && (
        <ChallengeFormReward
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      )}
    </>
  );
}
