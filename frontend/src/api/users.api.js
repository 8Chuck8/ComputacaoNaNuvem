import {create} from 'zustand'

const API_URL = import.meta.env.VITE_API_URL;

export const useUserApi = create((set) => ({
    users: [],
    setUsers: (users) => set({users}),
    getUsers: async () => {
        const res = await fetch("${API_URL}/api/users");
        const data = await res.json();
        set({users: data.data});
    },
    createUser: async (newUser) => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            return {success: false, message: "Please provide all fields"};
        }

        const res = await fetch("${API_URL}/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newUser),
        });

        const data = await res.json();
        set((state) => ({users: [...state.users, data.data]}));
        return {success: true, data: data.data, message: "User created successfully"};
    },
}));
