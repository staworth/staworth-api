import type { Article } from '../../types/article.js';
import { canonicalizeArticleUrl, normalizeArticle, type ArticleInput } from './articleNormalizer.js';
import type { ImportedArticle } from './articleStore.js';

/** Combines editorial records with the synced Beefy cache without exposing storage metadata. */
export function buildArticleCatalogue(
  manualArticles: ArticleInput[],
  importedArticles: Record<string, ImportedArticle>,
): Article[] {
  const articles = new Map<string, Article>();

  for (const article of manualArticles) {
    const normalized = normalizeArticle(article);
    articles.set(normalized.link, normalized);
  }

  for (const imported of Object.values(importedArticles)) {
    const { source: _source, ...article } = imported;
    articles.set(canonicalizeArticleUrl(article.link), article);
  }

  return [...articles.values()].sort((a, b) => b.date.localeCompare(a.date));
}
