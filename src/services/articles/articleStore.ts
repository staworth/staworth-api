import type { Article } from '../../types/article.js';

const ARTICLE_INDEX_KEY = 'articles:beefy:v1';

export interface ImportedArticle extends Article {
  source: 'beefy';
}

export interface ArticleStore {
  readBeefyArticles(): Promise<Record<string, ImportedArticle>>;
  writeBeefyArticles(articles: Record<string, ImportedArticle>): Promise<void>;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

async function requestStore<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${requireEnv('PORTFOLIO_STORE_URL')}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requireEnv('PORTFOLIO_STORE_TOKEN')}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Article store request failed: ${response.status} ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}

export class UpstashArticleStore implements ArticleStore {
  async readBeefyArticles(): Promise<Record<string, ImportedArticle>> {
    const data = await requestStore<{ result?: string | null }>(`get/${ARTICLE_INDEX_KEY}`, { method: 'GET' });
    return data.result ? JSON.parse(data.result) as Record<string, ImportedArticle> : {};
  }

  async writeBeefyArticles(articles: Record<string, ImportedArticle>): Promise<void> {
    await requestStore(`set/${ARTICLE_INDEX_KEY}`, {
      method: 'POST',
      body: JSON.stringify(articles),
    });
  }
}
