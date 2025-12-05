import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Save,
  Heading,
  Link,
  Quote,
  Eye,
  EyeOff,
  Maximize2,
} from "lucide-react";

interface InstructionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const InstructionEditor: React.FC<InstructionEditorProps> = ({
  value,
  onChange,
  onClose,
}) => {
  const [content, setContent] = useState(value);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(value);
  }, []);

  const insertText = useCallback(
    (before: string, after: string = "", placeholder: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newContent =
        content.slice(0, start) +
        before +
        textToInsert +
        after +
        content.slice(end);

      setContent(newContent);

      setTimeout(() => {
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [content]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const newContent = content.slice(0, start) + text + content.slice(start);

      setContent(newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    },
    [content]
  );

  const handleSave = useCallback(() => {
    onChange(content);
    onClose();
  }, [content, onChange, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const createToolbarAction = (action: () => void) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  };

  const toolbarButtons = [
    {
      icon: <Heading size={18} />,
      label: "Heading",
      action: createToolbarAction(() => insertAtCursor("\n## Heading\n")),
    },
    {
      icon: <Bold size={18} />,
      label: "Bold",
      action: createToolbarAction(() => insertText("**", "**", "bold text")),
    },
    {
      icon: <Italic size={18} />,
      label: "Italic",
      action: createToolbarAction(() => insertText("*", "*", "italic text")),
    },
    {
      icon: <Code size={18} />,
      label: "Inline Code",
      action: createToolbarAction(() => insertText("`", "`", "code")),
    },
    {
      icon: <List size={18} />,
      label: "Bullet List",
      action: createToolbarAction(() =>
        insertAtCursor("\n- List item\n- Another item\n")
      ),
    },
    {
      icon: <ListOrdered size={18} />,
      label: "Numbered List",
      action: createToolbarAction(() =>
        insertAtCursor("\n1. First item\n2. Second item\n")
      ),
    },
    {
      icon: <Quote size={18} />,
      label: "Quote",
      action: createToolbarAction(() => insertAtCursor("\n> Quote text\n")),
    },
    {
      icon: <Link size={18} />,
      label: "Link",
      action: createToolbarAction(() =>
        insertText("[", "](https://example.com)", "link text")
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-900 border border-indigo-900/50 w-[95vw] h-[90vh] flex flex-col shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
          <div className="flex items-center space-x-3">
            <Maximize2 className="text-indigo-400" size={20} />
            <h2 className="text-white font-bold text-lg">
              Instructions Editor
            </h2>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
              Markdown supported
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={createToolbarAction(() => setShowPreview(!showPreview))}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center transition-colors"
            >
              {showPreview ? (
                <>
                  <EyeOff size={16} className="mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2" />
                  Show Preview
                </>
              )}
            </button>
            <button
              type="button"
              onClick={createToolbarAction(handleSave)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm flex items-center transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={createToolbarAction(handleCancel)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <X className="text-gray-400" size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-3 border-b border-gray-800 bg-gray-900/50 flex-wrap">
          {toolbarButtons.map((btn, idx) => (
            <button
              key={idx}
              type="button"
              onClick={btn.action}
              onMouseDown={(e) => e.preventDefault()}
              className="p-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors group relative"
              title={btn.label}
            >
              {btn.icon}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-950 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {btn.label}
              </span>
            </button>
          ))}

          <div className="h-6 w-px bg-gray-700 mx-2"></div>

          <button
            type="button"
            onClick={createToolbarAction(() =>
              insertAtCursor(
                "\n```javascript\nfunction example() {\n  console.log('Hello World');\n}\n```\n"
              )
            )}
            onMouseDown={(e) => e.preventDefault()}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300 transition-colors"
          >
            Code Block
          </button>
          <button
            type="button"
            onClick={createToolbarAction(() =>
              insertAtCursor(
                "\n### Testcases\n```\nInput: \nOutput: \nExplanation: \n```\n"
              )
            )}
            onMouseDown={(e) => e.preventDefault()}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300 transition-colors"
          >
            Testcase
          </button>

          <button
            type="button"
            onClick={createToolbarAction(() =>
              insertAtCursor(
                "\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Data 1   | Data 2   | Data 3   |\n| Data 4   | Data 5   | Data 6   |\n"
              )
            )}
            onMouseDown={(e) => e.preventDefault()}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300 transition-colors"
          >
            Table
          </button>

          <button
            type="button"
            onClick={createToolbarAction(() =>
              insertAtCursor(
                "\n![Image description](https://placehold.co/600x400)\n"
              )
            )}
            onMouseDown={(e) => e.preventDefault()}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs rounded-lg text-gray-300 transition-colors"
          >
            Image
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor */}
          <div
            className={`${
              showPreview ? "w-1/2" : "w-full"
            } flex flex-col border-r border-gray-800`}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 bg-gray-950 text-gray-300 p-6 outline-none resize-none font-mono text-sm leading-relaxed"
              placeholder="Write your instructions using Markdown...

Examples:
# Heading 1
## Heading 2

**bold text** or *italic text*

- Bullet point
1. Numbered list

`inline code` or

```javascript
function example() {
  return 'code block';
}
```

[Link text](https://example.com)

> Quote

| Table | Header |
|-------|--------|
| Cell  | Cell   |"
              spellCheck={false}
            />

            <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
              {content.length} characters • {content.split("\n").length} lines
            </div>
          </div>

          {showPreview && (
            <div className="w-1/2 overflow-y-auto p-6 bg-gray-900">
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-3xl font-bold text-white mb-4 mt-6 first:mt-0"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-2xl font-bold text-white mb-3 mt-5 first:mt-0"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-xl font-bold text-white mb-2 mt-4 first:mt-0"
                        {...props}
                      />
                    ),
                    h4: ({ node, ...props }) => (
                      <h4
                        className="text-lg font-bold text-white mb-2 mt-3"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p
                        className="text-gray-300 mb-4 leading-relaxed"
                        {...props}
                      />
                    ),
                    code: ({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return inline ? (
                        <code
                          className="bg-indigo-900/30 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono border border-indigo-800/30"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code
                          className="block bg-gray-950 text-gray-300 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-gray-800"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="bg-gray-950 rounded-lg overflow-hidden mb-4 border border-gray-800"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside text-gray-300 mb-4 space-y-1 ml-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside text-gray-300 mb-4 space-y-1 ml-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="text-gray-300 leading-relaxed"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-indigo-500 pl-4 py-2 italic text-gray-400 mb-4 bg-indigo-950/20"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                        {...props}
                      />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto mb-4">
                        <table
                          className="min-w-full border-collapse border border-gray-700 rounded-lg overflow-hidden"
                          {...props}
                        />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gray-800/50" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-gray-700 bg-gray-800 px-4 py-2 text-left text-white font-semibold"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-gray-700 px-4 py-2 text-gray-300"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="max-w-full h-auto rounded-lg my-4 border border-gray-700"
                        {...props}
                      />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="border-gray-700 my-6" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="text-white font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="text-gray-200 italic" {...props} />
                    ),
                  }}
                >
                  {content || "*No content to preview*"}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionEditor;
