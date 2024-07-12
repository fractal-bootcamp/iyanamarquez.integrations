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

export interface GristTableRecipient {
  id: number;
  fields: {
    email: string;
    name: string;
  };
}

export type GristTableRecipientObject = {
  records: GristTableRecipient[];
};
