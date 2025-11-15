// src/components/CodeEditor.jsx
import Editor from "@monaco-editor/react";

export default function CodeEditor({
  value,
  onChange,
  theme = "vs-dark",
  height = "400px",
}) {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <Editor
        height={height}
        defaultLanguage="python"
        theme={theme}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
