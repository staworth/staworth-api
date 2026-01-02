import express from 'express';
import {
    fetchAccounts
} from '../controllers/accounts.js';

const router = express.Router();

router.get('/', fetchAccounts);

export default router;