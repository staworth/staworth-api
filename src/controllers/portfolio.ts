import type { Request, Response } from 'express';
import { readPortfolioFromStore } from '../services/portfolio/portfolioStore.js';
import { updatePortfolio as runPortfolioUpdate } from '../services/portfolio/portfolioUpdater.js';

const CRON_SECRET = process.env.CRON_SECRET;

export const fetchPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const portfolio = await readPortfolioFromStore();
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio from store:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

export const updatePortfolio = async (req: Request, res: Response): Promise<void> => {
  // Check for either manual trigger with secret OR Vercel CRON user agent
  const isVercelCron = req.headers['user-agent']?.includes('vercel-cron');
  const hasValidSecret = CRON_SECRET && req.headers['x-cron-secret'] === CRON_SECRET;

  if (CRON_SECRET && !hasValidSecret && !isVercelCron) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    const result = await runPortfolioUpdate();
    res.status(200).json({ ok: true, total: result.total });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
};
