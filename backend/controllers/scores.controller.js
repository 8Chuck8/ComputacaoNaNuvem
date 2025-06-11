import Score from '../models/score.model.js';
import mongoose from 'mongoose';

export const getScores =  async (req, res) => {
    try {
        const scores = await Score.find({}).populate('user_id');
        res.status(200).json({ success: true, data: scores });
    } catch (error) {
        console.log(`Error in retrieving scores: ${error}`);
        res.status(500).json({success:false, message:`Server error`});
    }
}

export const getScoresByUserId =  async (req, res) => {
    try {
        const scores = await Score.find({user_id: req.params.id}).populate('user_id');
        res.status(200).json({ success: true, data: scores });
    } catch (error) {
        console.log(`Error in retrieving scores: ${error}`);
        res.status(500).json({success:false, message:`Server error`});
    }
}

export const createScore = async (req,res) => {
    console.log('req.body:', req.body);
    const score = req.body;

    if (!score.score || !score.time || !score.user_id) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const newScore = new Score(score);

    try {
        await newScore.save();
        res.status(201).json({ success: true, data: newScore, message: 'Score successfuly created' });
    } catch (error) {
        console.log(`Error in creating score: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export const deleteScore = async (req, res) => {
    const {id} = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Score not found' })
    }
    
    try {
        await Score.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Score successfuly deleted' });
    } catch (error) {
        console.log(`Error in deleting score: ${error}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

export const updateScore = async (req, res) => {
    const {id} = req.params;

    const score = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success:false, message: 'Score not found' })
    }

    try {
        const updatedScore = await Score.findByIdAndUpdate(id, score, {new:true});
        res.status(200).json({success:true, data: updatedScore, message: "Score updated"});
    } catch (error) {
        res.status(500).json({success:true, message: "Server error"});

    }
}