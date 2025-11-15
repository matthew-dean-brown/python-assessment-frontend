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
      <h1>Student Dashboard</h1>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Available Assessments</h2>
        {assessments.length === 0 && <p>No assessments yet.</p>}
        <ul>
          {assessments.map((a) => (
            <li key={a.id}>
              <Link to={`/assessments/${a.id}`}>{a.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>My Recent Submissions</h2>
        {submissions.length === 0 && <p>No submissions yet.</p>}
        <ul>
          {submissions.map((s) => (
            <li key={s.id}>
              Q{s.questionId} – score: {s.score} – {new Date(s.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
