import Question from '../models/question.model.js';
import mongoose from 'mongoose';

export const getQuestions =  async (req, res) => {
    try {
        const questions = await Question.find({});
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        console.log(`Error in retrieving questions: ${error}`);
        res.status(500).json({success:false, message:`Server error`});
    }
}

export const createQuestion = async (req,res) => {
    console.log('req.body:', req.body);
    const question = req.body;

    if (!question.question || !question.score) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newQuestion = new Question(question);

    try {
        await newQuestion.save();
        res.status(201).json({ success: true, data: newQuestion, message: 'Question successfuly created' });
    } catch (error) {
        console.log(`Error in creating question: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteQuestion = async (req, res) => {
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Question not found' })
    }
    
    try {
        await Question.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Question successfuly deleted' });
    } catch (error) {
        console.log(`Error in deleting Question: ${error}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const updateQuestion = async (req, res) => {
    const {id} = req.params;

    const question = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Question not found' })
    }

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(id, question, {new:true});
        res.status(200).json({success:true, data: updatedQuestion, message: "Question updated"});
    } catch (error) {
        res.status(500).json({success:true, message: "Server error"});

    }
}