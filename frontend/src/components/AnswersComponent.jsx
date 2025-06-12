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
        answer: answer.a_answer,
        correct: answer.a_correct ? 'True' : 'False',
        question: answer.q_id ? answer.q_id.q_question : "N/A"
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
