import React, { useState, ChangeEvent } from "react";
import { FlaskConical, Plus, X, Trash } from "lucide-react";

type TestCase = {
  input: (string | object)[];
  output: string | object;
  isHidden: boolean;
};

type Props = {
  showTestCases: boolean;
  formData: {
    testCases: TestCase[];
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      testCases: TestCase[];
    }>
  >;
};

const ChallengeFormTestcases: React.FC<Props> = ({
  showTestCases,
  formData,
  setFormData,
}) => {
  const [currentInputArg, setCurrentInputArg] = useState<string>("");
  const [currentTestCase, setCurrentTestCase] = useState<TestCase>({
    input: [],
    output: "",
    isHidden: false,
  });

  const addInputArg = () => {
    if (!currentInputArg.trim()) return;
    let parsedArg: string | object = currentInputArg;
    try {
      parsedArg = JSON.parse(currentInputArg);
    } catch {}
    setCurrentTestCase((prev) => ({
      ...prev,
      input: [...prev.input, parsedArg],
    }));
    setCurrentInputArg("");
  };

  const removeInputArg = (index: number) => {
    setCurrentTestCase((prev) => ({
      ...prev,
      input: prev.input.filter((_, i) => i !== index),
    }));
  };

  const handleTestCaseInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;

    if (type === "checkbox" && "checked" in e.target) {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setCurrentTestCase((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleTestCaseAdd = () => {
    if (
      currentTestCase.input.length === 0 ||
      !currentTestCase.output.toString().trim()
    )
      return;

    setFormData((prev) => ({
      ...prev,
      testCases: [...prev.testCases, currentTestCase],
    }));

    setCurrentTestCase({
      input: [],
      output: "",
      isHidden: false,
    });
  };

  const handleTestCaseRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  if (!showTestCases) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-800 rounded-full p-5 mb-4">
          <FlaskConical size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">
          Test Cases Not Available
        </h3>
        <p className="text-gray-400 max-w-md">
          Test cases are only available for Code challenge types. Switch the
          challenge type in the Details tab to access this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4 shadow-md">
        <h3 className="text-lg font-medium text-indigo-400 mb-3 flex items-center">
          <FlaskConical size={18} className="mr-2" />
          Add Test Case
        </h3>

        <div className="mb-3">
          <label className="block text-gray-300 mb-1 text-sm">
            Input Arguments
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={currentInputArg}
              onChange={(e) => setCurrentInputArg(e.target.value)}
              className="flex-grow bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add input argument (use JSON for objects/arrays)"
            />
            <button
              type="button"
              onClick={addInputArg}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add
            </button>
          </div>

          {currentTestCase.input.length > 0 && (
            <div className="mb-3 p-2 bg-gray-900 border border-gray-700 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">
                Current Arguments:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentTestCase.input.map((arg, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 px-2 py-1 rounded flex items-center"
                  >
                    <span className="text-xs text-gray-300 font-mono mr-2">
                      {typeof arg === "object"
                        ? JSON.stringify(arg)
                        : arg.toString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeInputArg(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="block text-gray-300 mb-1 text-sm">
            Expected Output
          </label>
          <textarea
            name="output"
            value={
              typeof currentTestCase.output === "object"
                ? JSON.stringify(currentTestCase.output)
                : currentTestCase.output
            }
            onChange={handleTestCaseInputChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={2}
            placeholder="Expected output (use JSON for objects/arrays)"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isHidden"
              name="isHidden"
              checked={currentTestCase.isHidden}
              onChange={handleTestCaseInputChange}
              className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="isHidden" className="ml-2 text-gray-300 text-sm">
              Hidden test case (not visible to users)
            </label>
          </div>

          <button
            type="button"
            onClick={handleTestCaseAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center text-sm shadow-md"
            disabled={
              currentTestCase.input.length === 0 ||
              !currentTestCase.output.toString().trim()
            }
          >
            <FlaskConical size={16} className="mr-1" />
            Add Test Case
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-white mb-3">Test Cases</h3>

        {formData.testCases.length > 0 ? (
          <div className="space-y-3">
            {formData.testCases.map((testCase, index) => (
              <div
                key={index}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-indigo-400 flex items-center">
                    Test Case #{index + 1}
                    {testCase.isHidden && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTestCaseRemove(index)}
                    className="text-gray-400 hover:text-red-400 p-1 rounded-full hover:bg-gray-700"
                  >
                    <Trash size={16} />
                  </button>
                </div>

                <div className="bg-gray-900 p-2 rounded-lg mb-2">
                  <div className="text-xs text-gray-400 mb-1">
                    Input Arguments:
                  </div>
                  <div className="font-mono text-xs text-gray-300 break-all">
                    {testCase.input.map((arg, i) => (
                      <div key={i} className="mb-1">
                        {typeof arg === "object"
                          ? JSON.stringify(arg)
                          : arg.toString()}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-2 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">
                    Expected Output:
                  </div>
                  <div className="font-mono text-xs text-gray-300 break-all">
                    {typeof testCase.output === "object"
                      ? JSON.stringify(testCase.output)
                      : testCase.output.toString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-700 rounded-lg bg-gray-800/50">
            <div className="mb-2">
              <FlaskConical size={24} className="text-gray-500 mx-auto" />
            </div>
            <p className="text-gray-400">No test cases added yet</p>
            <p className="text-gray-500 text-sm">
              Test cases help verify challenge solutions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeFormTestcases;
