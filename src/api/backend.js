const API_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load current user");
  return res.json();
}

export function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

export function isStaff() {
  return localStorage.getItem("isStaff") === "true";
}

export async function register(username, password) {
  const res = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Registration failed");
  }
  return res.json();
}
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  // store tokens
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);

  // fetch user info (including is_staff)
  const me = await fetchCurrentUser();
  localStorage.setItem("username", me.username);
  localStorage.setItem("isStaff", me.is_staff ? "true" : "false");

  return { ...data, user: me };
}


export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("isStaff");
}

export async function fetchQuestions() {
  const res = await fetch(`${API_URL}/questions/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}

export async function fetchQuestionById(id) {
  const res = await fetch(`${API_URL}/questions/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load question");
  return res.json();
}

export async function submitAnswer(questionId, code) {
  const res = await fetch(`${API_URL}/submissions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question: questionId, code }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function fetchMySubmissions() {
  const res = await fetch(`${API_URL}/my-submissions/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load submissions");
  return res.json();
}
export async function fetchAllSubmissions() {
  const res = await fetch(`${API_URL}/submissions/all/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load submissions");
  return res.json();
}
export async function fetchSubmissionById(id) {
  const res = await fetch(`${API_URL}/submissions/${id}/`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load submission");
  return res.json();
}

export async function updateSubmissionScore(id, score) {
  const res = await fetch(`${API_URL}/submissions/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) throw new Error("Failed to update mark");
  return res.json();
}

export async function fetchMySubmissionForQuestion(questionId) {
  const res = await fetch(`${API_URL}/my-submissions/?question=${questionId}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error("Failed to load submission status");
  return res.json(); // array: [] or [submission]
}
