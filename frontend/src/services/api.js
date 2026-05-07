import axios from "axios";

const TOKEN_STORAGE_KEY = "studyvault_ai_token";
const AUTH_EXPIRED_STORAGE_KEY = "studyvault_ai_auth_expired";

export const tokenStorage = {
  get() {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set(token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export const authExpirationStorage = {
  get() {
    return localStorage.getItem(AUTH_EXPIRED_STORAGE_KEY);
  },
  set() {
    localStorage.setItem(AUTH_EXPIRED_STORAGE_KEY, "1");
  },
  clear() {
    localStorage.removeItem(AUTH_EXPIRED_STORAGE_KEY);
  },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const extractErrorMessage = (error) => {
  if (error?.code === "ERR_NETWORK") {
    return "Network error. Check your connection or backend server and try again.";
  }

  if (error?.response?.status === 429) {
    return error.response.data?.message || "Too many requests. Please wait and try again.";
  }

  if (error?.response?.status >= 500) {
    return error.response.data?.message || "Server error. Please try again in a moment.";
  }

  return (
    error?.response?.data?.message ||
    "Something went wrong while communicating with the server."
  );
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || "";
    const isAuthRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");

    if (error?.response?.status === 401 && !isAuthRequest) {
      tokenStorage.clear();
      authExpirationStorage.set();
      window.dispatchEvent(new CustomEvent("studyvault:auth-expired"));
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  async register(payload) {
    try {
      const response = await api.post("/auth/register", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async login(payload) {
    try {
      const response = await api.post("/auth/login", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export const notesApi = {
  async uploadNote(payload, onUploadProgress) {
    try {
      const response = await api.post("/notes/upload", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getNotes() {
    try {
      const response = await api.get("/notes");
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getNoteById(noteId) {
    try {
      const response = await api.get(`/notes/${noteId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async deleteNote(noteId) {
    try {
      const response = await api.delete(`/notes/${noteId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};

export const aiApi = {
  async getActivity(noteId) {
    try {
      const response = await api.get("/ai/activity", {
        params: noteId ? { noteId } : undefined,
      });

      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async summarize(payload) {
    try {
      const response = await api.post("/ai/summarize", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async generateQuiz(payload) {
    try {
      const response = await api.post("/ai/quiz", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async generateFlashcards(payload) {
    try {
      const response = await api.post("/ai/flashcards", payload);
      return response.data.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
