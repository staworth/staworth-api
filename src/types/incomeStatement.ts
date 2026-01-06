export interface IncomeStatementLineItem {
  id: string;
  label: string;
  type: 'line_item';
  value: number;
}

export interface IncomeStatementSection {
  id: string;
  label: string;
  type: 'section';
  value: number;
  items: IncomeStatementLineItem[];
}

export interface IncomeStatement {
  statement: string;
  statement_date: string;
  version: string;
  entity: string;
  last_updated: string;
  currency: string;
  sections: IncomeStatementSection[];
}

export interface HistoricIncomeStatementEntry {
  [date: string]: IncomeStatementSection[];
}

export interface HistoricIncomeStatement {
  statement: string;
  version: string;
  entity: string;
  last_updated: string;
  currency: string;
  sections: HistoricIncomeStatementEntry[];
}
