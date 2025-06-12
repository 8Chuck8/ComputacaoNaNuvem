import {create} from 'zustand'

const API_URL = import.meta.env.VITE_API_URL;

export const useQuestionApi = create((set) => ({
    questions: [],
    setQuestions: (questions) => set({questions}),
    getQuestions: async () => {
        const res = await fetch(`${API_URL}/api/questions`);
        const data = await res.json();
        set({questions: data.data});
    },
    createQuestions: async (newQuestion) => {
        if (!newQuestion.question || !newQuestion.score) {
            return {success: false, message: "Please provide all fields"};
        }

        const res = await fetch(`${API_URL}/api/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(newQuestion),
        });

        const data = await res.json();
        set((state) => ({questions: [...state.questions, data.data]}));
        return {success: true, data: newQuestion, message: "Question created successfully"};
    },
}));
