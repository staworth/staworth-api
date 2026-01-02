import express from 'express';
import { fetchArticles } from '../controllers/articles.js';

const router = express.Router();

router.get('/', fetchArticles);

export default router;
