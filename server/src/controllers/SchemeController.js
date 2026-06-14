import Scheme from '../models/Scheme.js';
import { evaluateEligibility } from '../services/EligibilityService.js';

export const getSchemes = async (req, res) => {
  try {
    const { category, state } = req.query;
    let query = {};
    if (category) query.category = category;
    if (state) query['eligibilityRules.states'] = { $in: [state, 'All'] };

    const schemes = await Scheme.find(query);
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEligibleSchemes = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    const allSchemes = await Scheme.find({ isActive: true });
    
    const eligibleSchemes = allSchemes.map(scheme => {
      const evaluation = evaluateEligibility(user, scheme);
      return {
        scheme,
        evaluation
      };
    }).filter(item => item.evaluation.status !== 'Not Eligible');

    res.json(eligibleSchemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkEligibilityManual = async (req, res) => {
  try {
    const profile = req.body;
    const allSchemes = await Scheme.find({ isActive: true });
    
    // Create a mock user object to reuse the EligibilityService
    const mockUser = { profile };
    
    const results = allSchemes.map(scheme => {
      const evaluation = evaluateEligibility(mockUser, scheme);
      return {
        scheme,
        evaluation
      };
    }).filter(item => item.evaluation.status !== 'Not Eligible')
      .sort((a, b) => b.evaluation.matchPercentage - a.evaluation.matchPercentage);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addScheme = async (req, res) => {
  try {
    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
