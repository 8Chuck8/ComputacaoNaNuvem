import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';                  // ← importa o cors
import usersRoutes from './routes/users.route.js';
import scoresRoutes from './routes/scores.route.js';
import questionsRoutes from './routes/questions.route.js';
import answersRoutes from './routes/answers.route.js';
import { connectDB } from './config/db.js';
import { seed } from './seed.js';

dotenv.config();

const app = express();

app.use(express.json());

// ─── Registar CORS ─────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173'         // ou '*' para permitir todas as origens
}));
// ───────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.use('/api/users', usersRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/questions', questionsRoutes);

console.log(process.env.MONGO_URI);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB', error);
  });

seed()
.then(() => {
      console.log(`Dados importados`); 
  })
  .catch((error) => {
    console.error('Erro ao importar dados', error);
  });
