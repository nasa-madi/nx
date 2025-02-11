// api/src/hooks/jsonFilter.js
export function jsonFilter(builder, filters) {
  if (filters && Array.isArray(filters)) {
    filters.forEach(({ column, path, value, operator = '=' }) => {
      // Ensure the operator is valid
      const validOperators = ['=', '!=', '<', '>', '<=', '>=', 'LIKE', 'ILIKE'];
      if (!validOperators.includes(operator.toUpperCase())) {
        throw new Error(`Invalid operator: ${operator}`);
      }

      // Apply JSON path filtering using the specified operator
      builder.whereJsonPath(column, `$.${path}`, operator, value);
    });
  }
}