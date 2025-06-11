import { Router } from 'express';
import Question from '../models/question.model.js';

const router = Router();

// GET todas as perguntas
router.get('/', async (req, res) => {
  try {
    const qs = await Question.find();
    res.json({ success: true, data: qs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST nova pergunta
router.post('/', async (req, res) => {
  const { q_question, q_score, q_status } = req.body;
  try {
    const q = await Question.create({ q_question, q_score, q_status });
    res.json({ success: true, data: q });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;