import type { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { IncomeStatement, HistoricIncomeStatement } from '../types/incomeStatement.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fetchAnnualIncomeStatement = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/income-statement/income_statement_annual.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const incomeStatement: IncomeStatement = JSON.parse(fileContent);
    res.json(incomeStatement);
  } catch (error) {
    console.error('Error fetching annual income statement:', error);
    res.status(500).json({ error: 'Failed to fetch annual income statement' });
  }
};

export const fetchQuarterlyIncomeStatement = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/income-statement/income_statement_quarterly.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const incomeStatement: IncomeStatement = JSON.parse(fileContent);
    res.json(incomeStatement);
  } catch (error) {
    console.error('Error fetching quarterly income statement:', error);
    res.status(500).json({ error: 'Failed to fetch quarterly income statement' });
  }
};

export const fetchHistoricAnnualIncomeStatements = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/income-statement/historic_income_statement_annual.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const historicIncomeStatements: HistoricIncomeStatement = JSON.parse(fileContent);
    res.json(historicIncomeStatements);
  } catch (error) {
    console.error('Error fetching historic annual income statements:', error);
    res.status(500).json({ error: 'Failed to fetch historic annual income statements' });
  }
};

export const fetchHistoricQuarterlyIncomeStatements = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = join(__dirname, '../../data/income-statement/historic_income_statement_quarterly.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const historicIncomeStatements: HistoricIncomeStatement = JSON.parse(fileContent);
    res.json(historicIncomeStatements);
  } catch (error) {
    console.error('Error fetching historic quarterly income statements:', error);
    res.status(500).json({ error: 'Failed to fetch historic quarterly income statements' });
  }
};
