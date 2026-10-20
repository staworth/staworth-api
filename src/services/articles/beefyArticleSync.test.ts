import { describe, expect, it } from 'vitest';
import { BeefyGatsbySource } from './beefySource.js';
import { syncBeefyArticles } from './beefyArticleSync.js';
import { canonicalizeArticleUrl, normalizeArticle, normalizeCategories } from './articleNormalizer.js';
import type { ArticleStore, ImportedArticle } from './articleStore.js';
import { buildArticleCatalogue } from './articleCatalogue.js';

function listing(slug: string, title = 'QiDao Product', date = 'March 6, 2026'): object {
  return {
    result: {
      data: {
        allMarkdownRemark: {
          edges: [{ node: { fields: { slug }, frontmatter: {
            title,
            date,
            short_description: 'A QiDao integration.',
            tags: [' Partners ', 'partners'],
            header_image: { childImageSharp: { gatsbyImageData: { images: { fallback: { src: '/cover.png' } } } } },
          } } }],
        },
      },
    },
  };
}

class MemoryStore implements ArticleStore {
  constructor(public articles: Record<string, ImportedArticle> = {}) {}
  async readBeefyArticles() { return { ...this.articles }; }
  async writeBeefyArticles(articles: Record<string, ImportedArticle>) { this.articles = { ...articles }; }
}

describe('Beefy article sync', () => {
  it('follows listing pages and normalizes imported articles', async () => {
    const fetcher = async (url: string): Promise<Response> => {
      if (url.includes('/page/3/')) return new Response('', { status: 404 });
      return new Response(JSON.stringify(url.includes('/page/2/') ? listing('second', 'Second') : listing('first')), { status: 200 });
    };
    const result = await new BeefyGatsbySource(fetcher, 10, 0).fetchArticles();
    expect(result.articles).toHaveLength(2);
    expect(result.articles[0]).toMatchObject({
      link: 'https://beefy.com/articles/first/',
      date: '2026-03-06T00:00:00.000Z',
      categories: ['beefy', 'partners', 'qidao'],
      image: 'https://beefy.com/cover.png',
      source: 'beefy',
    });
  });

  it('deduplicates canonical URLs and is idempotent', async () => {
    const store = new MemoryStore();
    const source = { fetchArticles: async () => ({ failed: 0, articles: [{
      link: 'https://beefy.com/articles/example/', title: 'Example', date: '2026-01-01T00:00:00.000Z',
      description: 'Description', image: 'https://beefy.com/image.png', categories: ['beefy'], source: 'beefy' as const,
    }] }) };
    expect((await syncBeefyArticles(source, store)).created).toBe(1);
    expect((await syncBeefyArticles(source, store)).unchanged).toBe(1);
    expect(Object.keys(store.articles)).toEqual(['https://beefy.com/articles/example/']);
    expect(canonicalizeArticleUrl('https://beefy.com/articles/example?x=1')).toBe('https://beefy.com/articles/example/');
  });

  it('excludes and prunes imported Beefy articles before 30 May 2024', async () => {
    const fetcher = async (url: string): Promise<Response> => {
      if (url.includes('/page/2/')) return new Response('', { status: 404 });
      return new Response(JSON.stringify(listing('legacy', 'Legacy', 'May 29, 2024')), { status: 200 });
    };
    expect((await new BeefyGatsbySource(fetcher, 10, 0).fetchArticles()).articles).toEqual([]);

    const oldUrl = 'https://beefy.com/articles/legacy/';
    const store = new MemoryStore({
      [oldUrl]: {
        link: oldUrl, title: 'Legacy', date: '2024-05-29T00:00:00.000Z', description: 'Old',
        image: 'https://beefy.com/old.png', categories: ['beefy'], source: 'beefy',
      },
    });
    const summary = await syncBeefyArticles({ fetchArticles: async () => ({ articles: [], failed: 0 }) }, store);
    expect(summary.deleted).toBe(1);
    expect(store.articles).toEqual({});
  });

  it('normalizes categories and returns only the public categories response shape', () => {
    expect(normalizeCategories([' BEEFY ', 'beefy', 'Partners', 'Accountant Quits'])).toEqual(['beefy', 'partners', 'ocf institute']);
    expect(normalizeArticle({ link: 'https://example.com/a', title: 'A', date: '25 March 2026', description: 'D', image: '/a.png', categories: [' STAWORTH '] })).toMatchObject({
      date: '2026-03-25T00:00:00.000Z', categories: ['staworth'],
    });
    const catalogue = buildArticleCatalogue(
      [{ link: 'https://example.com/manual', title: 'Manual', date: '2026-01-01', description: 'Kept', image: '/manual.png', categories: ['STAWORTH'] }],
      { 'https://beefy.com/articles/imported/': { link: 'https://beefy.com/articles/imported/', title: 'Imported', date: '2026-01-02T00:00:00.000Z', description: 'Synced', image: 'https://beefy.com/imported.png', categories: ['beefy', 'accountant quits'], source: 'beefy' } },
    );
    expect(catalogue).toHaveLength(2);
    expect(catalogue.every(article => Array.isArray(article.categories) && !('category' in article) && !('source' in article))).toBe(true);
    expect(catalogue.find(article => article.title === 'Imported')).toMatchObject({ date: '2 January 2026', categories: ['BEEFY', 'OCF INSTITUTE'] });
    expect(catalogue.find(article => article.title === 'Manual')).toMatchObject({ categories: ['STAWORTH'], description: 'Kept' });
  });
});
