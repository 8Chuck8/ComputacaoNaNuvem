// server/scripts/seedAll.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../backend/models/question.model.js';
import Answer   from '../backend/models/answer.model.js';

dotenv.config({ path: '../.env' });
console.log('→ Using URI:', process.env.MONGO_URI);

// 1) Master questions
const questionsData = [
  {
    q_question: 'Which component ensures redundant power supply?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'What is the main cause of overheating in racks?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'What is the purpose of a firewall in a datacenter?',
    q_score:    5,
    q_status:   1
  },
  {
    q_question: 'Which device is used to store backup data?',
    q_score:    5,
    q_status:   1
  },
  {
    q_question: 'Which protocol is commonly used for remote server access?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'What is the ideal temperature range for a datacenter?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'What component is critical for cooling in a rack?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'Why is cable management important in datacenters?',
    q_score:    5,
    q_status:   1
  },
  {
    q_question: 'What is RAID used for?',
    q_score:    10,
    q_status:   1
  },
  {
    q_question: 'Which type of storage offers the fastest performance?',
    q_score:    5,
    q_status:   1
  }
];

// 2) Static options corresponding to each question
const optionsData = {
  'Which component ensures redundant power supply?': [
    { texto: 'Power supply unit', correta: 0 },
    { texto: 'UPS (Uninterruptible Power Supply)', correta: 1 },
    { texto: 'Cooling fan', correta: 0 },
    { texto: 'Motherboard', correta: 0 }
  ],
  'What is the main cause of overheating in racks?': [
    { texto: 'Blocked airflow', correta: 1 },
    { texto: 'Faulty memory', correta: 0 },
    { texto: 'Idle CPU', correta: 0 },
    { texto: 'Fragmented disk', correta: 0 }
  ],
  'What is the purpose of a firewall in a datacenter?': [
    { texto: 'To filter network traffic', correta: 1 },
    { texto: 'To manage power', correta: 0 },
    { texto: 'To cool servers', correta: 0 },
    { texto: 'To perform backups', correta: 0 }
  ],
  'Which device is used to store backup data?': [
    { texto: 'Router', correta: 0 },
    { texto: 'Switch', correta: 0 },
    { texto: 'External hard drive', correta: 1 },
    { texto: 'Firewall', correta: 0 }
  ],
  'Which protocol is commonly used for remote server access?': [
    { texto: 'HTTP', correta: 0 },
    { texto: 'FTP', correta: 0 },
    { texto: 'SSH', correta: 1 },
    { texto: 'SMTP', correta: 0 }
  ],
  'What is the ideal temperature range for a datacenter?': [
    { texto: '0–10°C', correta: 0 },
    { texto: '18–27°C', correta: 1 },
    { texto: '30–40°C', correta: 0 },
    { texto: '45–50°C', correta: 0 }
  ],
  'What component is critical for cooling in a rack?': [
    { texto: 'CPU', correta: 0 },
    { texto: 'Fan', correta: 1 },
    { texto: 'Power supply', correta: 0 },
    { texto: 'Monitor', correta: 0 }
  ],
  'Why is cable management important in datacenters?': [
    { texto: 'It increases electricity consumption', correta: 0 },
    { texto: 'It helps maintain proper airflow', correta: 1 },
    { texto: 'It improves aesthetics only', correta: 0 },
    { texto: 'It replaces cooling', correta: 0 }
  ],
  'What is RAID used for?': [
    { texto: 'To speed up internet', correta: 0 },
    { texto: 'To manage redundant disks', correta: 1 },
    { texto: 'To cool systems', correta: 0 },
    { texto: 'To create firewalls', correta: 0 }
  ],
  'Which type of storage offers the fastest performance?': [
    { texto: 'HDD', correta: 0 },
    { texto: 'DVD', correta: 0 },
    { texto: 'SSD', correta: 1 },
    { texto: 'USB 2.0', correta: 0 }
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
