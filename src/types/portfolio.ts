export interface PortfolioItem {
  name: string;
  type: string;
  defi_protocol?: string | null;
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
  governance: number;
  defi: number;
  stablecoin: number;
  total: number;
}

export interface HistoricPortfolio {
  [date: string]: HistoricPortfolioEntry;
}
