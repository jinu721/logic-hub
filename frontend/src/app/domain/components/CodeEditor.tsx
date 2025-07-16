import { useState, useEffect } from "react";
import { EditorView, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { markdown } from "@codemirror/lang-markdown";
import { customOneDarkTheme } from "@/utils/custom.theme";



export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "c"
  | "cpp"
  | "csharp"
  | "rust"
  | "sql"
  | "bash";

type CodeEditorProps = {
  setUserInput: (code: string) => void;
  codeBoilerplates: { [key in Language]?: string };
  currentLanguage: Language;
};

const getLanguageExtension = (language: Language) => {
  switch (language) {
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "python":
      return python();
    case "java":
      return java();
    case "c":
    case "cpp":
    case "csharp":
      return cpp();
    case "rust":
      return rust();
    case "sql":
      return sql();
    case "bash":
      return markdown();
    default:
      return javascript();
  }
};

const CodeEditor = ({
  setUserInput,
  codeBoilerplates,
  currentLanguage,
}: CodeEditorProps) => {
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (editorView) {
      editorView.destroy();
    }

    const editorContainer = document.getElementById("code-editor-container");
    if (!editorContainer) return;

    editorContainer.innerHTML = "";


    const startState = EditorState.create({
      doc: codeBoilerplates[currentLanguage] || "",
      extensions: [
        basicSetup,
        getLanguageExtension(currentLanguage),
        keymap.of([indentWithTab]),
        customOneDarkTheme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const updatedCode = update.state.doc.toString();
            setUserInput(updatedCode);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorContainer,
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, [currentLanguage,codeBoilerplates]);

  return (
    <div className="flex flex-col">
      <div
        id="code-editor-container"
        className="h-84 rounded-lg overflow-auto"
      />
    </div>
  );
};

export default CodeEditor;
