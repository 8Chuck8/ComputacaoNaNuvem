import Question from '../models/question.model.js';
import Answer from '../models/answer.model.js';
import mongoose from 'mongoose';

export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Error retrieving questions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createQuestion = async (req, res) => {
  const { q_question, q_score, q_status = 1 } = req.body;

  if (!q_question || q_score === undefined) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const newQuestion = await Question.create({ q_question, q_score, q_status });
    res.status(201).json({ success: true, data: newQuestion });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { q_question, q_score, q_status, answers } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid question ID" });
  }

  if (!q_question || q_score === undefined || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Ensure minimum 2 answers
  const cleanedAnswers = answers.filter(a => a.a_answer?.trim());
  if (cleanedAnswers.length < 2) {
    return res.status(400).json({ success: false, message: "At least two answers are required." });
  }

  if (!cleanedAnswers.some(a => a.a_correct)) {
    return res.status(400).json({ success: false, message: "At least one correct answer is required." });
  }

  try {
    // Step 1: Update question itself
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { q_question, q_score, q_status },
      { new: true }
    );

    // Step 2: Delete all existing answers for this question
    await Answer.deleteMany({ q_id: id });

    // Step 3: Insert new answers
    const newAnswerDocs = cleanedAnswers.map((a) => ({
      a_answer: a.a_answer,
      a_correct: a.a_correct ? 1 : 0,
      q_id: id
    }));

    await Answer.insertMany(newAnswerDocs);

    return res.status(200).json({
      success: true,
      data: updatedQuestion,
      message: "Question and answers updated successfully",
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid question ID" });
  }

  try {
    await Question.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
