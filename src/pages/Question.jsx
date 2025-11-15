import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuestionById, submitCode } from "../api/mock.js";
import CodeEditor from "../components/CodeEditor.jsx";


export default function Question() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ DEFAULT DARK MODE
  const [editorTheme, setEditorTheme] = useState("vs-dark");

  const [output, setOutput] = useState("// Output will appear here when you click Run.");

  useEffect(() => {
    getQuestionById(questionId).then((q) => {
      setQuestion(q);
      if (q?.starterCode) {
        setCode(q.starterCode);
      }
    });
  }, [questionId]);

  if (!question) return <p>Loading question...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const result = await submitCode({
      studentId: "demo-student",
      questionId,
      code,
    });

    alert(`Submitted! Score: ${result.score}`);
    setLoading(false);
  }

  function handleRun() {
    console.log("Running student code (simulated):\n", code);

    setOutput(
      [
        ">>> Simulated run",
        "Code has been logged to the browser console.",
        "Open DevTools (F12) → Console to see it.",
      ].join("\n")
    );
  }

  function handleReset() {
    if (question?.starterCode) {
      setCode(question.starterCode);
      setOutput("// Code reset to starter template.");
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold text-primary mb-4">
        {question.title}
      </h2>
      <p className="mb-8">{question.description}</p>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold">Your Python code</label>

          <div className="flex gap-2">
           

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1 text-sm rounded border border-gray-300 text-white hover:bg-gray-100"
              disabled={!question?.starterCode}
            >
              Reset code
            </button>
          </div>
        </div>

        {/* MONACO EDITOR */}
        <CodeEditor value={code} onChange={setCode} theme={editorTheme} />

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRun}
            className="px-5 py-2 rounded bg-gray-100 border border-gray-300 text-white hover:bg-gray-200"
          >
            Run
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded bg-primary text-white hover:bg-[#1f7fa1] disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </div>
      </form>

      {/* OUTPUT PANEL */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Output</h3>
        <pre className="bg-gray-900 text-gray-100 text-sm rounded-md p-3 overflow-auto">
{output}
        </pre>
      </div>
    </div>
  );
}
