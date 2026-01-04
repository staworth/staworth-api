import type { Portfolio } from '../../types/portfolio.js';

const baseUrl = process.env.PORTFOLIO_STORE_URL;
const token = process.env.PORTFOLIO_STORE_TOKEN;
const KEY = 'portfolio';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function fetchJson<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireEnv('PORTFOLIO_STORE_TOKEN', token)}`,
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
  const url = `${requireEnv('PORTFOLIO_STORE_URL', baseUrl)}get/${KEY}`;
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
  const url = `${requireEnv('PORTFOLIO_STORE_URL', baseUrl)}set/${KEY}`;
  const serialized = JSON.stringify(portfolio);
  await fetchJson(url, {
    method: 'POST',
    body: serialized,
  });
}