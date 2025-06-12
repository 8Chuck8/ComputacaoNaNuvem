import { create } from 'zustand'

export const useScoreApi = create((set) => ({
    scores: [],
    setScores: (scores) => set({ scores }),
    getScores: async () => {
        const res = await fetch("/api/scores");
        const data = await res.json();
        set({ scores: data.data });
    },
    getScoresByUserId: async (id) => {
        const res = await fetch(`/api/scores/user/${id}`);
        const data = await res.json();
        if (data.success) {
            set({ scores: data.data });
        }
    },
    createscores: async (newScore) => {
        if (!newScore.name || !newScore.score || !newScore.time || !newScore.user_id) {
            return { success: false, message: "Please provide all fields" };
        }

        const res = await fetch("/api/scores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newScore),
        });

        const data = await res.json();
        set((state) => ({ scores: [...state.scores, data.data] }));
        return { success: true, data: newScore, message: "Score created successfully" };
    },
}));