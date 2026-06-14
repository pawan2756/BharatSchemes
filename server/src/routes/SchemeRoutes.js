import express from 'express';
import { getSchemes, getEligibleSchemes, addScheme, checkEligibilityManual } from '../controllers/SchemeController.js';

const router = express.Router();

router.get('/', getSchemes);
router.post('/', addScheme);
router.post('/check-eligibility', checkEligibilityManual);

// Note: In production, add auth middleware before getEligibleSchemes
router.get('/eligible', getEligibleSchemes);

export default router;
