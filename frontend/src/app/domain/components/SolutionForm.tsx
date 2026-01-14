import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { X, AlertCircle, Check, Plus, Trash2 } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";
import { SolutionIF } from "@/types/solution.types";

interface Props {
  challenge: ChallengeDomainIF;
  initialSolution?: SolutionIF | null;
  onSubmit: (data: Partial<SolutionIF>) => Promise<void>;
  onCancel: () => void;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "rust", label: "Rust" },
];

const SolutionForm: React.FC<Props> = ({
  challenge,
  initialSolution = null,
  onSubmit,
  onCancel,
}) => {
  const [solution, setSolution] = useState<Partial<SolutionIF>>({
    title: "",
    content: "",
    implementations: [{ language: "javascript", codeSnippet: "" }],
    timeComplexity: "",
    spaceComplexity: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSolution) {
      setSolution({
        title: initialSolution.title || "",
        content: initialSolution.content || "",
        implementations: initialSolution.implementations && initialSolution.implementations.length > 0
          ? initialSolution.implementations
          : [{ language: "javascript", codeSnippet: "" }],
        timeComplexity: initialSolution.timeComplexity || "",
        spaceComplexity: initialSolution.spaceComplexity || "",
      });
    }
  }, [initialSolution]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!solution.title?.trim()) newErrors.title = "Title is required";
    if (!solution.content?.trim()) newErrors.content = "Description is required";

    if (challenge?.type === "code") {
      const hasEmptyCode = solution.implementations?.some(impl => !impl.codeSnippet.trim());
      if (hasEmptyCode) {
        newErrors.implementations = "All code solutions must have content";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const solutionData: Partial<SolutionIF> = {
      ...solution,
      challenge: challenge?._id,
    };

    if (challenge?.type !== "code") {
      delete solutionData.implementations;
    }

    onSubmit(solutionData).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSolution((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImplementationChange = (index: number, field: string, value: string) => {
    const updatedImplementations = [...(solution.implementations || [])];
    updatedImplementations[index] = { ...updatedImplementations[index], [field]: value };
    setSolution((prev) => ({ ...prev, implementations: updatedImplementations }));

    if (errors.implementations) {
      setErrors((prev) => ({ ...prev, implementations: null }));
    }
  };

  const addImplementation = () => {
    setSolution((prev) => ({
      ...prev,
      implementations: [
        ...(prev.implementations || []),
        { language: "javascript", codeSnippet: "" }
      ]
    }));
  };

  const removeImplementation = (index: number) => {
    if ((solution.implementations?.length || 0) <= 1) return;
    const updatedImplementations = solution.implementations?.filter((_, i) => i !== index);
    setSolution((prev) => ({ ...prev, implementations: updatedImplementations }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h3 className="text-xl font-bold text-white">
            {initialSolution ? "Update Your Solution" : "Add Your Solution"}
          </h3>
          <button className="text-gray-400 hover:text-white" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Solution Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              className={`w-full px-4 py-2 bg-gray-700 border ${errors.title ? "border-red-500" : "border-gray-600"
                } rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors`}
              placeholder="e.g., Optimized HashMap Approach"
              value={solution.title}
              onChange={handleChange}
            />
            {errors.title && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Solution Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              className={`w-full h-32 px-4 py-3 bg-gray-700 border ${errors.content ? "border-red-500" : "border-gray-600"
                } rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors`}
              placeholder="Describe your approach and reasoning..."
              value={solution.content}
              onChange={handleChange}
            />
            {errors.content && (
              <div className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.content}
              </div>
            )}
          </div>

          {/* Automate Complexity Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Time Complexity</label>
              <input
                type="text"
                name="timeComplexity"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g., O(n log n)"
                value={solution.timeComplexity}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Space Complexity</label>
              <input
                type="text"
                name="spaceComplexity"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g., O(n)"
                value={solution.spaceComplexity}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Implementations List */}
          {challenge?.type === "code" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-gray-300 text-sm font-medium">
                  Code Implementations <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addImplementation}
                  className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={14} /> Add Language
                </button>
              </div>

              {errors.implementations && (
                <div className="text-red-500 text-sm flex items-center mb-2">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.implementations}
                </div>
              )}

              <div className="space-y-6">
                {solution.implementations?.map((impl, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Implementation #{index + 1}</span>
                        <select
                          className="bg-gray-700 text-xs px-3 py-1.5 rounded-lg text-gray-200 border border-gray-600 focus:outline-none focus:border-indigo-500"
                          value={impl.language}
                          onChange={(e) => handleImplementationChange(index, "language", e.target.value)}
                        >
                          {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                        </select>
                      </div>
                      {solution.implementations!.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImplementation(index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    <textarea
                      className="w-full h-64 px-4 py-3 bg-gray-950 border border-gray-800 rounded-lg text-gray-200 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder={`// Paste your ${impl.language} code here...`}
                      value={impl.codeSnippet}
                      onChange={(e) => handleImplementationChange(index, "codeSnippet", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-4 bg-gray-800 sticky bottom-0 z-10">
          <button
            type="button"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-8 py-2 ${isSubmitting
                ? "bg-indigo-700 opacity-70 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
              } text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : initialSolution
                ? "Update Solution"
                : "Post Solution"}
            {!isSubmitting && <Check size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionForm;
