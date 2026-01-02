import type { Request, Response } from 'express';
import type { Account } from '../types/account.js';
import accountsData from '../../data/accounts/accounts.json' with { type: 'json' };


export const fetchAccounts = async (req: Request, res: Response) => {
  const accounts = Object.values(accountsData);
  res.json(accounts);
}