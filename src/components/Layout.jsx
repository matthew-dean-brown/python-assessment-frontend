import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong>Python Assessment Portal</strong>
        </div>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Student</Link>
          <Link to="/teacher">Teacher</Link>
        </nav>
      </header>

      <main style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
