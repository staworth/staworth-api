import express from 'express';
import { fetchLinks } from '../controllers/links.js';

const router = express.Router();

router.get('/', fetchLinks);

export default router;
