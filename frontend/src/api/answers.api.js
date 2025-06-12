import {create} from 'zustand'

export const useAnswerApi = create((set) => ({
    answers: [],
    setAnswers: (answers) => set({answers}),
    getAnswers: async () => {
        const res = await fetch("/api/answers");
        const data = await res.json();
        console.log("Fetched answers:", data);
        set({answers: data.data});
    },
    createAnswer: async (newAnswer) => {
        if (!newAnswer.answer || !newAnswer.question_id) {
            return {success: false, message: "Please provide all fields"};
        }

        const res = await fetch("/api/answers", {
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