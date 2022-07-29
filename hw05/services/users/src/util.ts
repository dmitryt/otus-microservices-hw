export function generateInsertSQLRequest(tableName: string, fields: string[], data: {[key: string]: string}): [string, string[]] {
  const values = fields.map((field) => data[field] || '').filter(Boolean);
  const valuesExpr = Array.from(new Array(values.length)).map((_, i) => `$${i + 1}`).join(', ');
  return [
    `INSERT INTO ${tableName}(${fields.join(', ')}) VALUES(${valuesExpr}) RETURNING *`,
    values,
  ];
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