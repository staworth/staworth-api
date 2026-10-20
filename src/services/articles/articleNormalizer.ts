import type { Article } from '../../types/article.js';

export type ArticleInput = Omit<Article, 'date' | 'categories'> & {
  date: string;
  categories?: unknown;
};

export function canonicalizeArticleUrl(value: string): string {
  const url = new URL(value);
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.replace(/\/{2,}/g, '/');
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.toString();
}

export function normalizeCategories(categories: unknown, required: string[] = []): string[] {
  const values = Array.isArray(categories) ? categories : [];
  return [...new Set([...required, ...values]
    .filter((category): category is string => typeof category === 'string')
    .map(category => category.trim().toLowerCase())
    .filter(Boolean))];
}

export function normalizeArticle(article: ArticleInput, requiredCategories: string[] = []): Article {
  const date = new Date(article.date);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid article date: ${article.date}`);
  }

  return {
    link: canonicalizeArticleUrl(article.link),
    title: article.title.trim(),
    date: date.toISOString(),
    description: article.description.trim(),
    image: article.image.trim(),
    categories: normalizeCategories(article.categories, requiredCategories),
  };
}
