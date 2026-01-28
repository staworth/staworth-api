import type { Portfolio, HistoricPortfolio } from '../../types/portfolio.js';

const KEY = 'portfolio';
const HISTORIC_KEY = 'historic_portfolio';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireEnv('PORTFOLIO_STORE_TOKEN')}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function readPortfolioFromStore(): Promise<Portfolio> {
  const url = `${requireEnv('PORTFOLIO_STORE_URL')}get/${KEY}`;
  const data = await fetchJson<{ result?: string | null }>(url, { method: 'GET' });
  
  // Upstash returns { result: "..." }
  const storedValue = data.result;
  
  if (!storedValue) {
    return { positions: {} };
  }
  
  // Parse the string from Redis (which is stored as a JSON string)
  const parsed = JSON.parse(storedValue) as Portfolio;
  
  // Ensure positions object exists
  if (!parsed.positions) {
    parsed.positions = {};
  }
  
  return parsed;
}

export async function writePortfolioToStore(portfolio: Portfolio): Promise<void> {
  const url = `${requireEnv('PORTFOLIO_STORE_URL')}set/${KEY}`;
  const serialized = JSON.stringify(portfolio);
  await fetchJson(url, {
    method: 'POST',
    body: serialized,
  });
}

export async function readHistoricPortfolioFromStore(): Promise<HistoricPortfolio> {
  const url = `${requireEnv('PORTFOLIO_STORE_URL')}get/${HISTORIC_KEY}`;
  const data = await fetchJson<{ result?: string | null }>(url, { method: 'GET' });

  const storedValue = data.result;

  if (!storedValue) {
    return {};
  }

  return JSON.parse(storedValue) as HistoricPortfolio;
}

export async function writeHistoricPortfolioToStore(historic: HistoricPortfolio): Promise<void> {
  const url = `${requireEnv('PORTFOLIO_STORE_URL')}set/${HISTORIC_KEY}`;
  const serialized = JSON.stringify(historic);
  await fetchJson(url, {
    method: 'POST',
    body: serialized,
  });
}