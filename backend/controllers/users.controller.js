import User from '../models/user.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log(`Error in retrieving users: ${error}`);
        res.status(500).json({ success: false, message: `Server error` });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'The login or password is incorrect' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'The login or password is incorrect' });
        }

        return res.status(200).json({ success: true, data: { _id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error(`Login error: ${error}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};




export const createUser = async (req, res) => {
    const user = req.body;

    const email = user.email;
    if (!user.username || !user.email || !user.password) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }
    console.log("Attempting to register email:", user.email);
    const existing_user = await User.findOne({ email: user.email });

    if (existing_user) {
        return res.status(400).json({ success: false, message: 'This email already registered' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        user.role = "user";

        const newUser = new User(user);
        await newUser.save();

        res.status(201).json({ success: true, data: newUser, message: 'User successfully created' });
    } catch (error) {
        console.error(`Error in creating user: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User successfully deleted' });
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: 'User not found' })
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json({ success: true, data: updatedUser, message: "User updated" });
    } catch (error) {
        res.status(500).json({ success: true, message: "Server error" });

    }
}
