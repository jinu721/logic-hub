import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  Clock,
  Tag,
  BrainCircuit,
  Calendar,
  Star,
  Code,
} from "lucide-react"; 
type Level = {
  id: string;
  name: string;
  color: string;
};
type Status = {
  value: string;
  label: string;
};

type FormData = {
  level: string;
  status: string;
  timeLimit: number | "";
  startTime?: string;
  endTime?: string;
  isPremium: boolean;
  isKeyRequired: boolean;
  isActive: boolean;
};

type Errors = {
  timeLimit?: string;
};

type Props = {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  levels: Level[];
  statuses: Status[];
  errors: Errors;
  tagsInput: string;
  handleTagsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  skillsInput: string;
  handleSkillsChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const ChallengeFormSettings: React.FC<Props> = ({
  formData,
  setFormData,
  levels,
  statuses,
  errors,
  tagsInput,
  handleTagsChange,
  skillsInput,
  handleSkillsChange,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium">
            Challenge Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((level) => (
              <div
                key={level.id}
                onClick={() => setFormData({ ...formData, level: level.id })}
                className={`cursor-pointer border rounded-lg p-2.5 flex flex-col items-center ${
                  formData.level === level.id
                    ? "border-indigo-500 bg-indigo-900/20"
                    : "border-gray-700 bg-gray-800 hover:border-gray-600"
                } transition-all`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${level.color} mb-1`}
                ></div>
                <span
                  className={
                    formData.level === level.id
                      ? "text-indigo-300"
                      : "text-gray-300"
                  }
                >
                  {level.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium flex items-center">
            <Clock size={16} className="mr-2 text-blue-400" />
            Time Limit (minutes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="timeLimit"
            value={formData.timeLimit}
            onChange={handleInputChange}
            min={1}
            max={120}
            className={`w-full bg-gray-800 border ${
              errors.timeLimit ? "border-red-500" : "border-gray-700"
            } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          />
          {errors.timeLimit && (
            <p className="text-sm text-red-500 mt-1">{errors.timeLimit}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-1 font-medium flex items-center">
            <Tag size={16} className="mr-2 text-green-400" />
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={handleTagsChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="algorithms, data structures, etc."
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium flex items-center">
          <BrainCircuit size={16} className="mr-2 text-purple-400" />
          Required Skills (comma separated)
        </label>
        <input
          type="text"
          value={skillsInput}
          onChange={handleSkillsChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="javascript, recursion, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-1 font-medium flex items-center">
            <Calendar size={16} className="mr-2 text-yellow-400" />
            Start Date (Optional)
          </label>
          <input
            type="date"
            name="startTime"
            value={formData.startTime || ""}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-1 font-medium flex items-center">
            <Calendar size={16} className="mr-2 text-yellow-400" />
            End Date (Optional)
          </label>
          <input
            type="date"
            name="endTime"
            value={formData.endTime || ""}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
          <input
            type="checkbox"
            id="isPremium"
            name="isPremium"
            checked={formData.isPremium}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
          />
          <label
            htmlFor="isPremium"
            className="ml-2 text-gray-300 flex items-center"
          >
            <Star size={16} className="mr-2 text-yellow-400" />
            Premium Challenge
          </label>
        </div>

        <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
          <input
            type="checkbox"
            id="isKeyRequired"
            name="isKeyRequired"
            checked={formData.isKeyRequired}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
          />
          <label
            htmlFor="isKeyRequired"
            className="ml-2 text-gray-300 flex items-center"
          >
            <Code size={16} className="mr-2 text-blue-400" />
            Requires Access Key
          </label>
        </div>
      </div>

      <div className="flex items-center bg-gray-800 p-3 rounded-lg border border-gray-700 mb-4">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
        />
        <label htmlFor="isActive" className="ml-2 text-gray-300">
          Challenge Visible to Users
        </label>
      </div>
    </div>
  );
};

export default ChallengeFormSettings;
