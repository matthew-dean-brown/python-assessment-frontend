import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-screen bg-white text-gray-800">
      <header className="bg-primary text-white shadow w-full">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Python Assessment Portal</h1>
          <nav className="space-x-6 text-lg">
            <Link className="hover:underline" to="/">Student</Link>
            <Link className="hover:underline" to="/teacher">Teacher</Link>
          </nav>
        </div>
      </header>

      <main className="w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
