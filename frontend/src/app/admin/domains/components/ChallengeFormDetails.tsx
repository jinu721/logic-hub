import React, { useState, ChangeEvent, JSX } from "react";
import { Lightbulb, Plus, Trash, Maximize2 } from "lucide-react";
import InstructionEditor from "./InstructionEditor";

type ChallengeType = {
  id: string;
  name: string;
  icon: JSX.Element;
};

type FormData = {
  type: string;
  title: string;
  description: string;
  instructions: string;
  mode: string;
  functionName: string;
  parameters: { name: string; type: string }[];
  returnType: string;
  hints: string[];
  initialCode?: string;
  solutionCode?: string;
};

type Errors = {
  [key: string]: string | undefined;
};

interface ChallengeFormDetailsProps {
  challengeTypes: ChallengeType[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

const ChallengeFormDetails: React.FC<ChallengeFormDetailsProps> = ({
  challengeTypes,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const [currentHint, setCurrentHint] = useState("");
  const [showRichEditor, setShowRichEditor] = useState(false);
  const typeOptions = [
    "String",
    "Number",
    "Boolean",
    "Array",
    "Object",
    "Void",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setType = (typeId: string) => {
    setFormData((prev) => ({
      ...prev,
      type: typeId,
    }));
    setErrors((prev) => ({ ...prev, type: undefined }));
  };

  const handleHintAdd = () => {
    if (currentHint.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      hints: [...prev.hints, currentHint.trim()],
    }));
    setCurrentHint("");
  };

  const handleHintRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionsUpdate = (newInstructions: string) => {
    setFormData((prev) => ({ ...prev, instructions: newInstructions }));
    setErrors((prev) => ({ ...prev, instructions: undefined }));
  };

  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [...formData.parameters, { name: "", type: "" }],
    });
  };

  const handleParameterChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.parameters];
    updated[index][name] = value;
    setFormData({ ...formData, parameters: updated });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2 font-medium">
          Challenge Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {challengeTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setType(type.id)}
              className={`cursor-pointer border rounded-lg p-3 flex items-center ${
                formData.type === type.id
                  ? "border-indigo-500 bg-indigo-900/20"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
              } transition-all`}
            >
              {type.icon}
              <span
                className={
                  formData.type === type.id
                    ? "text-indigo-300"
                    : "text-gray-300"
                }
              >
                {type.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full bg-gray-800 border ${
            errors.title ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="Enter challenge title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium flex items-center justify-between">
          <span>
            Instructions <span className="text-red-500">*</span>
          </span>
          <button
            type="button"
            onClick={() => setShowRichEditor(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center text-xs transition-colors"
          >
            <Maximize2 size={14} className="mr-1" />
            Open Full Editor
          </button>
        </label>
        <div
          onClick={() => setShowRichEditor(true)}
          className={`w-full bg-gray-800 border ${
            errors.instructions ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white min-h-[100px] cursor-pointer hover:border-indigo-500 transition-colors ${
            !formData.instructions ? "text-gray-500" : ""
          }`}
        >
          {formData.instructions ? (
            <div className="text-sm line-clamp-4">{formData.instructions}</div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Click to open full editor with rich text formatting
            </div>
          )}
        </div>
        {errors.instructions && (
          <p className="text-sm text-red-500 mt-1">{errors.instructions}</p>
        )}
      </div>

      {formData.type === "code" && (
        <>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">
              Function Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="functionName"
              value={formData.functionName}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
              placeholder="Enter function name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">
              Return Type <span className="text-red-500">*</span>
            </label>
            <select
              name="returnType"
              value={formData.returnType}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
            >
              <option value="">Select return type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-1 font-medium">
              Parameters
            </label>

            {formData?.parameters?.map((param, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Parameter name"
                  value={param.name}
                  onChange={(e) => handleParameterChange(index, e)}
                  className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
                />

                <select
                  name="type"
                  value={param.type}
                  onChange={(e) => handleParameterChange(index, e)}
                  className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white"
                >
                  <option value="">Type</option>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="button"
              onClick={addParameter}
              className="mt-2 bg-indigo-600 px-3 py-1 rounded text-white"
            >
              + Add Parameter
            </button>
          </div>
        </>
      )}

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium flex items-center">
          <Lightbulb size={16} className="mr-2 text-yellow-500" />
          Hints
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={currentHint}
            onChange={(e) => setCurrentHint(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a helpful hint"
          />
          <button
            type="button"
            onClick={handleHintAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
        {formData.hints.length > 0 ? (
          <div className="space-y-2">
            {formData.hints.map((hint, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 flex justify-between items-center"
              >
                <p className="text-gray-300 text-sm">{hint}</p>
                <button
                  type="button"
                  onClick={() => handleHintRemove(index)}
                  className="text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-700"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border border-dashed border-gray-700 rounded-lg bg-gray-800/50">
            <p className="text-gray-400 text-sm">No hints added yet</p>
          </div>
        )}
      </div>

      {formData.type === "cipher" && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">
            Encrypted Message
          </label>
          <textarea
            name="initialCode"
            value={formData.initialCode || ""}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Enter sample cipher text"
          />
          <label className="block text-gray-300 mb-1 font-medium mt-3">
            Decrypted Message
          </label>
          <textarea
            name="solutionCode"
            value={formData.solutionCode || ""}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Enter sample decrypted text"
          />
        </div>
      )}

      {showRichEditor && (
        <InstructionEditor
          value={formData.instructions}
          onChange={handleInstructionsUpdate}
          onClose={() => setShowRichEditor(false)}
        />
      )}
    </div>
  );
};

export default ChallengeFormDetails;
