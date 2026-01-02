import type { Request, Response } from 'express';
import type { Article } from '../types/article.js';
import articlesData from '../../data/articles/articles.json' with { type: 'json' };

export const fetchArticles = (req: Request, res: Response): void => {
  const articles = Object.values(articlesData);
  res.json(articles);
};
