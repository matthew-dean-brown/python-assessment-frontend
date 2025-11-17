import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchQuestionById,
  submitAnswer,
  fetchMySubmissionForQuestion,
} from "../api/backend.js";
import CodeEditor from "../components/CodeEditor.jsx";

export default function Question() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [output, setOutput] = useState("// Output will appear here when you click Run.");

  // new state to track if this question is already submitted
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        // 1) Load question
        const q = await fetchQuestionById(questionId);
        setQuestion(q);
        if (q?.starter_code) {
          setCode(q.starter_code);
        }

        // 2) Check if student already submitted for this question
        const mySubs = await fetchMySubmissionForQuestion(questionId);
        if (mySubs.length > 0) {
          setAlreadySubmitted(true);
          setExistingSubmission(mySubs[0]);
          // show their submitted code instead of starter code
          setCode(mySubs[0].code);
          setOutput("// You have already submitted this answer.");
        } else {
          setAlreadySubmitted(false);
          setExistingSubmission(null);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [questionId]);

  if (!question) return <p>Loading question...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    if (alreadySubmitted) return; // extra safety

    setLoading(true);
    try {
      const result = await submitAnswer(questionId, code);
      alert("Submission saved!");

      // lock the question now
      setAlreadySubmitted(true);
      setExistingSubmission(result);
      setOutput("// You have submitted this answer. You can no longer edit it.");
    } catch (err) {
      alert("Failed to submit: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun() {
    // this is your Pyodide run or simulated run – leaving simple placeholder
    setOutput("Running in browser is disabled for this example.");
  }

  function handleReset() {
    if (question?.starter_code && !alreadySubmitted) {
      setCode(question.starter_code);
      setOutput("// Code reset to starter template.");
    }
  }

  function toggleTheme() {
    setEditorTheme((prev) => (prev === "vs-dark" ? "vs-light" : "vs-dark"));
  }

  const submittedBanner = alreadySubmitted ? (
    <div className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
      You have already submitted an answer for this question. Contact your teacher
      if you need to make changes.
    </div>
  ) : null;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-primary mb-4">
        {question.title}
      </h2>
      <p className="mb-4">{question.description}</p>

      {submittedBanner}

      {/* If already submitted, show read-only code; else show full form */}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold">
            {alreadySubmitted ? "Your submitted code" : "Your Python code"}
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1 text-sm rounded border border-primary text-primary hover:bg-primary hover:text-white"
            >
              {editorTheme === "vs-dark" ? "Light mode" : "Dark mode"}
            </button>

            {/* Only allow reset if not submitted yet */}
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              disabled={!question?.starter_code || alreadySubmitted}
            >
              Reset code
            </button>
          </div>
        </div>

        {/* Editor is always visible, but we won't allow submit if already submitted */}
        <CodeEditor value={code} onChange={setCode} theme={editorTheme} />

        <div className="mt-4 flex flex-wrap gap-3">
          {/* You can still allow Run even after submission if you like; 
              or disable it when alreadySubmitted */}
          <button
            type="button"
            onClick={handleRun}
            className="px-5 py-2 rounded bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200"
          >
            Run (in browser)
          </button>

          {/* Disable submit if already submitted */}
          <button
            type="submit"
            disabled={loading || alreadySubmitted}
            className="px-6 py-2 rounded bg-primary text-white hover:bg-[#1f7fa1] disabled:opacity-70"
          >
            {alreadySubmitted
              ? "Already submitted"
              : loading
              ? "Submitting..."
              : "Submit Answer"}
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
