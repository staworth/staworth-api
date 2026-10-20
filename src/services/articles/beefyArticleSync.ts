import { BEEFY_ARTICLE_CUTOFF, BeefyGatsbySource, type BeefySource } from './beefySource.js';
import { UpstashArticleStore, type ArticleStore, type ImportedArticle } from './articleStore.js';

export interface ArticleSyncSummary {
  scanned: number;
  created: number;
  updated: number;
  unchanged: number;
  deleted: number;
  failed: number;
}

export async function syncBeefyArticles(
  source: BeefySource = new BeefyGatsbySource(),
  store: ArticleStore = new UpstashArticleStore(),
): Promise<ArticleSyncSummary> {
  const result = await source.fetchArticles();
  const existing = await store.readBeefyArticles();
  const next = { ...existing };
  const summary: ArticleSyncSummary = { scanned: result.articles.length, created: 0, updated: 0, unchanged: 0, deleted: 0, failed: result.failed };

  for (const [url, article] of Object.entries(existing)) {
    if (article.source === 'beefy' && article.date < BEEFY_ARTICLE_CUTOFF) {
      delete next[url];
      summary.deleted += 1;
    }
  }

  for (const article of result.articles) {
    const previous = existing[article.link];
    if (!previous) {
      next[article.link] = article;
      summary.created += 1;
      continue;
    }
    if (sameArticle(previous, article)) {
      summary.unchanged += 1;
      continue;
    }
    next[article.link] = article;
    summary.updated += 1;
  }

  await store.writeBeefyArticles(next);
  console.info('Beefy article sync complete', summary);
  return summary;
}

function sameArticle(a: ImportedArticle, b: ImportedArticle): boolean {
  return a.link === b.link
    && a.title === b.title
    && a.date === b.date
    && a.description === b.description
    && a.image === b.image
    && a.source === b.source
    && a.categories.length === b.categories.length
    && a.categories.every((category, index) => category === b.categories[index]);
}
