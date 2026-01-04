import express from 'express';
import { fetchPortfolio, updatePortfolio } from '../controllers/portfolio.js';

const router = express.Router();

router.get('/', fetchPortfolio);
router.post('/update', updatePortfolio);

export default router;
