import { FC } from "react";
import { AlertTriangle } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

interface DomainInstructionsProps {
  challenge?: ChallengeDomainIF;
}

const DomainInstructions: FC<DomainInstructionsProps> = ({ challenge }) => {

  return (
    <div className="max-w-none">
      <div className="">
        <div className="rounded-xl p-4 backdrop-blur-sm markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl font-bold text-slate-100 mb-3 mt-4 first:mt-0"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-bold text-slate-100 mb-3 mt-4 first:mt-0"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-bold text-slate-100 mb-2 mt-3 first:mt-0"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="text-base font-bold text-slate-100 mb-2 mt-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-slate-300 text-sm leading-relaxed mb-3"
                  {...props}
                />
              ),
              code: ({ node, inline, className, ...props }: any) => {
                return inline ? (
                  <code
                    className="bg-blue-900/30 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono border border-blue-800/30"
                    {...props}
                  />
                ) : (
                  <code className={`${className} text-sm`} {...props} />
                );
              },
              pre: ({ node, ...props }) => (
                <pre
                  className="rounded-lg overflow-x-auto mb-4 p-4 border border-slate-700/50"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside text-slate-300 text-sm mb-3 space-y-1 ml-2"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside text-slate-300 text-sm mb-3 space-y-1 ml-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-slate-300 leading-relaxed" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue-500 pl-4 py-2 italic text-slate-400 mb-3 bg-blue-950/20"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table
                    className="min-w-full border-collapse border border-slate-600 rounded-lg overflow-hidden text-sm"
                    {...props}
                  />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-slate-700/50" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border border-slate-600 px-3 py-2 text-left text-slate-100 font-semibold"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border border-slate-600 px-3 py-2 text-slate-300"
                  {...props}
                />
              ),
              img: ({ node, ...props }) => (
                <img
                  className="max-w-full h-auto rounded-lg my-3 border border-slate-700"
                  {...props}
                />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-slate-700 my-4" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-slate-100 font-semibold" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="text-slate-200 italic" {...props} />
              ),
            }}
          >
            {challenge?.instructions || "*No instructions provided*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default DomainInstructions;
