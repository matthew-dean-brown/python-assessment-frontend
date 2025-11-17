import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Assessment from "./pages/Assessment.jsx";
import Question from "./pages/Question.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import Login from "./pages/Login.jsx";
import { isLoggedIn, isStaff } from "./api/backend.js";

function PrivateRoute({ children, requireStaff = false }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (requireStaff && !isStaff()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/assessments/:assessmentId"
          element={
            <PrivateRoute>
              <Assessment />
            </PrivateRoute>
          }
        />

        <Route
          path="/assessments/:assessmentId/questions/:questionId"
          element={
            <PrivateRoute>
              <Question />
            </PrivateRoute>
          }
        />

        {/* 👇 Only staff users can access TeacherDashboard */}
        <Route
          path="/teacher"
          element={
            <PrivateRoute requireStaff={true}>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
