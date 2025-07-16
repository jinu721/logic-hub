import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { X, AlertCircle, Check } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";
import { SolutionIF } from "@/types/solution.types";

interface Props {
  challenge: ChallengeDomainIF;
  initialSolution?: SolutionIF | null;
  onSubmit: (data: Partial<SolutionIF>) => Promise<void>;
  onCancel: () => void;
}

const SolutionForm: React.FC<Props> = ({
  challenge,
  initialSolution = null,
  onSubmit,
  onCancel,
}) => {
  const [solution, setSolution] = useState<Partial<SolutionIF>>({
    title: "",
    content: "",
    codeSnippet: "",
    language: "javascript",
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
        codeSnippet: initialSolution.codeSnippet || "",
        language: initialSolution.language || "javascript",
        timeComplexity: initialSolution.timeComplexity || "",
        spaceComplexity: initialSolution.spaceComplexity || "",
      });
    }
  }, [initialSolution]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (solution.title && !solution.title.trim()) newErrors.title = "Title is required";
    if (solution.content && !solution.content.trim()) newErrors.content = "Description is required";
    if (challenge?.type === "code" && !solution.codeSnippet?.trim()) {
      newErrors.codeSnippet = "Code solution is required";
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
      delete solutionData.codeSnippet;
      delete solutionData.language;
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
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
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.title ? "border-red-500" : "border-gray-600"
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
              className={`w-full h-32 px-4 py-3 bg-gray-700 border ${
                errors.content ? "border-red-500" : "border-gray-600"
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

          {/* Code Snippet */}
          {challenge?.type === "code" && (
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Code Solution <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <select
                    name="language"
                    className="bg-gray-600 text-xs px-2 py-1 rounded text-gray-200 border border-gray-500 focus:outline-none focus:border-indigo-500"
                    value={solution.language}
                    onChange={handleChange}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                    <option value="ruby">Ruby</option>
                    <option value="rust">Rust</option>
                  </select>
                </div>
                <textarea
                  name="codeSnippet"
                  className={`w-full h-64 px-4 py-3 bg-gray-900 border ${
                    errors.codeSnippet ? "border-red-500" : "border-gray-700"
                  } rounded-lg text-gray-200 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors`}
                  placeholder="// Paste your code here..."
                  value={solution.codeSnippet}
                  onChange={handleChange}
                />
                {errors.codeSnippet && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.codeSnippet}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-gray-700 flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium transition-colors"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 ${
              isSubmitting
                ? "bg-indigo-700"
                : "bg-indigo-600 hover:bg-indigo-500"
            } text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting..."
              : initialSolution
              ? "Update"
              : "Submit"}
            {!isSubmitting && <Check size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionForm;