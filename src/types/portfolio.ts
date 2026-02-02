export interface PortfolioItem {
  name: string;
  type: string;
  defi_protocol?: string | null;
  exposure?: string;
  url: string;
  img: string;
  balance: number;
  value: number;
}

export interface Portfolio {
  total?: {
    value: number;
  };
  positions: {
    [key: string]: PortfolioItem;
  };
}

export interface HistoricPortfolioEntry {
  total: number;
  type: {
    governance: number;
    defi: number;
    stablecoin: number;
    native: number;
    other: number;
  };
  exposure: {
    eth: number;
    btc: number;
    governance: number;
    'usd stablecoins': number;
    other: number;
  };
}

export interface HistoricPortfolio {
  [date: string]: HistoricPortfolioEntry;
}
