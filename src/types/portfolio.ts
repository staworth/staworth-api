export interface PortfolioItem {
  type: string;
  defi_protocol?: string | null;
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
