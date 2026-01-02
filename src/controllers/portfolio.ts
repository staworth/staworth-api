import type { Request, Response } from 'express';
import type { PortfolioItem } from '../types/portfolio.js';
import portfolioData from '../../data/portfolio/portfolio.json' with { type: 'json' };

export const fetchPortfolio = (req: Request, res: Response): void => {
  res.json(portfolioData);
};
