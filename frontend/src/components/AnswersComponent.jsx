import { useEffect } from "react";
import { useAnswerApi } from "../api/answers.api";
import DataTableComponent from "./DataTable";

const AnswersComponent = () => {
    const { getAnswers, answers } = useAnswerApi();

    useEffect(() => {
        const fetchData = async () => {
            await getAnswers();
        };
        fetchData();
    }, []);
    
    const contentHeaders = answers.length > 0
        ? ["answer", "correct", "question"]
        : [];

    
    const answers_data = answers.map((answer) => ({
        answer: answer.answer,
        correct: answer.correct ? 'True' : 'False',
        question: answer.question_id?.question ?? "N/A"
    }));

    return (<>
            <div className="table-responsive w-100">
            <DataTableComponent 
                content_data={answers_data}
                content_headers={contentHeaders}
                />
            </div>
        </>
    );
}

export default AnswersComponent;