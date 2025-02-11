// Import required libraries
const knex = require('knex')({
  client: 'pg' // Change to your database client, e.g., 'mysql' or 'sqlite3'
});

import querystring from  'qs';




// Function to build and log the Knex query
function buildKnexQuery(parsedQuery) {
  const knexConditions = mapToKnexJsonPathConditions(parsedQuery);
  let knexQuery = knex('your_table');

  knexConditions.forEach(condition => {
    knexQuery = knexQuery.whereJsonPath(condition.path, condition.jsonPath, condition.condition);
  });

  console.log(knexQuery.toString());
  return knexQuery;
}

// Main function to parse, convert, and test
function main() {
  const queryStr = 'metadata.authors[]=Alice Smith&metadata[int]==2&metadata.type[$in]=Book&metadata.type[$in]=Article&metadata.published[$gte]=2022&$or[0][archived][$ne]=true&$or[1][roomId]=2';
  const parsedQuery = parseAndGroupQuery(queryStr);

  console.log('Parsed Query:');
  console.log(JSON.stringify(parsedQuery, null, 2));

  console.log('\nKnex Query:');
  buildKnexQuery(parsedQuery);
}

// Run the main function
main();