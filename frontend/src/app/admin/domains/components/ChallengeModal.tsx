"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  X,
  Save,
  Code,
  Plus,
  BookOpen,
  FlaskConical,
  Award,
} from "lucide-react";
import ChallengeForm from "./ChallengeForm";
import { ChallengeDomainIF } from "@/types/domain.types";

interface ChallengeModalProps {
  challenge?: ChallengeDomainIF | null;
  onClose: () => void;
  onSave: (data: ChallengeDomainIF, id?: string) => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState<ChallengeDomainIF>({
    title: "",
    instructions: "",
    type: "code",
    level: "novice",
    timeLimit: 30,
    tags: [],
    requiredSkills: [],
    functionName: "",
    parameters: [],
    returnType: "",
    isPremium: false,
    isKeyRequired: false,
    initialCode: "",
    solutionCode: "",
    isActive: true,
    testCases: [],
    hints: [],
    status: "active",
    xpRewards: 100,
    startTime: null,
    endTime: null,
  });

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [languageOptions] = useState([
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "typescript", name: "TypeScript" },
    { id: "ruby", name: "Ruby" },
    { id: "php", name: "PHP" },
    { id: "dart", name: "Dart" },
  ]);

  const [tagsInput, setTagsInput] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    { id: "novice", name: "Novice", color: "bg-green-500" },
    { id: "adept", name: "Adept", color: "bg-yellow-500" },
    { id: "master", name: "Master", color: "bg-red-500" },
  ];

  const challengeTypes = [
    {
      id: "code",
      name: "Code Challenge",
      icon: <Code size={16} className="mr-2" />,
    },
    {
      id: "cipher",
      name: "Cipher Challenge",
      icon: <BookOpen size={16} className="mr-2" />,
    },
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "inactive", label: "Inactive", color: "bg-gray-500" },
  ];

  useEffect(() => {
    if (challenge) {
      const initialCode = challenge.initialCode;
      const solutionCode = challenge.solutionCode;

      if (
        challenge.type === "code" &&
        typeof challenge.initialCode === "object"
      ) {
        const languages = Object.keys(challenge.initialCode);
        if (languages.length > 0) {
          setSelectedLanguage(languages[0]);
        }
      }

      setFormData({
        ...challenge,
        tags: Array.isArray(challenge.tags) ? challenge.tags : [],
        requiredSkills: Array.isArray(challenge.requiredSkills)
          ? challenge.requiredSkills
          : [],
        testCases: challenge.testCases || [],
        hints: Array.isArray(challenge.hints) ? challenge.hints : [],
        initialCode: initialCode || (challenge.type === "code" ? {} : ""),
        solutionCode: solutionCode || (challenge.type === "code" ? {} : ""),
        startTime: challenge.startTime
          ? new Date(challenge.startTime).toISOString().split("T")[0]
          : null,
        endTime: challenge.endTime
          ? new Date(challenge.endTime).toISOString().split("T")[0]
          : null,
      });

      setTagsInput(
        Array.isArray(challenge.tags) ? challenge.tags.join(", ") : ""
      );
      setSkillsInput(
        Array.isArray(challenge.requiredSkills)
          ? challenge.requiredSkills.join(", ")
          : ""
      );
    }
  }, [challenge]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && e.target instanceof HTMLInputElement
        ? e.target.checked
        : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    validateForm();
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData({ ...formData, tags });
    setTagsInput(e.target.value);
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setFormData({ ...formData, requiredSkills: skills });
    setSkillsInput(e.target.value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "Challenge title is required";
    if (!formData.instructions)
      newErrors.instructions = "Instructions are required";
    if (formData.type === "code" && !isInitialCodeValid())
      newErrors.initialCode =
        "Initial code template is required for at least one language";
    if (formData.type === "code" && !formData.functionName)
      newErrors.functionSignature = "functionSignature required";
    if (!formData.timeLimit || formData.timeLimit <= 0)
      newErrors.timeLimit = "Valid time limit is required";
    if (!formData.xpRewards || formData.xpRewards <= 0)
      newErrors.xpRewards = "Valid XP rewards is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    onSave(formData, challenge?._id);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData.type === "code") {
      setFormData((prev: any) => ({
        ...prev,
        [name]: {
          ...(typeof prev[name] === "object" ? prev[name] : {}),
          [selectedLanguage]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    validateForm();
  };

  const isInitialCodeValid = () => {
    if (formData.type !== "code") return true;
    if (typeof formData.initialCode === "object") {
      return (
        Object.keys(formData.initialCode).length > 0 &&
        Object.values(formData.initialCode).some(
          (code: any) => code.trim() !== ""
        )
      );
    }
    return false;
  };

  const showCodeFields = formData.type === "code";
  const showTestCases = formData.type === "code";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-indigo-900/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
          <h2 className="text-xl font-bold text-white flex items-center">
            {challenge?._id ? (
              <>
                <Code size={20} className="mr-2 text-indigo-400" />
                Edit Challenge
              </>
            ) : (
              <>
                <Plus size={20} className="mr-2 text-indigo-400" />
                Create Challenge
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex border-b border-indigo-900/30 overflow-x-auto bg-gray-900/50">
          {[
            { tab: "details", icon: <BookOpen size={16} className="mr-2" /> },
            { tab: "code", icon: <Code size={16} className="mr-2" /> },
            {
              tab: "testCases",
              icon: <FlaskConical size={16} className="mr-2" />,
            },
            { tab: "settings", icon: null },
            { tab: "rewards", icon: <Award size={16} className="mr-2" /> },
          ].map(({ tab, icon }) => (
            <button
              key={tab}
              className={`px-4 py-3 font-medium flex items-center ${
                activeTab === tab
                  ? "border-b-2 border-indigo-500 text-indigo-400 bg-indigo-900/20"
                  : "text-gray-400 hover:bg-gray-800/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {icon}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4 bg-gray-900/80 border-indigo-900/20">
          <form onSubmit={handleSubmit}>
            <ChallengeForm
              challenge={challenge}
              onClose={onClose}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleSubmit={handleSubmit}
              showCodeFields={showCodeFields}
              languageOptions={languageOptions}
              selectedLanguage={selectedLanguage}
              formData={formData}
              setFormData={setFormData as any}
              errors={errors}
              setErrors={setErrors as any}
              challengeTypes={challengeTypes}
              handleCodeChange={handleCodeChange}
              showTestCases={showTestCases}
              levels={levels}
              statuses={statuses}
              tagsInput={tagsInput}
              handleTagsChange={handleTagsChange}
              skillsInput={skillsInput}
              handleSkillsChange={handleSkillsChange}
              handleInputChange={handleInputChange}
              isLoading={isLoading}
              setSelectedLanguage={setSelectedLanguage}
            />
            <div className="sticky bottom-0 mt-4 pt-3 border-t border-gray-800 bg-gray-900 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg mr-2 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-pulse mr-2">●</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    {challenge?._id ? "Update Challenge" : "Create Challenge"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChallengeModal;
