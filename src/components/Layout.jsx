import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, isStaff, logout } from "../api/backend.js";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const staff = isStaff();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen w-screen bg-white text-gray-800">
      <header className="bg-primary text-white shadow w-full">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Python Assessment Portal</h1>
          <nav className="space-x-6 text-lg flex items-center">
            {loggedIn && (
              <>
                <Link className="hover:underline" to="/">
                  Student
                </Link>

                {/* 👇 Only show Teacher link if user is staff */}
                {staff && (
                  <Link className="hover:underline" to="/teacher">
                    Teacher
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="ml-4 text-sm border border-white/70 rounded px-3 py-1 hover:bg-white hover:text-primary"
                >
                  Logout
                </button>
              </>
            )}

            {!loggedIn && (
              <Link className="hover:underline" to="/login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="w-full px-6 py-8">{children}</main>
    </div>
  );
}
