import {create} from 'zustand'

export const useUserApi = create((set) => ({
    users: [],
    setUsers: (users) => set({users}),
    getUsers: async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        set({users: data.data});
    },
    createUser: async (newUser) => {
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
        set((state) => ({users: [...state.users, data.data]}));
        return {success: true, data: newUser, message: "User created successfully"};
    },
}));