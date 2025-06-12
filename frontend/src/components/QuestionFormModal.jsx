import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const QuestionFormModal = ({ show, onClose, mode, questionData, onSubmit }) => {
  const [form, setForm] = useState({ q_question: "", q_score: 1, q_status: 1 });
  const [answers, setAnswers] = useState([{ text: "", correct: false }, { text: "", correct: false }]);

    useEffect(() => {
        if (mode === "edit" && questionData) {
            setForm({
            _id: questionData._id,
            q_question: questionData.q_question,
            q_score: questionData.q_score,
            q_status: questionData.q_status === 1 || questionData.q_status === "Active" ? 1 : 0,
            });

            if (questionData.answers && questionData.answers.length > 0) {
            setAnswers(questionData.answers); // ✅ No parsing or reformatting needed
            }
        } else {
            setForm({ q_question: "", q_score: 1, q_status: 1 });
            setAnswers([{ text: "", correct: false }, { text: "", correct: false }]);
        }
    }, [mode, questionData]);



  const updateAnswer = (index, key, value) => {
    const updated = [...answers];
    updated[index][key] = value;
    setAnswers(updated);
  };

  const handleCorrectChange = (index) => {
    setAnswers((prev) =>
      prev.map((a, i) => ({ ...a, correct: i === index }))
    );
  };

  const addAnswer = () => setAnswers([...answers, { text: "", correct: false }]);

  const removeAnswer = (index) => {
    const updated = answers.filter((_, i) => i !== index);
    setAnswers(updated.length ? updated : [{ text: "", correct: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validAnswers = answers
      .filter((a) => a.text.trim() !== "")
      .map((a) => ({ a_answer: a.text.trim(), a_correct: a.correct }));

    if (validAnswers.length < 2) {
      alert("Please provide at least two answers.");
      return;
    }

    if (!validAnswers.some((a) => a.a_correct)) {
      alert("Please mark one answer as correct.");
      return;
    }

    const payload = {
      ...form,
      answers: validAnswers
    };

    const result = await onSubmit(payload);
    if (result?.success) onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{mode === "edit" ? "Edit Question" : "Add Question"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              value={form.q_question}
              onChange={(e) => setForm({ ...form, q_question: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Score</Form.Label>
            <Form.Control
              type="number"
              value={form.q_score}
              onChange={(e) => setForm({ ...form, q_score: parseInt(e.target.value) })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={form.q_status}
              onChange={(e) => setForm({ ...form, q_status: parseInt(e.target.value) })}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </Form.Select>
          </Form.Group>

          <Form.Label className="mt-4">Answers</Form.Label>
          {answers.map((ans, idx) => (
            <Row key={idx} className="align-items-center mb-2">
              <Col xs={1}>
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  checked={ans.correct}
                  onChange={() => handleCorrectChange(idx)}
                  title="Mark as correct"
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder={`Answer ${idx + 1}`}
                  value={ans.text}
                  onChange={(e) => updateAnswer(idx, "text", e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button variant="danger" size="sm" onClick={() => removeAnswer(idx)}>
                  ✕
                </Button>
              </Col>
            </Row>
          ))}

          <div className="text-end">
            <Button size="sm" variant="outline-primary" onClick={addAnswer}>
              + Add Answer
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default QuestionFormModal;
