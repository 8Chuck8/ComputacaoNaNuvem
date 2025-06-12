import { useEffect, useState } from "react";
import { useQuestionApi } from "../api/questions.api";
import DataTableComponent from "./DataTable";
import QuestionFormModal from "./QuestionFormModal";
import toast from "react-hot-toast";

const QuestionsComponent = () => {
  const { getQuestions, questions } = useQuestionApi();

  const [questionsData, setQuestionsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  useEffect(() => {
    getQuestions();
  }, []);

  useEffect(() => {
    const fetchAnswersForQuestions = async () => {
      const enrichedQuestions = await Promise.all(
        questions.map(async (q) => {
          const res = await fetch(`${API}/api/answers/question/${q._id}`);
          const data = await res.json();
          return {
            _id: q._id,
            q_question: q.q_question,
            q_score: q.q_score,
            q_status: q.q_status === 1 ? "Active" : "Inactive",
            answers: data.data.map((a, idx) => `${idx + 1}: ${a.a_answer} (${a.a_correct ? "✔" : "✖"})`)
          };
        })
      );
      setQuestionsData(enrichedQuestions);
    };

    if (questions.length > 0) fetchAnswersForQuestions();
  }, [questions]);

  const handleAdd = () => {
    setSelectedQuestion(null);
    setModalMode("add");
    setShowModal(true);
  };

    const handleEdit = async (id) => {
        const question = questions.find((q) => q._id === id);
        if (!question) return;

        try {
            const res = await fetch(`${API}/api/answers/question/${id}`);
            const data = await res.json();

            const answers = data.data.map((a) => ({
            _id: a._id,
            text: a.a_answer,
            correct: a.a_correct === 1 || a.a_correct === true
            }));

            // This ensures we're not passing display strings
            setSelectedQuestion({ ...question, answers });
            setModalMode("edit");
            setShowModal(true);
        } catch (err) {
            console.error("Failed to fetch answers for question:", err);
            toast.error("Could not load answers.");
        }
    };



  const handleDelete = async (id) => {
    const res = await fetch(`${API}/api/questions/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      toast.success("Question deleted");
      getQuestions();
    } else {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async (form) => {
    // STEP 1: Create or update the QUESTION
    const payload = {
        q_question: form.q_question,
        q_score: form.q_score,
        q_status: form.q_status,
        answers: form.answers.map((a) => ({
            a_answer: a.a_answer.trim(),
            a_correct: a.a_correct
        }))
    };

    console.log("PAYLOAD",payload);

    const method = modalMode === "edit" ? "PUT" : "POST";
    const url = `${API}/api/questions${modalMode === "edit" ? `/${form._id}` : ""}`;

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.success) {
        toast.error(data.message || "Question failed");
        return { success: false };
    }

    const questionId = modalMode === "edit" ? form._id : data.data?._id;

    toast.success(modalMode === "edit" ? "Updated" : "Created");

    getQuestions();
    return { success: true };
    };



  const headers = ["q_question", "q_score", "answers", "q_status"];

  return (
    <div className="table-responsive w-100">
      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleAdd}>+ Add Question</button>
      </div>

      <DataTableComponent
        content_data={questionsData}
        content_headers={headers}
        handleEditContent={handleEdit}
        type={'question'}
      />

      <QuestionFormModal
        show={showModal}
        onClose={() => { setShowModal(false); setSelectedQuestion(null); }}
        mode={modalMode}
        questionData={selectedQuestion}
        onSubmit={handleSubmit}
        onDataChanged={getQuestions}

      />
    </div>
  );
};

export default QuestionsComponent;
