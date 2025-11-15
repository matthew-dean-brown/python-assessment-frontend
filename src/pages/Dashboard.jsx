import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssessments, getSubmissionsForStudent } from "../api/mock.js";

export default function Dashboard() {
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getAssessments().then(setAssessments);
    getSubmissionsForStudent("demo-student").then(setSubmissions);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-primary">Student Dashboard</h2>

      {/* ASSESSMENTS */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Available Assessments</h3>

        {assessments.length === 0 && <p>No assessments yet.</p>}

        <div className="space-y-4">
          {assessments.map((a) => (
            <Link
              key={a.id}
              to={`/assessments/${a.id}`}
              className="block p-4 border rounded-lg shadow hover:shadow-md transition bg-white hover:bg-gray-50"
            >
              <h4 className="text-lg font-bold">{a.name}</h4>
              <p className="text-sm text-gray-600">{a.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SUBMISSIONS */}
      <section>
        <h3 className="text-xl font-semibold mb-3">My Recent Submissions</h3>

        {submissions.length === 0 && <p>No submissions yet.</p>}

        <ul className="space-y-2">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="p-3 bg-gray-50 border rounded-md flex justify-between"
            >
              <span>Q{s.questionId}</span>
              <span className="font-semibold text-primary">{s.score} marks</span>
              <span className="text-sm text-gray-500">
                {new Date(s.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
