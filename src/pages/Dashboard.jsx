import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchQuestions, fetchMySubmissions } from "../api/backend.js";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchQuestions().then(setQuestions).catch(console.error);
    fetchMySubmissions().then(setSubmissions).catch(console.error);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-primary">
        Student Dashboard
      </h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Available Questions</h3>

        {questions.length === 0 && <p>No questions yet.</p>}

        <div className="space-y-4">
          {questions.map((q) => (
            <Link
              key={q.id}
              to={`/assessments/1/questions/${q.id}`} // you can adjust "1" later if you add real assessments
              className="block p-4 border rounded-lg shadow hover:shadow-md transition bg-white hover:bg-gray-50"
            >
              <h4 className="text-lg font-bold">{q.title}</h4>
              <p className="text-sm text-gray-600">{q.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">My Recent Submissions</h3>
        {submissions.length === 0 && <p>No submissions yet.</p>}

        <ul className="space-y-2">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="p-3 bg-gray-50 border rounded-md flex flex-wrap justify-between gap-2"
            >
              <span>Question {s.question}</span>
              <span className="font-semibold text-primary">
                {s.score ?? "Not marked yet"}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(s.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
