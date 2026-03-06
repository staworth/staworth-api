export interface Article {
  link: string;
  title: string;
  date: string;
  category: string;
  categories?: string[];
  description: string;
  image: string;
}

export type ArticlesData = Record<string, Article>;
