import type { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { BalanceSheet, HistoricBalanceSheet } from '../types/balanceSheet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fetchBalanceSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/balance-sheet/balance_sheet.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const balanceSheet: BalanceSheet = JSON.parse(fileContent);
    res.json(balanceSheet);
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    res.status(500).json({ error: 'Failed to fetch balance sheet' });
  }
};

export const fetchHistoricBalanceSheet = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/balance-sheet/historic_balance_sheet.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const historicBalanceSheet: HistoricBalanceSheet = JSON.parse(fileContent);
    res.json(historicBalanceSheet);
  } catch (error) {
    console.error('Error fetching historic balance sheet:', error);
    res.status(500).json({ error: 'Failed to fetch historic balance sheet' });
  }
};
