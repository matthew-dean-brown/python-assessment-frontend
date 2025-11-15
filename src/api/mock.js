// Fake data – you can tweak this to match your real test later

const assessments = [
  {
    id: "1",
    name: "Python Basics Test",
    description: "Covers variables, functions and simple logic.",
    startTime: "2025-11-20T08:00:00Z",
    endTime: "2025-11-20T09:00:00Z",
  },
];

const questions = [
  {
    id: "1",
    assessmentId: "1",
    title: "Add Two Numbers",
    description:
      "Write a function `add(a, b)` that returns the sum of two numbers.",
    starterCode: `def add(a, b):
    # TODO: write your code here
    pass`,
    maxMarks: 10,
  },
  {
    id: "2",
    assessmentId: "1",
    title: "Is Even",
    description: "Write a function `is_even(n)` that returns True if n is even.",
    starterCode: `def is_even(n):
    # TODO: write your code here
    pass`,
    maxMarks: 10,
  },
];

// In-memory submissions for now
let submissions = [];

export function getAssessments() {
  return Promise.resolve(assessments);
}

export function getAssessmentById(id) {
  const assessment = assessments.find((a) => a.id === id);
  return Promise.resolve(assessment || null);
}

export function getQuestionsByAssessment(assessmentId) {
  const qs = questions.filter((q) => q.assessmentId === assessmentId);
  return Promise.resolve(qs);
}

export function getQuestionById(questionId) {
  const q = questions.find((q) => q.id === questionId);
  return Promise.resolve(q || null);
}

// Simulate a submit – later this will call your real backend
export function submitCode({ studentId = "demo-student", questionId, code }) {
  const newSubmission = {
    id: String(submissions.length + 1),
    studentId,
    questionId,
    code,
    createdAt: new Date().toISOString(),
    // Fake auto-marking: random score for now
    score: Math.floor(Math.random() * 11),
    status: "PASSES_FAKE", // just for vibe
  };

  submissions.push(newSubmission);
  return Promise.resolve(newSubmission);
}

export function getSubmissionsForTeacher() {
  // In a real app: filter by assessment, question, etc.
  return Promise.resolve(submissions);
}

export function getSubmissionsForStudent(studentId = "demo-student") {
  const res = submissions.filter((s) => s.studentId === studentId);
  return Promise.resolve(res);
}
