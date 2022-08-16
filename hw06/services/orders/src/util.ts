import SQL, { SQLStatement } from 'sql-template-strings';

type IDataObj = {
  [key: string]: string;
};

export function generateInsertSQLRequest(tableName: string, fields: string[], data: IDataObj | IDataObj[]): SQLStatement {
  const exec = (data: IDataObj[]) => {
    return data.map((obj) => {
      const values = fields.map(key => obj[key] || '');
      return `(${values.join(',')})`;
    }).join(', ');
  };
  const valuesExpr = exec(Array.isArray(data) ? data : [data]);
  return SQL`INSERT INTO ${tableName}(${fields.join(', ')}) SELECT ${valuesExpr} WHERE RETURNING *`;
}

export function generateInsertFromSelectSQLRequest(tableName: string, fields: string[], data: IDataObj | IDataObj[]): SQLStatement {
  const exec = (data: IDataObj[]) => {
    return data.map((obj) => {
      const values = fields.map(key => obj[key] || '');
      return `(${values.join(',')})`;
    }).join(', ');
  };
  const valuesExpr = exec(Array.isArray(data) ? data : [data]);
  return SQL`INSERT INTO ${tableName}(${fields.join(', ')}) VALUES ${valuesExpr} RETURNING *`;
}

export function generateUpdateSQLRequest(tableName: string, fields: string[], data: {[key: string]: string}, id: string): [string, string[]] {
  const nonEmptyFields = fields.filter((field) => data[field] || '');
  const setExpr = nonEmptyFields.map((field, i) => `${field}=$${i + 1}`).join(', ');
  const values = nonEmptyFields.map((field) => data[field]);
  return [
    `UPDATE ${tableName} SET ${setExpr} WHERE id=${id} RETURNING *`,
    values,
  ];
}