const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const MOCK_ENABLED = false; // Set to true to bypass backend issues

// Log the actual URL being used to the console for debugging
if (typeof window !== "undefined") {
  console.log("Using API_BASE_URL:", API_BASE_URL, MOCK_ENABLED ? "(Mocking Enabled)" : "");
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const method = options.method || "GET";
  
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        if (typeof window !== "undefined") window.location.href = "/login";
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    console.error(`[API Fetch Error] ${method} ${url}:`, err);
    throw err;
  }
}

export const api = {
  get: (url: string) => fetchWithAuth(url, { method: "GET" }),
  post: (url: string, body: any) => fetchWithAuth(url, { method: "POST", body: JSON.stringify(body) }),
  put: (url: string, body: any) => fetchWithAuth(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: (url: string, body: any) => fetchWithAuth(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (url: string) => fetchWithAuth(url, { method: "DELETE" }),
};
