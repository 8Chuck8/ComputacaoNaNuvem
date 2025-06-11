import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  a_answer:  { type: String, required: true },  // texto da resposta selecionada
  a_correct: { type: Number, required: true },  // 1=certa, 0=errada
  q_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
}, {
  collection: 'answers',
  timestamps: false
});

// virtual para expor a_id em vez de _id
answerSchema.virtual('a_id').get(function() {
  return this._id.toString();
});
answerSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Answer', answerSchema);