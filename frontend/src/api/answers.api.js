import {create} from 'zustand'

const API_URL = import.meta.env.VITE_API_URL;

export const useAnswerApi = create((set) => ({
    answers: [],
    setAnswers: (answers) => set({answers}),
    getAnswers: async () => {
        const res = await fetch(`${API_URL}/api/answers`);
        const data = await res.json();
        console.log("Fetched answers:", data);
        set({answers: data.data});
    },
    createAnswer: async (newAnswer) => {
        if (!newAnswer.answer || !newAnswer.question_id) {
            return {success: false, message: "Please provide all fields"};
        }

        const res = await fetch(`${API_URL}/api/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newAnswer),
        });

        const data = await res.json();
        set((state) => ({answers: [...state.answers, data.data]}));
        return {success: true, data: newAnswer, message: "Answer created successfully"};
    }
}));
