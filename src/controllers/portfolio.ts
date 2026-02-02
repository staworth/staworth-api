import type { Request, Response } from 'express';
import { readPortfolioFromStore, readHistoricPortfolioFromStore } from '../services/portfolio/portfolioStore.js';
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

export const fetchHistoricPortfolio = async (req: Request, res: Response): Promise<void> => {
  try {
    const historic = await readHistoricPortfolioFromStore();
    res.json(historic);
  } catch (error) {
    console.error('Error fetching historic portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch historic portfolio' });
  }
};

export const fetchHistoricPortfolioType = async (req: Request, res: Response): Promise<void> => {
  try {
    const historic = await readHistoricPortfolioFromStore();
    const typeOnly = Object.fromEntries(
      Object.entries(historic)
        .filter(([_, entry]) => typeof entry === 'object' && entry !== null && 'type' in entry)
        .map(([date, entry]) => [date, (entry as { type: unknown }).type])
    );
    res.json(typeOnly);
  } catch (error) {
    console.error('Error fetching historic portfolio type:', error);
    res.status(500).json({ error: 'Failed to fetch historic portfolio type' });
  }
};

export const fetchHistoricPortfolioExposure = async (req: Request, res: Response): Promise<void> => {
  try {
    const historic = await readHistoricPortfolioFromStore();
    const exposureOnly = Object.fromEntries(
      Object.entries(historic)
        .filter(([_, entry]) => typeof entry === 'object' && entry !== null && 'exposure' in entry)
        .map(([date, entry]) => [date, (entry as { exposure: unknown }).exposure])
    );
    res.json(exposureOnly);
  } catch (error) {
    console.error('Error fetching historic portfolio exposure:', error);
    res.status(500).json({ error: 'Failed to fetch historic portfolio exposure' });
  }
};
