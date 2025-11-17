import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchQuestions } from "../api/backend.js";

export default function Assessment() {
  const { assessmentId } = useParams(); // we keep this for the URL, even though we don't use it yet
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchQuestions()
      .then((qs) => setQuestions(qs))
      .catch((err) => setError(err.message || "Failed to load questions"))
      .finally(() => setLoading(false));
  }, [assessmentId]);

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {/* You can customise this heading / description later */}
      <h2 className="text-3xl font-semibold text-primary mb-4">
        Assessment {assessmentId}
      </h2>
      <p className="mb-8 text-gray-700">
        Choose a question below to start answering. All questions are loaded
        from the backend (Django + Supabase).
      </p>

      <h3 className="text-2xl font-semibold mb-4">Questions</h3>

      <div className="space-y-4">
        {questions.length === 0 && <p>No questions available.</p>}

        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
          >
            <h4 className="text-lg font-bold mb-1">{q.title}</h4>
            <p className="text-gray-600 mb-2">
              Max marks: {q.max_marks ?? 0}
            </p>
            <p className="text-gray-700 mb-3 line-clamp-2">
              {q.description}
            </p>

            <Link
              to={`/assessments/${assessmentId}/questions/${q.id}`}
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-[#1f7fa1]"
            >
              Answer this question
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
