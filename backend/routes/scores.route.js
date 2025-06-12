/* import { Router } from 'express';
import Score from '../models/score.model.js';

const router = Router();

// GET /api/scores
router.get('/', async (req, res) => {
  try {
    const docs = await Score.find().populate('u_id', 'u_name');
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scores
router.post('/', async (req, res) => {
  try {
    const { s_name, s_score, s_time, u_id } = req.body;
    const s = await Score.create({ s_name, s_score, s_time, u_id });
    res.json({ success: true, data: s });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router; */

import { Router } from 'express';
import { getScores, getScoresByUserId, createScore } from '../controllers/scores.controller.js';

const router = Router();

router.get('/', getScores);
router.get('/user/:id', getScoresByUserId);
router.post('/', createScore);

export default router;