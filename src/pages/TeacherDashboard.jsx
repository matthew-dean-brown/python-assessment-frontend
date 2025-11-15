import { useEffect, useState } from "react";
import { getSubmissionsForTeacher } from "../api/mock.js";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getSubmissionsForTeacher().then(setSubmissions);
  }, []);

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      <p>Simple view of all submissions (from mock API).</p>

      {submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Student</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Question</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Score</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>When</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id}>
                <td style={{ borderBottom: "1px solid #eee" }}>{s.id}</td>
                <td style={{ borderBottom: "1px solid #eee" }}>{s.studentId}</td>
                <td style={{ borderBottom: "1px solid #eee" }}>{s.questionId}</td>
                <td style={{ borderBottom: "1px solid #eee" }}>{s.score}</td>
                <td style={{ borderBottom: "1px solid #eee" }}>
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
