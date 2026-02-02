import express from 'express';
import { fetchPortfolio, fetchHistoricPortfolio, fetchHistoricPortfolioType, fetchHistoricPortfolioExposure, updatePortfolio } from '../controllers/portfolio.js';

const router = express.Router();

router.get('/', fetchPortfolio);
router.get('/historic', fetchHistoricPortfolio);
router.get('/historic/type', fetchHistoricPortfolioType);
router.get('/historic/exposure', fetchHistoricPortfolioExposure);
router.get('/update', updatePortfolio);
router.post('/update', updatePortfolio);

export default router;
