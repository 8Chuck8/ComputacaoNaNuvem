import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
      // category_id: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: 'categories',
      //   required: true,
      // },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true,
    }
);

const User = mongoose.model('users', userSchema);

export default User;