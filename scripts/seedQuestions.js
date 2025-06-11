// server/scripts/seedAll.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../backend/models/question.model.js';
import Answer   from '../backend/models/answer.model.js';

dotenv.config({ path: './.env' });
console.log('→ Using URI:', process.env.MONGO_URI);

// 1) Perguntas mestras
const questionsData = [
  {
    q_question: 'Qual componente garante alimentação redundante?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'Qual a principal causa de superaquecimento em racks?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'Para que serve um firewall num datacenter?',
    q_score:    5,
    q_status:   1
  }
];

// 2) Opções estáticas que correspondem a cada pergunta
const optionsData = {
  'Qual componente garante alimentação redundante?': [
    { texto: 'Fonte de alimentação', correta: 0 },
    { texto: 'Nobreak',              correta: 1 },
    { texto: 'Ventoinha',            correta: 0 },
    { texto: 'Placa-mãe',            correta: 0 }
  ],
  'Qual a principal causa de superaquecimento em racks?': [
    { texto: 'Fluxo de ar bloqueado', correta: 1 },
    { texto: 'Memória com defeito',   correta: 0 },
    { texto: 'CPU ociosa',            correta: 0 },
    { texto: 'Disco fragmentado',      correta: 0 }
  ],
  'Para que serve um firewall num datacenter?': [
    { texto: 'Filtrar tráfego de rede', correta: 1 },
    { texto: 'Gerir energia elétrica',  correta: 0 },
    { texto: 'Resfriar servidores',     correta: 0 },
    { texto: 'Fazer backups',           correta: 0 }
  ]
};

async function seedAll() {
  try {
    // Conecta
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✔️  Conectado ao MongoDB');

    // Limpa as coleções
    await Question.deleteMany();
    await Answer.deleteMany();
    console.log('🗑️  Coleções questions e answers limpas');

    // Insere perguntas
    const insertedQs = await Question.insertMany(questionsData);
    console.log(`🪴  Inseridas ${insertedQs.length} perguntas`);

    // Prepara e insere as opções ligadas (answers)
    const answerDocs = [];
    insertedQs.forEach(q => {
      const opts = optionsData[q.q_question] || [];
      opts.forEach(op => {
        answerDocs.push({
          q_id:      q._id,
          a_answer:  op.texto,
          a_correct: op.correta
        });
      });
    });
    const insertedAs = await Answer.insertMany(answerDocs);
    console.log(`🪴  Inseridas ${insertedAs.length} opções em answers`);

    // Desconecta
    await mongoose.disconnect();
    console.log('🔌  Desconectado do MongoDB');
    process.exit(0);

  } catch (err) {
    console.error('❌ Erro no seedAll:', err);
    process.exit(1);
  }
}

seedAll();
