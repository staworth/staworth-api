import express from 'express';
import { fetchPortfolio, fetchHistoricPortfolio, updatePortfolio } from '../controllers/portfolio.js';

const router = express.Router();

router.get('/', fetchPortfolio);
router.get('/historic', fetchHistoricPortfolio);
router.get('/update', updatePortfolio);
router.post('/update', updatePortfolio);

export default router;
