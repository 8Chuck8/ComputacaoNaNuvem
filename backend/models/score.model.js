/* import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  s_name:  { type: String, required: true },
  s_score: { type: Number, required: true },
  s_time:  { type: Number, required: true },   // em segundos
  u_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  collection: 'scores',
  timestamps: true
});

scoreSchema.virtual('s_id').get(function() {
  return this._id.toString();
});
scoreSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Score', scoreSchema); */

import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Score', scoreSchema);