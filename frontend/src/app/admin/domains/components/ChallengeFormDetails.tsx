import React, { useState, ChangeEvent, JSX } from "react"
import { Lightbulb, Plus, Trash } from "lucide-react"

type ChallengeType = {
  id: string
  name: string
  icon: JSX.Element
}

type FormData = {
  type: string
  title: string
  description: string
  instructions: string
  functionSignature: string
  hints: string[]
  initialCode?: string
  solutionCode?: string
}

type Errors = {
  [key: string]: string | undefined
}

interface ChallengeFormDetailsProps {
  challengeTypes: ChallengeType[]
  formData: FormData
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
  errors: Errors
  setErrors: React.Dispatch<React.SetStateAction<Errors>>
}

const ChallengeFormDetails: React.FC<ChallengeFormDetailsProps> = ({
  challengeTypes,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const [currentHint, setCurrentHint] = useState("")

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const setType = (typeId: string) => {
    setFormData((prev) => ({
      ...prev,
      type: typeId,
    }))
    setErrors((prev) => ({ ...prev, type: undefined })) 
  }

  const handleHintAdd = () => {
    if (currentHint.trim() === "") return
    setFormData((prev) => ({
      ...prev,
      hints: [...prev.hints, currentHint.trim()],
    }))
    setCurrentHint("")
  }

  const handleHintRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }))
  }

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
        <label className="block text-gray-300 mb-1 font-medium">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full bg-gray-800 border ${
            errors.description ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          rows={3}
          placeholder="Brief description of the challenge"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium">
          Instructions <span className="text-red-500">*</span>
        </label>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleInputChange}
          className={`w-full bg-gray-800 border ${
            errors.instructions ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          rows={4}
          placeholder="Detailed instructions for the challenge"
        />
        {errors.instructions && (
          <p className="text-sm text-red-500 mt-1">{errors.instructions}</p>
        )}
      </div>

      {formData.type === "code" && (
        <div className="mb-4">
          <label className="block text-gray-300 mb-1 font-medium">
            Function Signature <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="functionSignature"
            value={formData.functionSignature}
            onChange={handleInputChange}
            className={`w-full bg-gray-800 border ${
              errors.functionSignature ? "border-red-500" : "border-gray-700"
            } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Enter function signature"
          />
          {errors.functionSignature && (
            <p className="text-sm text-red-500 mt-1">
              {errors.functionSignature}
            </p>
          )}
        </div>
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
          <label className="block text-gray-300 mb-1 font-medium">
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
    </div>
  )
}

export default ChallengeFormDetails
