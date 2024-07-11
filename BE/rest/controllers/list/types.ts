export interface Table {
  id: string;
  fields: {
    primaryViewId?: number;
    summarySourceTable?: number;
    onDemand?: boolean;
    rawViewSectionRef?: number;
    recordCardViewSectionRef?: number;
    tableRef?: number;
  };
}

export interface GristTablesResponse {
  tables: Table[];
}
