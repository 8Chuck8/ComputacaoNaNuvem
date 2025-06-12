import { create } from 'zustand';

// Pega a URL da API do ficheiro .env
const API_URL = import.meta.env.VITE_API_URL;

export const useAuthApi = create((set) => ({
  user: null,

  setUsers: (user) => set({ user }),

  login: async (email, password) => {
    const res = await fetch(${API_URL}/api/users/login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      set({ user: data.data });
    }

    return {
      success: res.ok,
      data: data.data,
      message: data.message
    };
  },

  register: async (newUser) => {
    if (!newUser.username  !newUser.email  !newUser.password) {
      return { success: false, message: "Please provide all fields" };
    }

    const res = await fetch(${API_URL}/api/users, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();

    if (res.ok) {
      set({ user: data.data });
    }

    return {
      success: res.ok,
      data: data.data,
      message: res.ok ? "User created successfully" : data.message || "Registration failed"
    };
  }
}));
