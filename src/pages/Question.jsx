import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById, submitCode } from "../api/mock.js";

export default function Question() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);

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
    setStatus("SUBMITTING");
    try {
      const result = await submitCode({
        studentId: "demo-student",
        questionId,
        code,
      });
      setStatus(`SCORE_${result.score}`);
      alert(`Submitted! Fake score: ${result.score}`);
      // You could navigate back to assessment:
      // navigate(-1);
    } catch (err) {
      console.error(err);
      setStatus("ERROR");
      alert("Something went wrong submitting your code.");
    }
  }

  return (
    <div>
      <h1>{question.title}</h1>
      <p>{question.description}</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <label htmlFor="code">
          Your Python code:
        </label>
        <br />
        <textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={15}
          style={{ width: "100%", fontFamily: "monospace", fontSize: "0.9rem" }}
        />
        <div style={{ marginTop: "1rem" }}>
          <button type="submit" disabled={status === "SUBMITTING"}>
            {status === "SUBMITTING" ? "Submitting..." : "Submit answer"}
          </button>
        </div>
      </form>
    </div>
  );
}
