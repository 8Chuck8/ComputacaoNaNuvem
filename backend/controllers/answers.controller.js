import Answer from '../models/answer.model.js';
import mongoose from 'mongoose';

export const getAnswers =  async (req, res) => {
    try {
        const answers = await Answer.find({}).populate('question_id');
        res.status(200).json({ success: true, data: answers });
    } catch (error) {
        console.log(`Error in retrieving answers: ${error}`);
        res.status(500).json({success:false, message:`Server error`});
    }
}

export const getAnswersByQuestionId = async (req, res) => {
    try {
        const answers = await Answer.find({question_id: req.params.id}).populate('question_id');
        res.status(200).json({ success: true, data: answers });
    } catch (error) {
        console.log(`Error in retrieving answers: ${error}`);
        res.status(500).json({success:false, message:`Server error`});
    }
}

export const createAnswer = async (req,res) => {
    console.log('req.body:', req.body);
    const answer = req.body;

    if (!answer.answer || !answer.question_id) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newAnswer = new Answer(answer);

    try {
        await newAnswer.save();
        res.status(201).json({ success: true, data: newAnswer, message: 'Answer successfuly created' });
    } catch (error) {
        console.log(`Error in creating answer: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteAnswer = async (req, res) => {
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Answer not found' })
    }
    
    try {
        await Answer.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Answer successfuly deleted' });
    } catch (error) {
        console.log(`Error in deleting Answer: ${error}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const updateAnswer = async (req, res) => {
    const {id} = req.params;

    const answer = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Answer not found' })
    }

    try {
        const updatedAnswer = await Answer.findByIdAndUpdate(id, answer, {new:true});
        res.status(200).json({success:true, data: updatedAnswer, message: "Answer updated"});
    } catch (error) {
        res.status(500).json({success:true, message: "Server error"});

    }
}