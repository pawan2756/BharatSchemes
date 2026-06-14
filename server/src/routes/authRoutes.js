import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bharatbenefit_secret', {
    expiresIn: '30d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      
      if (!user.profile) user.profile = {};
      if (req.body.age) user.profile.age = req.body.age;
      if (req.body.gender) user.profile.gender = req.body.gender;
      
      if (!user.profile.location) user.profile.location = {};
      if (req.body.state) user.profile.location.state = req.body.state;
      
      if (!user.profile.socioEconomic) user.profile.socioEconomic = {};
      if (req.body.income) user.profile.socioEconomic.familyIncome = req.body.income;
      if (req.body.caste) user.profile.socioEconomic.caste = req.body.caste;
      
      if (!user.profile.status) user.profile.status = {};
      user.profile.status.isStudent = req.body.isStudent;
      user.profile.status.isFarmer = req.body.isFarmer;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/saved', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      if (!user.profile) user.profile = {};
      if (!user.profile.savedSchemes) user.profile.savedSchemes = [];
      
      const schemeId = req.body.schemeId;
      const index = user.profile.savedSchemes.indexOf(schemeId);
      if (index === -1) {
        user.profile.savedSchemes.push(schemeId);
      } else {
        user.profile.savedSchemes.splice(index, 1);
      }
      await user.save();
      res.json({ savedSchemes: user.profile.savedSchemes });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
