

export function isPathAllowed(schema, path) {
  // Split the path into segments
  const keys = path.split('.');
  let currentSchema = schema;
  // Traverse the schema using the keys
  for (const key of keys) {
    // Check if the current schema is an object type
    if (currentSchema.type !== 'object' || !currentSchema.properties) {
      return false; // Invalid path if not an object
    }
    // Check if the key exists in properties
    if (currentSchema.properties[key]) {
      // Move to the next schema in the path
      currentSchema = currentSchema.properties[key];
    } else if (currentSchema.additionalProperties) {
      return !!currentSchema.additionalProperties; 
    } else {
      return false; // Key doesn't exist and additional properties are not allowed
    }
  }

  return true; // All keys are valid in the schema
}
// Helper function to check if a schema is a TypeBox TObject
const TypeGuard = {
  TObject: (schema) => schema && schema[Symbol.for('TypeBox.Kind')] === 'Object',
};


export function isObjectAtPath(schema, path) {
  // Split the path into segments
  const keys = path.split('.');
  let currentSchema = schema;

  // Traverse the schema using the keys
  for (const key of keys) {
    if (currentSchema.type !== 'object' || !currentSchema.properties || !currentSchema.properties[key]) {
      console.log(`Invalid path at key: ${key}`);
      return false; // Path is not valid
    }
    currentSchema = currentSchema.properties[key];
  }

  // Check if the final object is a Type.Object
  const isObject = TypeGuard.TObject(currentSchema);
  console.log(`Final schema at path: ${path}`, currentSchema, 'Is Object:', isObject);
  return isObject; // Returns true or false
}



// Helper function to unflatten an object
function unflatten(data) {
    const result = {};
    for (const key in data) {
      const keys = key.split('.');
      keys.reduce((acc, part, index) => {
        if (index === keys.length - 1) {
          acc[part] = data[key];
        } else {
          acc[part] = acc[part] || {};
        }
        return acc[part];
      }, result);
    }
    return result;
  }


export const jsonFilterHook = (schema) => async (context, next) => {
  let { query } = context.params;
  const jsonFilters = [];
  const remainingFilters = [];

  // if the path is not allowed, throw an error


  if (query) {
    Object.keys(query).forEach((filter) => {
      if (isPathAllowed(schema, filter)) {
        jsonFilters.push({[filter]: query[filter]});
      }else{
        remainingFilters.push({[filter]: query[filter]});
      }
    });
    context.params.$jsonFilter = jsonFilters;
    context.params.query = remainingFilters;
  }

  await next(); 

}

export function jsonFilterResolver(builder, params, Model) {
  const jsonFilters = params?.$jsonFilter;

  // allows select of jsonb paths
  if(jsonFilters){
      jsonFilter(builder, jsonFilters, Model);
  }
}


export function jsonFilter(builder, filters) {
  

  // if the path IS allowed and the operator is $in or $nin

  // if the path IS allowed and the operator is $eq or $neq or $gt or $gte or $lt or $lte
  // knex('users').whereJsonPath('json_col', '$.age', '>', 18);
  // knex('users').whereJsonPath('json_col', '$.name', '=', 'username');
  builder.whereJsonPath()

  // if the path IS allowed and the operator is $like or $ilike



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

// export function jsonFilter(builder, filters) {
//   if (filters && Array.isArray(filters)) {
//     filters.forEach(({ column, path, value, operator = '=' }) => {
//       // Ensure the operator is valid
//       const validOperators = ['=', '!=', '<', '>', '<=', '>=', 'LIKE', 'ILIKE'];
//       if (!validOperators.includes(operator.toUpperCase())) {
//         throw new Error(`Invalid operator: ${operator}`);
//       }

//       // Apply JSON path filtering using the specified operator
//       builder.whereJsonPath(column, `$.${path}`, operator, value);
//     });
//   }
// }


export function jsonSelect(builder, selects, knexModel) {
    if (selects && Array.isArray(selects)) {
        selects.forEach((path) => {
            let column = path.split('.')[0]
            let backPath = path.split('.').slice(1).join('.')
            let name = path

            // Apply JSON path filtering using the specified operator
            builder.jsonExtract(column, `$.${backPath}`,knexModel.raw(`"${name}"`));

        });
    }
  }


export const jsonSelectHook = (schema) => async (context, next) => {
  const { query } = context.params;
  const jsonSelects = [];
  const remainingSelects = [];

  if (query && query.$select) {
    query.$select.forEach((path) => {
      if (isJsonPathInSchema(schema, path)) {
        jsonSelects.push(path);
      } else {
        remainingSelects.push(path);
      }
    });
    context.params.$jsonSelect = jsonSelects;
    context.params.query.$select = remainingSelects.length > 0 ? remainingSelects : ['id'];
  }


  await next();

  // Unflatten the objects in the result data array
  if (context.result && Array.isArray(context.result.data)) {
    context.result.data = context.result.data.map(unflatten);
  }
  return context;
}



export function jsonSelectResolver(builder, params, Model) {
    const jsonSelects = params?.$jsonSelect;

    // allows select of jsonb paths
    if(jsonSelects){
        jsonSelect(builder, jsonSelects, Model);
    }
}
