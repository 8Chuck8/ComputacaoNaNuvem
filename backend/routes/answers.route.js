import { Router } from 'express';
import Answer from '../models/answer.model.js';

const router = Router();

// GET todas as respostas
router.get('/', async (req, res) => {
  try {
    const as = await Answer.find().populate('q_id', 'q_question');
    res.json({ success: true, data: as });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/question/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const answers = await Answer.find({ q_id: id });
    res.status(200).json({ success: true, data: answers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST nova resposta
router.post('/', async (req, res) => {
  const { a_answer, a_correct, q_id } = req.body;
  try {
    const a = await Answer.create({ a_answer, a_correct, q_id });
    res.json({ success: true, data: a });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
