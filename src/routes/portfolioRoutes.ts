import express from 'express';
import { fetchPortfolio } from '../controllers/portfolio.js';

const router = express.Router();

router.get('/', fetchPortfolio);

export default router;
