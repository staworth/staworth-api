export interface PortfolioItem {
  balance?: number;
  value: number;
}

export type PortfolioData = Record<string, PortfolioItem>;
