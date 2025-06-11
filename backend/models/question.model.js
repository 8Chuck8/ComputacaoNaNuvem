import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  q_question: { type: String, required: true },  // texto da pergunta
  q_score:    { type: Number, default: 1 },      // pontos se acertar
  q_status:   { type: Number, default: 1 }       // 1=ativa, 0=inativa
}, {
  collection: 'questions',
  timestamps: false
});

// virtual para expor q_id em vez de _id
questionSchema.virtual('q_id').get(function() {
  return this._id.toString();
});
questionSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Question', questionSchema);