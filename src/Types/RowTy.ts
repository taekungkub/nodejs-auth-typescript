

export interface RowTy
{
    fieldCount: number;
    affectedRows: number;
    insertId:  number ;
    serverStatus:  number;
    warningCount:  number;
    message: string;
    protocol41: Boolean,
    changedRows: number;
  }