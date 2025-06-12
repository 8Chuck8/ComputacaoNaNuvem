import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/question.model.js';

dotenv.config({ path: '../.env' });

const perguntas = [
  {
    problema: "Servidor desligado",
    q_question: "Qual é o primeiro passo ao encontrar um servidor desligado?",
    opcoes: [
      { texto: "Chamar o gerente", correta: false },
      { texto: "Verificar se está ligado à corrente", correta: true },
      { texto: "Desinstalar o sistema operativo", correta: false }
    ]
  },
  {
    problema: "Rede lenta",
    q_question: "O que pode causar lentidão na rede?",
    opcoes: [
      { texto: "Café derramado no teclado", correta: false },
      { texto: "Congestionamento de tráfego", correta: true },
      { texto: "Monitor desligado", correta: false }
    ]
  },
  {
    problema: "Disco cheio",
    q_question: "Como resolver um disco cheio?",
    opcoes: [
      { texto: "Apagar ficheiros desnecessários", correta: true },
      { texto: "Desligar o servidor", correta: false },
      { texto: "Reiniciar o router", correta: false }
    ]
  },
  {
    problema: "Erro de autenticação",
    q_question: "Qual é a causa comum de erro de autenticação?",
    opcoes: [
      { texto: "Palavra-passe errada", correta: true },
      { texto: "Falta de RAM", correta: false },
      { texto: "Problema com o monitor", correta: false }
    ]
  },
  {
    problema: "Falha de energia",
    q_question: "Qual o dispositivo que evita falhas de energia?",
    opcoes: [
      { texto: "Extensão múltipla", correta: false },
      { texto: "UPS (Fonte de alimentação ininterrupta)", correta: true },
      { texto: "Monitor externo", correta: false }
    ]
  },
  {
    problema: "Superaquecimento",
    q_question: "O que fazer se o servidor estiver a aquecer demasiado?",
    opcoes: [
      { texto: "Tapar as entradas de ar", correta: false },
      { texto: "Verificar o sistema de ventilação", correta: true },
      { texto: "Colocar gelo no processador", correta: false }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/datacenter');

    await Question.deleteMany(); // Limpa perguntas antigas
    await Question.insertMany(perguntas);

    console.log('✅ Perguntas inseridas com sucesso!');
    process.exit();
  } catch (err) {
    console.error('❌ Erro ao inserir perguntas:', err);
    process.exit(1);
  }
}

seed();
