export interface BalanceSheetLineItem {
  id: string;
  label: string;
  type: 'line_item';
  value: number;
}

export interface BalanceSheetSubsection {
  id: string;
  label: string;
  type: 'subsection';
  value: number;
  items: BalanceSheetLineItem[];
}

export interface BalanceSheetSection {
  id: string;
  label: string;
  type: 'section';
  value: number;
  items: BalanceSheetSubsection[];
}

export interface BalanceSheet {
  statement: string;
  statement_date: string;
  version: string;
  entity: string;
  last_updated: string;
  currency: string;
  sections: BalanceSheetSection[];
}

export interface HistoricBalanceSheetEntry {
  [date: string]: BalanceSheetSection[];
}

export interface HistoricBalanceSheet {
  statement: string;
  version: string;
  entity: string;
  last_updated: string;
  currency: string;
  historic_statements: HistoricBalanceSheetEntry[];
}
