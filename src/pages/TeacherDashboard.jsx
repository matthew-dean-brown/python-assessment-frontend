import { useEffect, useState } from "react";
import { getSubmissionsForTeacher } from "../api/mock.js";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    getSubmissionsForTeacher().then(setSubmissions);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-primary mb-6">Teacher Dashboard</h2>

      {submissions.length === 0 && <p>No submissions yet.</p>}

      {submissions.length > 0 && (
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Question</th>
              <th className="p-3 text-left">Score</th>
              <th className="p-3 text-left">Submitted</th>
            </tr>
          </thead>

          <tbody>
            {submissions.map((s, idx) => (
              <tr key={s.id} className={idx % 2 ? "bg-gray-50" : "bg-white"}>
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.studentId}</td>
                <td className="p-3">{s.questionId}</td>
                <td className="p-3 text-primary font-semibold">{s.score}</td>
                <td className="p-3">{new Date(s.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
