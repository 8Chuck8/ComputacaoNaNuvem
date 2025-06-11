import { useEffect, useState } from "react";
import { useQuestionApi } from "../api/questions.api";
import { useAnswerApi } from "../api/answers.api";
import DataTableComponent from "./DataTable";

const QuestionsComponent = () => {
    const { getQuestions, questions } = useQuestionApi();

    const [questionsData, setQuestionsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await getQuestions();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAnswersForQuestions = async () => {
            const enrichedQuestions = await Promise.all(
                questions.map(async (q) => {
                    const res = await fetch(`/api/answers/question/${q._id}`);
                    const data = await res.json();
                    console.log(data.data);
                    return {
                        question: q.question,
                        score: q.score,
                        status: q.status ? 'Active' : 'Inactive',
                        answers: data.data.map((answer, idx) => {
                            return `${idx+1}: ${answer.answer} - (${answer.correct ? "Correct" : "Incorrect"})`;
                        })
                    };
                })
            );
            setQuestionsData(enrichedQuestions);
        };

        if (questions.length > 0) {
            fetchAnswersForQuestions();
        }
    }, [questions]);

    const contentHeaders = ["question", "score", "answers", "status"];

    return (
        <>
            <div className="table-responsive w-100">
                <DataTableComponent
                    content_data={questionsData}
                    content_headers={contentHeaders}
                />
            </div>
        </>
    );
};

export default QuestionsComponent;
