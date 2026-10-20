import type { Request, Response } from 'express';
import articlesData from '../../data/articles/articles.json' with { type: 'json' };
import { UpstashArticleStore } from '../services/articles/articleStore.js';
import { syncBeefyArticles } from '../services/articles/beefyArticleSync.js';
import { buildArticleCatalogue } from '../services/articles/articleCatalogue.js';

export const fetchArticles = async (req: Request, res: Response): Promise<void> => {
  let imported = {};

  try {
    imported = await new UpstashArticleStore().readBeefyArticles();
  } catch (error) {
    // Static records remain available if the cache is temporarily unavailable.
    console.error('Unable to read Beefy article cache:', error);
  }

  res.json(buildArticleCatalogue(Object.values(articlesData), imported));
};

export const syncArticles = async (req: Request, res: Response): Promise<void> => {
  const cronSecret = process.env.CRON_SECRET;
  const hasValidSecret = cronSecret && (
    req.headers['x-cron-secret'] === cronSecret
    || req.headers.authorization === `Bearer ${cronSecret}`
  );
  if (!hasValidSecret) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    res.json({ ok: true, ...(await syncBeefyArticles()) });
  } catch (error) {
    console.error('Beefy article sync failed:', error);
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};
