import express from 'express';
import { fetchBalanceSheet, fetchHistoricBalanceSheet } from '../controllers/balanceSheet.js';

const router = express.Router();

router.get('/', fetchBalanceSheet);
router.get('/historic', fetchHistoricBalanceSheet);

export default router;
