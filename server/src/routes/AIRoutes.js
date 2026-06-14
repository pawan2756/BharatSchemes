import express from 'express';
import { getAIResponse } from '../services/AIService.js';
import Scheme from '../models/Scheme.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { messages, profile } = req.body; // Expecting an array of previous messages
    
    // Get the latest user query
    const latestQuery = messages[messages.length - 1].text;
    
    // Fetch a sample of schemes to use as context (top 30 active schemes)
    const schemes = await Scheme.find({ isActive: true }).limit(30);
    
    const reply = await getAIResponse(latestQuery, schemes, messages.slice(0, -1), profile);
    
    res.json({ reply });
  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
