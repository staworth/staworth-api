import express from 'express';
import { fetchArticles, syncArticles } from '../controllers/articles.js';

const router = express.Router();

router.get('/', fetchArticles);
router.post('/sync', syncArticles);

export default router;
