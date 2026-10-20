import { canonicalizeArticleUrl, normalizeCategories } from './articleNormalizer.js';
import type { ImportedArticle } from './articleStore.js';

const BEEFY_ORIGIN = 'https://beefy.com';
const LISTING_PATH = '/page-data/articles';
export const BEEFY_ARTICLE_CUTOFF = '2024-05-30T00:00:00.000Z';

export interface BeefySource {
  fetchArticles(): Promise<BeefyFetchResult>;
}

export interface BeefyFetchResult {
  articles: ImportedArticle[];
  failed: number;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class BeefyGatsbySource implements BeefySource {
  constructor(
    private readonly fetcher: FetchLike = fetch,
    private readonly maxPages = 100,
    private readonly delayMs = 150,
  ) {}

  async fetchArticles(): Promise<BeefyFetchResult> {
    const byUrl = new Map<string, ImportedArticle>();
    let failed = 0;

    for (let page = 1; page <= this.maxPages; page += 1) {
      const document = await this.fetchListingPage(page);
      if (document === null) break;

      const edges = getEdges(document);
      if (edges.length === 0) break;

      for (const edge of edges) {
        try {
          const article = toImportedArticle(edge);
          if (article.date < BEEFY_ARTICLE_CUTOFF) continue;
          byUrl.set(article.link, article);
        } catch (error) {
          failed += 1;
          console.error('Skipping invalid Beefy article:', error);
        }
      }

      await wait(this.delayMs);
    }

    return { articles: [...byUrl.values()], failed };
  }

  private async fetchListingPage(page: number): Promise<unknown | null> {
    const pathname = page === 1
      ? `${LISTING_PATH}/page-data.json`
      : `${LISTING_PATH}/page/${page}/page-data.json`;
    const response = await fetchWithRetry(this.fetcher, `${BEEFY_ORIGIN}${pathname}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Beefy listing page ${page} failed with ${response.status}`);
    return response.json();
  }
}

async function fetchWithRetry(fetcher: FetchLike, url: string, attempts = 3): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetcher(url, { signal: controller.signal, headers: { 'User-Agent': 'Staworth-Article-Sync/1.0' } });
      if (response.ok || response.status === 404 || response.status < 500 || attempt === attempts - 1) return response;
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) throw error;
    } finally {
      clearTimeout(timeout);
    }
    await wait(250 * (attempt + 1));
  }
  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

function getEdges(document: unknown): unknown[] {
  if (!document || typeof document !== 'object') return [];
  const record = document as { result?: { data?: { allMarkdownRemark?: { edges?: unknown[] } } } };
  return record.result?.data?.allMarkdownRemark?.edges ?? [];
}

function toImportedArticle(edge: unknown): ImportedArticle {
  const node = (edge as { node?: unknown }).node;
  if (!node || typeof node !== 'object') throw new Error('Listing edge has no node');
  const record = node as {
    frontmatter?: { title?: unknown; date?: unknown; short_description?: unknown; tags?: unknown; header_image?: unknown };
    fields?: { slug?: unknown };
  };
  const frontmatter = record.frontmatter;
  const slug = record.fields?.slug;
  if (!frontmatter || typeof frontmatter.title !== 'string' || typeof frontmatter.date !== 'string' || typeof slug !== 'string') {
    throw new Error('Listing edge is missing title, date, or slug');
  }

  const title = frontmatter.title.trim();
  const description = typeof frontmatter.short_description === 'string' ? frontmatter.short_description.trim() : '';
  if (!description) throw new Error(`Listing edge is missing short_description for ${title}`);

  const image = extractImage(frontmatter.header_image);
  if (!image) throw new Error(`Listing edge is missing header_image for ${title}`);

  const categories = normalizeCategories(frontmatter.tags, ['beefy']);
  if (/\bqidao\b/i.test(`${title} ${description}`) && !categories.includes('qidao')) categories.push('qidao');

  const date = new Date(frontmatter.date);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid Beefy date for ${title}: ${frontmatter.date}`);

  return {
    link: canonicalizeArticleUrl(`${BEEFY_ORIGIN}/articles/${slug}/`),
    title,
    date: date.toISOString(),
    description,
    image,
    categories,
    source: 'beefy',
  };
}

function extractImage(headerImage: unknown): string | null {
  if (typeof headerImage === 'string') return new URL(headerImage, BEEFY_ORIGIN).toString();
  if (!headerImage || typeof headerImage !== 'object') return null;
  const image = headerImage as { childImageSharp?: { gatsbyImageData?: { images?: { sources?: Array<{ type?: string; srcSet?: string }>; fallback?: { src?: string } } } } };
  const images = image.childImageSharp?.gatsbyImageData?.images;
  const webp = images?.sources?.find(source => source.type === 'image/webp')?.srcSet;
  const source = webp?.split(',').at(-1)?.trim().split(/\s+/)[0] ?? images?.fallback?.src;
  return source ? new URL(source, BEEFY_ORIGIN).toString() : null;
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
