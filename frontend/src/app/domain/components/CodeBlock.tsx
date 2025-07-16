import { useState } from "react";
import { Copy } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 rounded-t">
        <span className="text-sm text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="text-gray-400 hover:text-white flex items-center text-xs"
        >
          {copied ? "Copied!" : "Copy"} <Copy size={14} className="ml-1" />
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
          padding: "1rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
