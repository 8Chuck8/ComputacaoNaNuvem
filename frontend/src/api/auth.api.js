import {create} from 'zustand'

export const useAuthApi = create((set) => ({
    user: [],
    setUsers: (user) => set({user}),
    login: async (email, password) => {
        console.log("EMAIL", email);
        console.log("PASSWORD", password);

        const res = await fetch("https://computacaonanuvem.onrender.com/api/users/login", {
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

        const res = await fetch("https://computacaonanuvem.onrender.com/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUser),
        });

        const data = await res.json();
        set((state) => ({user: [...state.user, data.data]}));
        return {success: true, data: newUser, message: "User created successfully"};
    }
}));
