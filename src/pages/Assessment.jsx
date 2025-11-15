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
      <h1>{assessment.name}</h1>
      <p>{assessment.description}</p>

      <h2 style={{ marginTop: "2rem" }}>Questions</h2>
      <ol>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: "1rem" }}>
            <div>
              <strong>{q.title}</strong> (max {q.maxMarks} marks)
            </div>
            <Link to={`/assessments/${assessmentId}/questions/${q.id}`}>
              Answer this question
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
