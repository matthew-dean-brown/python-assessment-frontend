import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assessment from "./pages/Assessment.jsx";
import Question from "./pages/Question.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assessments/:assessmentId" element={<Assessment />} />
        <Route
          path="/assessments/:assessmentId/questions/:questionId"
          element={<Question />}
        />
        <Route path="/teacher" element={<TeacherDashboard />} />
      </Routes>
    </Layout>
  );
}
