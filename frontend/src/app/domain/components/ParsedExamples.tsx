import React from "react";

interface ParsedExamplesProps {
  instructions: string;
}

const parseInstructionExamples = (instructionsText: string) => {
  if (!instructionsText) return { inputs: [], outputs: [], hasExamples: false };

  const inputRegex = /\(I\)\[(.*?)\]/g;
  const outputRegex = /\(O\)\[(.*?)\]/g;

  const inputs = [];
  const outputs = [];

  let inputMatch;
  while ((inputMatch = inputRegex.exec(instructionsText)) !== null) {
    inputs.push(inputMatch[1].trim());
  }

  let outputMatch;
  while ((outputMatch = outputRegex.exec(instructionsText)) !== null) {
    outputs.push(outputMatch[1].trim());
  }

  return {
    inputs,
    outputs,
    hasExamples: inputs.length > 0 && outputs.length > 0,
  };
};

const ParsedExamples: React.FC<ParsedExamplesProps> = ({ instructions }) => {
  const { inputs, outputs, hasExamples } =
    parseInstructionExamples(instructions);

  if (!hasExamples) return null;

  return (
    <>
      <h4 className="text-lg font-medium mt-6 mb-2">Example Input/Output</h4>
      {inputs.map((input, index) => {
        const output = outputs[index] || "No matching output";

        return (
          <div
            key={index}
            className="bg-gray-850 rounded-lg border border-gray-700 p-4 mb-6"
          >
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Input:</p>
              <pre className="bg-gray-900 p-3 rounded-md text-gray-300 overflow-auto">
                {input}
              </pre>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Expected Output:</p>
              <pre className="bg-gray-900 p-3 rounded-md text-green-300 overflow-auto">
                {output}
              </pre>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ParsedExamples;
