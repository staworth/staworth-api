import type { Request, Response } from 'express';
import type { Link } from '../types/link.js';
import linksData from '../../data/links/links.json' with { type: 'json' };

export const fetchLinks = (req: Request, res: Response): void => {
  const links = Object.values(linksData);
  res.json(links);
};
