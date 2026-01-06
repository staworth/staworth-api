import express from 'express';
import { 
  fetchAnnualIncomeStatement, 
  fetchQuarterlyIncomeStatement,
  fetchHistoricAnnualIncomeStatements,
  fetchHistoricQuarterlyIncomeStatements
} from '../controllers/incomeStatement.js';

const router = express.Router();

router.get('/annual', fetchAnnualIncomeStatement);
router.get('/quarter', fetchQuarterlyIncomeStatement);
router.get('/annual/historic', fetchHistoricAnnualIncomeStatements);
router.get('/quarter/historic', fetchHistoricQuarterlyIncomeStatements);

export default router;
