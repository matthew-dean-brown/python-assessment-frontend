import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAssessmentById, getQuestionsByAssessment } from "../api/mock.js";

export default function Assessment() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getAssessmentById(assessmentId).then(setAssessment);
    getQuestionsByAssessment(assessmentId).then(setQuestions);
  }, [assessmentId]);

  if (!assessment) return <p>Loading assessment...</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold text-primary mb-4">{assessment.name}</h2>
      <p className="mb-8 text-gray-700">{assessment.description}</p>

      <h3 className="text-2xl font-semibold mb-4">Questions</h3>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className="p-4 bg-white border rounded-lg shadow hover:shadow-md transition"
          >
            <h4 className="text-lg font-bold mb-1">{q.title}</h4>
            <p className="text-gray-600 mb-2">Max marks: {q.maxMarks}</p>
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
