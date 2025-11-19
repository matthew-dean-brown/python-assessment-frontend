import { useEffect, useState, useMemo } from "react";
import { fetchAllSubmissions, updateSubmissionScore } from "../api/backend.js";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [mark, setMark] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetchAllSubmissions()
      .then((data) => {
        setSubmissions(data);
        const firstWithStudent = data.find((s) => s.student);
        if (firstWithStudent) {
          setSelectedStudentId(firstWithStudent.student.id);
        }
      })
      .catch((err) => setError(err.message || "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  // Build student list with total scores
  const students = useMemo(() => {
    const map = new Map(); // key: studentId, value: { id, username, totalScore }

    for (const s of submissions) {
      if (!s.student) continue;
      const id = s.student.id;
      if (!map.has(id)) {
        map.set(id, {
          id,
          username: s.student.username,
          totalScore: 0,
        });
      }
      const entry = map.get(id);
      if (typeof s.score === "number") {
        entry.totalScore += s.score;
      }
    }

    return Array.from(map.values());
  }, [submissions]);

  // Get the currently selected student object
  const selectedStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((s) => s.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  // Filter submissions to the selected student
  const filteredSubmissions = useMemo(() => {
    if (!selectedStudentId) return [];
    return submissions.filter(
      (s) => s.student && s.student.id === selectedStudentId
    );
  }, [submissions, selectedStudentId]);

  function handleSelectStudent(studentId) {
    setSelectedStudentId(studentId);
    setSelectedSubmission(null);
    setMark("");
    setSaveError("");
    setSaveSuccess("");
  }

  function handleSelectSubmission(submission) {
    setSelectedSubmission(submission);
    setMark(
      submission.score !== null && submission.score !== undefined
        ? String(submission.score)
        : ""
    );
    setSaveError("");
    setSaveSuccess("");
  }
  function handleClose() {
    setSelectedSubmission(null);
    setMark("");
    setSaveError("");
    setSaveSuccess("");
  }


  async function handleSaveMark() {
    if (!selectedSubmission) return;

    const score = mark === "" ? null : Number(mark);
    if (score !== null && Number.isNaN(score)) {
      setSaveError("Please enter a valid number for the mark.");
      return;
    }

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    try {
      const updated = await updateSubmissionScore(selectedSubmission.id, score);

      // Update submissions list
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
      setSelectedSubmission(updated);
      setSaveSuccess("Mark saved.");
    } catch (err) {
      setSaveError(err.message || "Failed to save mark.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT: list of students with totals */}
      <div className="lg:w-1/4">
        <h2 className="text-3xl font-semibold text-primary mb-4">
          Teacher Dashboard
        </h2>
        <h3 className="text-xl font-semibold mb-2">Students</h3>

        {students.length === 0 && <p>No students with submissions yet.</p>}

        <ul className="space-y-1">
          {students.map((stu) => (
            <li key={stu.id}>
              <button
                type="button"
                onClick={() => handleSelectStudent(stu.id)}
                className={`w-full text-left px-3 py-2 border rounded 
                  bg-white text-gray-800 hover:bg-gray-50
                  ${selectedStudentId === stu.id
                    ? "underline underline-offset-4 decoration-1 decoration-primary font-semibold"
                    : ""
                  }
                `}
              >
                {/* Show total score next to name */}
                {stu.username}{" "}
                <span className="text-sm opacity-80">
                  (Total: {stu.totalScore})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT: submissions & marking for selected student */}
      <div className="lg:w-3/4 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-3">
            {selectedStudent
              ? `Submissions for ${selectedStudent.username} (Total: ${selectedStudent.totalScore})`
              : "Select a student"}
          </h3>

          {selectedStudentId && filteredSubmissions.length === 0 && (
            <p>This student has no submissions yet.</p>
          )}

          {selectedStudentId && filteredSubmissions.length > 0 && (
            <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-primary text-black">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Question</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Submitted</th>
                  <th className="p-3 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3">{s.id}</td>
                    <td className="p-3">{s.question}</td>
                    <td className="p-3 text-primary font-semibold">
                      {s.score ?? "—"}
                    </td>
                    <td className="p-3">
                      {new Date(s.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleSelectSubmission(s)}
                        className="text-sm px-3 py-1 rounded border text-white bg-black"
                      >
                        View / Mark
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Marking panel */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Submission Details</h3>

          {!selectedSubmission && (
            <p>Select a submission to view the code and assign a mark.</p>
          )}

          {selectedSubmission && (
            <div className="bg-white border rounded-lg shadow p-4 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold">Student: </span>
                  <span>
                    {selectedSubmission.student?.username ?? "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Question ID: </span>
                  <span>{selectedSubmission.question}</span>
                </div>
                <div>
                  <span className="font-semibold">Submitted: </span>
                  <span>
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Student Code</h4>
                <pre className="bg-gray-900 text-gray-100 text-sm rounded-md p-3 overflow-auto max-h-80">
                  {selectedSubmission.code}
                </pre>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Mark / Score
                </label>
                <input
                  type="number"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                  className="border rounded px-3 py-2 w-32"
                  placeholder="e.g. 8"
                />
              </div>

              {saveError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
                  {saveSuccess}
                </div>
              )}

              <div className="flex gap-3">
                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSaveMark}
                  disabled={saving}
                  className="px-5 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save mark"}
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2 rounded border border-gray-400 text-white bg-black "
                >
                  Close
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
