import {create} from 'zustand'

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthApi = create((set) => ({
    user: null,
    setUsers: (user) => set({user}),
    login: async (email, password) => {
        console.log("EMAIL", email);
        console.log("PASSWORD", password);

        const res = await fetch("/api/users/login", {
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
        return data;
    },

    register: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            return {success: false, message: "Please provide all fields"};
        }

        const res = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUser),
        });

        const data = await res.json();
        console.log(data)
        if (!data.success) {
            return {success: false, data: newUser, message: "This email is already registered"};
        }

        set({ user: data.data });
        return {success: true, data: newUser, message: "User created successfully"};
    }
}));
